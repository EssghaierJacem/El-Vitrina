package com.sudoers.elvitrinabackend.model.dto.response;

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
    private Long id;
    private String ticketType;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer soldCount;
    private Integer remainingCount;
    private Long eventId;
    private String eventTitle;
    private Boolean isValid;
    private String qrCodeUrl; // URL to the generated QR code
    private LocalDateTime validUntil;
    private BigDecimal earlyBirdPricing;
    private List<Long> sessionIds; // Sessions this ticket applies to
}