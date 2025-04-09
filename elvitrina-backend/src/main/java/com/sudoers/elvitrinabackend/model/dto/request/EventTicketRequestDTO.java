package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventTicketRequestDTO {
    private String ticketType;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Long eventId;
    private Boolean isActive;
    private BigDecimal earlyBirdPricing; // For early bird pricing
    private LocalDateTime earlyBirdDeadline; // Deadline for early bird pricing
    private List<Long> sessionIds; // For multi-session tickets
}