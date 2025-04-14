package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.config.WebSocketEventListener;
import com.sudoers.elvitrinabackend.model.dto.MessageDTO;
import com.sudoers.elvitrinabackend.model.dto.MessageResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.TypingDTO;
import com.sudoers.elvitrinabackend.model.entity.Message;
import com.sudoers.elvitrinabackend.service.messages.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class ChatController {

    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    // 🔹 WebSocket message handler
    @MessageMapping("/chat")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        MessageResponseDTO saved = messageService.sendMessage(messageDTO);

        // Send to receiver
        messagingTemplate.convertAndSend("/queue/messages/" + messageDTO.getReceiverId(), saved);

    }

    // 🔹 WebSocket typing indicator handler
    @MessageMapping("/typing")
    public void sendTyping(@Payload TypingDTO typing) {
        messagingTemplate.convertAndSendToUser(
                String.valueOf(typing.getReceiverId()),
                "/queue/typing",
                typing
        );
    }

    // 🔹 Get conversation between users
    @GetMapping("/{senderId}/{receiverId}")
    public List<Message> getConversation(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return messageService.getConversation(senderId, receiverId);
    }

    // 🔹 Store message via REST (optional fallback or debugging)
    @PostMapping("/store")
    public MessageResponseDTO storeMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO);
    }

    // 🔹 Mark a list of messages as read
    @PostMapping("/mark-as-read")
    public void markAsRead(@RequestBody List<Long> messageIds) {
        messageService.markMessagesAsRead(messageIds);
    }

    // 🔹 Check if a user is online (via WebSocket presence tracking)
    @GetMapping("/status/{userId}")
    public boolean isUserOnline(@PathVariable Long userId) {
        return WebSocketEventListener.isUserOnline(userId);
    }

    // 🔹 Get the last exchanged message between two users
    @GetMapping("/last/{userId1}/{userId2}")
    public Message getLastMessage(@PathVariable Long userId1, @PathVariable Long userId2) {
        return messageService.getLastMessageBetween(userId1, userId2);
    }
}
