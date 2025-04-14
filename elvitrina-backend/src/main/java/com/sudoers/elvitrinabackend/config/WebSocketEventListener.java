package com.sudoers.elvitrinabackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private static final Map<Long, Set<String>> userSessions = new ConcurrentHashMap<>();
    private static final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
        if (sessionAttributes == null) {
            System.err.println("Session attributes are null in CONNECT event.");
            return;
        }

        Object rawToken = sessionAttributes.get("Authorization");
        if (rawToken != null && rawToken instanceof String token && token.startsWith("Bearer ")) {
            try {
                Long userId = tokenProvider.getUserIdFromJWT(token.substring(7));
                String sessionId = accessor.getSessionId();

                userSessions.computeIfAbsent(userId, k -> ConcurrentHashMap.newKeySet()).add(sessionId);
                sessionToUser.put(sessionId, userId);

                System.out.println(" WebSocket CONNECTED: user=" + userId + ", session=" + sessionId);
                new Thread(() -> {
                    try {
                        Thread.sleep(500);
                        broadcastOnlineUsers();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }).start();
            } catch (Exception e) {
                System.err.println("Failed to parse token: " + e.getMessage());
            }
        } else {
            System.err.println("Missing or invalid Authorization token in session attributes");
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        Long userId = sessionToUser.remove(sessionId);

        if (userId != null) {
            Set<String> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(sessionId);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                    System.out.println("WebSocket DISCONNECTED (last session): user=" + userId);
                } else {
                    System.out.println("WebSocket DISCONNECTED (partial): user=" + userId + ", remaining=" + sessions.size());
                }
                broadcastOnlineUsers();
            }
        } else {
            System.err.println("Could not find userId for disconnected sessionId=" + sessionId);
        }
    }

    private void broadcastOnlineUsers() {
        Set<Long> online = userSessions.keySet();
        System.out.println("Broadcasting online users: " + online);
        messagingTemplate.convertAndSend("/topic/online-users", online);
    }

    public static boolean isUserOnline(Long userId) {
        return userSessions.containsKey(userId);
    }
}
