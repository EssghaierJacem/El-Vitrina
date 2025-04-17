package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageResponseDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime sentAt;
    private boolean delivered;
    private boolean read;

    public MessageResponseDTO(Message message) {
        this.id = message.getId();
        this.senderId = message.getSender().getId();
        this.receiverId = message.getReceiver().getId();
        this.content = message.getContent();
        this.sentAt = message.getSentAt();
        this.read = message.isRead();
        this.delivered = message.isDelivered();
    }


}
