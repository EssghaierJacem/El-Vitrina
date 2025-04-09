package com.sudoers.elvitrinabackend.model.dto;

import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestDTO {
    private Long id;
    private Long senderId;
    private String senderFirstName;
    private String senderLastName;
    private Long receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private RequestStatus status;
    private LocalDateTime sentAt;
}
