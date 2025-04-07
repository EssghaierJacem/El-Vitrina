package com.sudoers.elvitrinabackend.service.messages;

import com.sudoers.elvitrinabackend.model.dto.MessageDTO;
import com.sudoers.elvitrinabackend.model.entity.Message;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.MessageRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(MessageDTO messageDTO) {
        User sender = userRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(messageDTO.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(messageDTO.getContent());
        message.setSentAt(LocalDateTime.now());

        return messageRepository.save(message);
    }
}
