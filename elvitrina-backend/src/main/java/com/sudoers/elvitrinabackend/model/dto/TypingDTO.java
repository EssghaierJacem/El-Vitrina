package com.sudoers.elvitrinabackend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TypingDTO {
    private Long senderId;
    private Long receiverId;
    private boolean typing;

}