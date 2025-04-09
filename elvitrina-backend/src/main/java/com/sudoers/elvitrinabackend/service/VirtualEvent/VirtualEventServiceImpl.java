package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.Store;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.model.enums.EventMode;
import com.sudoers.elvitrinabackend.model.enums.EventType;
import com.sudoers.elvitrinabackend.model.mapper.VirtualEventMapper;
import com.sudoers.elvitrinabackend.repository.StoreRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import com.sudoers.elvitrinabackend.repository.VirtualEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true) // Default to read-only, override for write operations
public class VirtualEventServiceImpl implements VirtualEventService {

    private final VirtualEventRepository virtualEventRepository;
    private final VirtualEventMapper virtualEventMapper;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    @Autowired
    public VirtualEventServiceImpl(VirtualEventRepository virtualEventRepository,
                                   VirtualEventMapper virtualEventMapper,
                                   UserRepository userRepository,
                                   StoreRepository storeRepository) {
        this.virtualEventRepository = virtualEventRepository;
        this.virtualEventMapper = virtualEventMapper;
        this.userRepository = userRepository;
        this.storeRepository = storeRepository;
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO createEvent(VirtualEventRequestDTO requestDTO) {
        VirtualEvent virtualEvent = virtualEventMapper.toEntity(requestDTO);
        setEventRelationships(virtualEvent, requestDTO);
        if (virtualEvent.getStatus() == null) {
            virtualEvent.setStatus("DRAFT");
        }
        VirtualEvent savedEvent = virtualEventRepository.save(virtualEvent);
        return virtualEventMapper.toResponseDTO(savedEvent);
    }

    @Override
    public VirtualEventResponseDTO getEventById(Long id) {
        VirtualEvent virtualEvent = virtualEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + id));
        return virtualEventMapper.toResponseDTO(virtualEvent);
    }

    @Override
    public List<VirtualEventResponseDTO> getAllEvents() {
        return virtualEventRepository.findAll().stream()
                .map(virtualEventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<VirtualEventResponseDTO> getEventsPaginated(Pageable pageable) {
        return virtualEventRepository.findAll(pageable)
                .map(virtualEventMapper::toResponseDTO);
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO updateEvent(Long id, VirtualEventRequestDTO requestDTO) {
        VirtualEvent virtualEvent = virtualEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + id));
        virtualEventMapper.updateEntityFromDTO(requestDTO, virtualEvent);
        setEventRelationships(virtualEvent, requestDTO);
        VirtualEvent updatedEvent = virtualEventRepository.save(virtualEvent);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        if (!virtualEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Virtual event not found with id: " + id);
        }
        virtualEventRepository.deleteById(id);
    }

    @Override
    public List<VirtualEventResponseDTO> getUpcomingEvents(int limit) {
        return virtualEventRepository.findByEventDateAfterOrderByEventDateAsc(LocalDateTime.now())
                .stream()
                .limit(limit)
                .map(virtualEventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO updateEventStatus(Long eventId, String status) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + eventId));
        validateStatusTransition(event.getStatus(), status);
        event.setStatus(status);
        VirtualEvent updatedEvent = virtualEventRepository.save(event);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    public List<VirtualEventResponseDTO> filterEventsByTypeAndMode(EventType eventType, EventMode eventMode) {
        return virtualEventRepository.findByEventTypeAndEventMode(eventType, eventMode)
                .stream()
                .map(virtualEventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VirtualEventResponseDTO> searchEvents(String keyword) {
        return virtualEventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(virtualEventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<VirtualEventResponseDTO> getUpcomingEventsCalendar() {
        LocalDateTime now = LocalDateTime.now();
        return virtualEventRepository.findByEventDateAfterOrSessionsStartTimeAfter(now, now)
                .stream()
                .map(virtualEventMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean checkEventCapacity(Long eventId) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        int currentParticipants = event.getParticipants() != null ? event.getParticipants().size() : 0;
        return event.getMaxParticipants() != null && event.getMaxParticipants() > currentParticipants;
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO startLiveStream(Long eventId, String streamUrl) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        if (!"SCHEDULED".equals(event.getStatus())) {
            throw new IllegalStateException("Cannot start stream for event in status: " + event.getStatus());
        }
        event.setStreamUrl(streamUrl);
        event.setStatus("LIVE");
        VirtualEvent updatedEvent = virtualEventRepository.save(event);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO stopLiveStream(Long eventId) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        if (!"LIVE".equals(event.getStatus())) {
            throw new IllegalStateException("Cannot stop stream for event in status: " + event.getStatus());
        }
        event.setStreamUrl(null);
        event.setStatus("COMPLETED");
        VirtualEvent updatedEvent = virtualEventRepository.save(event);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO toggleChat(Long eventId, boolean enable) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        event.setChatChannelId(enable ? "active-channel-" + eventId : null);
        VirtualEvent updatedEvent = virtualEventRepository.save(event);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }

    @Override
    public VirtualEventResponseDTO getEventSessionSchedule(Long eventId) {
        VirtualEvent event = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return virtualEventMapper.toResponseDTO(event);
    }

    private void setEventRelationships(VirtualEvent virtualEvent, VirtualEventRequestDTO requestDTO) {
        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            virtualEvent.setUser(user);
        }
        if (requestDTO.getStoreId() != null) {
            Store store = storeRepository.findById(requestDTO.getStoreId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + requestDTO.getStoreId()));
            virtualEvent.setStore(store);
        }
    }

    private void validateStatusTransition(String currentStatus, String newStatus) {
        // Example validation; customize based on your workflow
        if ("COMPLETED".equals(currentStatus) && !"COMPLETED".equals(newStatus)) {
            throw new IllegalStateException("Cannot change status from COMPLETED to " + newStatus);
        }
    }
}