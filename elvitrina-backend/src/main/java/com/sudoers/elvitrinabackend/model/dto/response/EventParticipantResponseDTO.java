package com.sudoers.elvitrinabackend.model.dto.response;

import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.model.entity.Seats;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventParticipantResponseDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userImage;
    private Long eventId;
    private String eventTitle;
    private Long ticketId;
    private String ticketType;
    private Boolean attended;
    private LocalDateTime registrationDate;
    private Boolean hasAccessToChat;
    private Boolean hasAccessToRecordings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private EventTicketResponseDTO eventTicket;
    private List<Seats> seats;
}