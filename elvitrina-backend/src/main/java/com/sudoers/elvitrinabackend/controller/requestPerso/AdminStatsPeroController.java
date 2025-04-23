package com.sudoers.elvitrinabackend.controller.requestPerso;

import com.sudoers.elvitrinabackend.model.dto.EnhancedStatsPersoDTO;
import com.sudoers.elvitrinabackend.repository.ProposalPersoRepository;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsPeroController {

    private final RequestPersoRepository requestPersoRepository;
    private final ProposalPersoRepository proposalPersoRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<EnhancedStatsPersoDTO> getStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        EnhancedStatsPersoDTO stats = EnhancedStatsPersoDTO.builder()
                .totalRequests(requestPersoRepository.count())
                .totalProposals(proposalPersoRepository.count())
                .activeUsers(userRepository.countActiveUsers())
                .requestsByDate(convertToMap(requestPersoRepository.countRequestsByDate()))
                .proposalsByDate(convertToMap(proposalPersoRepository.countProposalsByDate()))
                .requestsByStatus(convertToMap(requestPersoRepository.countRequestsByStatus()))
                .topRequesters(requestPersoRepository.findTopRequesters(5))
                .topProposers(proposalPersoRepository.findTopProposers(5))
                .build();

        return ResponseEntity.ok(stats);
    }

    private Map<String, Long> convertToMap(List<Object[]> results) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] result : results) {
            String key = (result[0] != null) ? result[0].toString() : "UNKNOWN";
            Long value = (result[1] != null) ? ((Number) result[1]).longValue() : 0L;
            map.put(key, value);
        }
        return map;
    }

}
