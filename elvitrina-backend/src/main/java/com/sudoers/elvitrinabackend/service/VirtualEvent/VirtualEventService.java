package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VirtualEventService {
    VirtualEventResponseDTO createEvent(VirtualEventRequestDTO requestDTO);
    VirtualEventResponseDTO getEventById(Long id);
    List<VirtualEventResponseDTO> getAllEvents();
    Page<VirtualEventResponseDTO> getEventsPaginated(Pageable pageable);
    VirtualEventResponseDTO updateEvent(Long id, VirtualEventRequestDTO requestDTO);
    void deleteEvent(Long id);
    List<VirtualEventResponseDTO> getUpcomingEvents(int limit);
    VirtualEventResponseDTO changeEventStatus(Long eventId, String newStatus);
}
