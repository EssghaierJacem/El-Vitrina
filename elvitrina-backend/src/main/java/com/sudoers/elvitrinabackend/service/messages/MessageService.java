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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public List<Message> markMessagesAsRead(List<Long> messageIds) {
        List<Message> messages = messageRepository.findAllById(messageIds);
        for (Message message : messages) {
            message.setRead(true);
        }
        return messageRepository.saveAll(messages);
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

    public Map<Long, Long> countUnreadMessagesPerSender(Long userId) {
        List<Object[]> results = messageRepository.countUnreadPerSender(userId);
        Map<Long, Long> map = new HashMap<>();
        for (Object[] row : results) {
            map.put((Long) row[0], (Long) row[1]);
        }
        return map;
    }

    public Map<Long, MessageResponseDTO> getLastMessagesForAllFriends(Long userId) {
        List<Message> lastMessages = messageRepository.findLastMessagesForUser(userId);
        Map<Long, MessageResponseDTO> map = new HashMap<>();

        for (Message message : lastMessages) {
            Long friendId = message.getSender().getId().equals(userId) ? message.getReceiver().getId() : message.getSender().getId();
            map.put(friendId, new MessageResponseDTO(message));
        }
        return map;
    }

}