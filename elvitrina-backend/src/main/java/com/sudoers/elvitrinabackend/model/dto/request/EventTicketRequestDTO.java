package com.sudoers.elvitrinabackend.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

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
}
