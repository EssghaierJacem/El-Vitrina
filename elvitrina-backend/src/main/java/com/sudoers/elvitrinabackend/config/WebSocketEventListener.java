package com.sudoers.elvitrinabackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private static final Set<Long> onlineUsers = ConcurrentHashMap.newKeySet();

    @Autowired
    private TokenProvider tokenProvider;

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String token = accessor.getFirstNativeHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            try {
                Long userId = tokenProvider.getUserIdFromJWT(token.substring(7));
                onlineUsers.add(userId);
                accessor.getSessionAttributes().put("userId", userId);
                System.out.println("✅ User connected via WebSocket: " + userId);
            } catch (Exception e) {
                System.err.println("⛔ Failed to parse token for WebSocket connection: " + e.getMessage());
            }
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Object userIdObj = accessor.getSessionAttributes().get("userId");
        if (userIdObj != null) {
            try {
                Long userId = Long.valueOf(userIdObj.toString());
                onlineUsers.remove(userId);
                System.out.println("👋 User disconnected from WebSocket: " + userId);
            } catch (Exception e) {
                System.err.println("⛔ Failed to remove user from online list: " + e.getMessage());
            }
        }
    }

    public static boolean isUserOnline(Long userId) {
        return onlineUsers.contains(userId);
    }
}
