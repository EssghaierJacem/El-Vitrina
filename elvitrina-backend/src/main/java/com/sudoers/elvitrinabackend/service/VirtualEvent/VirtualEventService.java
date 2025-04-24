package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VirtualEventService {
    VirtualEventResponseDTO createEvent(VirtualEventRequestDTO requestDTO);
    VirtualEventResponseDTO getEventById(Long id);
    List<VirtualEventResponseDTO>  getEventByStoreId(Long id);

    List<VirtualEventResponseDTO> getAllEvents();
    Page<VirtualEventResponseDTO> getEventsPaginated(Pageable pageable);
    VirtualEventResponseDTO updateEvent(Long id, VirtualEventRequestDTO requestDTO);
    void deleteEvent(Long id);
    List<VirtualEventResponseDTO> getUpcomingEvents(int limit);
    VirtualEventResponseDTO updateEventStatus(Long eventId, String status); // Consolidated changeEventStatus
    List<VirtualEventResponseDTO> filterEventsByTypeAndMode(EventType eventType, EventMode eventMode);
    List<VirtualEventResponseDTO> searchEvents(String keyword);
    List<VirtualEventResponseDTO> getUpcomingEventsCalendar();
    boolean checkEventCapacity(Long eventId);
    VirtualEventResponseDTO startLiveStream(Long eventId, String streamUrl);
    VirtualEventResponseDTO stopLiveStream(Long eventId);
    VirtualEventResponseDTO toggleChat(Long eventId, boolean enable);
    VirtualEventResponseDTO getEventSessionSchedule(Long eventId);
}