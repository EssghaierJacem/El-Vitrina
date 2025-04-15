package com.sudoers.elvitrinabackend.controller.user;

import com.sudoers.elvitrinabackend.config.WebSocketEventListener;
import com.sudoers.elvitrinabackend.model.dto.MessageDTO;
import com.sudoers.elvitrinabackend.model.dto.MessageResponseDTO;
import com.sudoers.elvitrinabackend.model.dto.TypingDTO;
import com.sudoers.elvitrinabackend.model.entity.Message;
import com.sudoers.elvitrinabackend.repository.MessageRepository;
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

    @MessageMapping("/chat")
    public void sendMessage(@Payload MessageDTO messageDTO) {
        MessageResponseDTO saved = messageService.sendMessage(messageDTO);

        messagingTemplate.convertAndSend("/queue/messages/" + messageDTO.getReceiverId(), saved);

        messagingTemplate.convertAndSend("/queue/messages/" + messageDTO.getSenderId(), saved);
    }
    @MessageMapping("/typing")
    public void sendTyping(@Payload TypingDTO typing) {
        // System.out.println(" Sending to /queue/typing." + typing.getReceiverId());
        messagingTemplate.convertAndSend("/queue/typing." + typing.getReceiverId(), typing);
    }

    @GetMapping("/{senderId}/{receiverId}")
    public List<Message> getConversation(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return messageService.getConversation(senderId, receiverId);
    }
/*
    @PostMapping("/store")
    public MessageResponseDTO storeMessage(@RequestBody MessageDTO messageDTO) {
        return messageService.sendMessage(messageDTO);
    }
*/
    @PostMapping("/mark-as-read")
    public void markAsRead(@RequestBody List<Long> messageIds) {
        List<Message> updatedMessages = messageService.markMessagesAsRead(messageIds);

        for (Message message : updatedMessages) {
            Long senderId = message.getSender().getId();
            MessageResponseDTO dto = new MessageResponseDTO(message);

            messagingTemplate.convertAndSend("/queue/messages/" + senderId, dto);
        }
    }


    @GetMapping("/status/{userId}")
    public boolean isUserOnline(@PathVariable Long userId) {
        return WebSocketEventListener.isUserOnline(userId);
    }

    @GetMapping("/last/{userId1}/{userId2}")
    public Message getLastMessage(@PathVariable Long userId1, @PathVariable Long userId2) {
        return messageService.getLastMessageBetween(userId1, userId2);
    }
}
