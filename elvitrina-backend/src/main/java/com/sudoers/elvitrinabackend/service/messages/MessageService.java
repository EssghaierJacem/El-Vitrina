package com.sudoers.elvitrinabackend.service.messages;

import com.sudoers.elvitrinabackend.model.dto.MessageDTO;
import com.sudoers.elvitrinabackend.model.dto.MessageResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Message;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.MessageRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public MessageResponseDTO sendMessage(MessageDTO messageDTO) {
        User sender = userRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(messageDTO.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageDTO.getContent());
        message.setSentAt(LocalDateTime.now());
        message.setDelivered(true);
        message.setRead(false);

        Message saved = messageRepository.save(message);

        return new MessageResponseDTO(
                saved.getId(),
                saved.getSender().getId(),
                saved.getReceiver().getId(),
                saved.getContent(),
                saved.getSentAt(),
                saved.isDelivered(),
                saved.isRead()
        );
    }


    public List<Message> getConversation(Long senderId, Long receiverId) {
        return messageRepository.findConversationBetweenUsers(senderId, receiverId);
    }

    public void markMessagesAsRead(List<Long> messageIds) {
        List<Message> messages = messageRepository.findAllById(messageIds);
        for (Message message : messages) {
            message.setRead(true);
        }
        messageRepository.saveAll(messages);
    }

    public Message getLastMessageBetween(Long user1, Long user2) {
        return messageRepository.findLastMessageBetweenUsers(user1, user2);
    }

    private MessageResponseDTO convertToResponseDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getSender().getId(),
                message.getReceiver().getId(),
                message.getContent(),
                message.getSentAt(),
                message.isDelivered(),
                message.isRead()
        );
    }
}
