package com.sudoers.elvitrinabackend.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTicketResponseDTO {
    private Long id;
    private String ticketType;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer soldCount;
    private Integer remainingCount;
    private Long eventId;
    private String eventTitle;
    private Boolean isActive;
}