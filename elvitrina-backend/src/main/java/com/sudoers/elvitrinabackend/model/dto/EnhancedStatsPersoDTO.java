package com.sudoers.elvitrinabackend.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class EnhancedStatsPersoDTO {
    private Long totalRequests;
    private Long totalProposals;
    private Long activeUsers;
    private Map<String, Long> requestsByDate;
    private Map<String, Long> proposalsByDate;
    private Map<String, Long> requestsByStatus;
    private List<Object[]> topRequesters;
    private List<Object[]> topProposers;
}