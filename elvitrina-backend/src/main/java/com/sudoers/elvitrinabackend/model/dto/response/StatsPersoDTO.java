package com.sudoers.elvitrinabackend.model.dto.response;
import lombok.*;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsPersoDTO {
    private Long totalRequests;
    private Long totalProposals;
    private Map<String, Long> requestsByDate;
    private Map<String, Long> proposalsByDate;
}
