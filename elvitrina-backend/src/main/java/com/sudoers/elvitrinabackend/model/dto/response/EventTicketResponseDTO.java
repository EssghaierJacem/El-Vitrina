package com.sudoers.elvitrinabackend.model.dto.response;

import com.sudoers.elvitrinabackend.model.entity.Seats;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTicketResponseDTO {
    private Long ticketId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantityAvailable;
    private Integer quantityRemaining;
    private String type;
    private LocalDateTime validUntil;
    private String qrCodeHash;
    private Boolean isValid;
    private List<Seats> seats;
}