package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantRequestDTO {
    private Long userId;
    private Long eventId;
    private Integer ticketCount;
    private List<String> seatIds;
}