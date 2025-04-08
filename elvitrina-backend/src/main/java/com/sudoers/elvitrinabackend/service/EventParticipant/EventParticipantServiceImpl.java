package com.sudoers.elvitrinabackend.service.EventParticipant;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventParticipant;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.model.mapper.EventParticipantMapper;
import com.sudoers.elvitrinabackend.repository.EventParticipantRepository;
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
public class EventParticipantServiceImpl implements EventParticipantService {

    private final EventParticipantRepository eventParticipantRepository;
    private final UserRepository userRepository;
    private final VirtualEventRepository virtualEventRepository;
    private final EventParticipantMapper eventParticipantMapper;

    @Autowired
    public EventParticipantServiceImpl(EventParticipantRepository eventParticipantRepository,
                                       UserRepository userRepository,
                                       VirtualEventRepository virtualEventRepository,
                                       EventParticipantMapper eventParticipantMapper) {
        this.eventParticipantRepository = eventParticipantRepository;
        this.userRepository = userRepository;
        this.virtualEventRepository = virtualEventRepository;
        this.eventParticipantMapper = eventParticipantMapper;
    }

    @Override
    @Transactional
    public EventParticipantResponseDTO saveEventParticipant(EventParticipantRequestDTO requestDTO) {
        EventParticipant participant = eventParticipantMapper.toEntity(requestDTO);
        participant.setTimestamp(LocalDateTime.now());

        // Link to User
        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            participant.setUser(user);
        }

        // Link to VirtualEvent
        if (requestDTO.getEventId() != null) {
            VirtualEvent virtualEvent = virtualEventRepository.findById(requestDTO.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + requestDTO.getEventId()));
            participant.setVirtualEvent(virtualEvent);
        }

        EventParticipant savedParticipant = eventParticipantRepository.save(participant);
        return eventParticipantMapper.toResponseDTO(savedParticipant);
    }

    @Override
    public List<EventParticipantResponseDTO> getAllEventParticipants() {
        return eventParticipantRepository.findAll().stream()
                .map(eventParticipantMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventParticipantResponseDTO getEventParticipantById(Long id) {
        EventParticipant participant = eventParticipantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event participant not found with id: " + id));
        return eventParticipantMapper.toResponseDTO(participant);
    }

    @Override
    @Transactional
    public void deleteEventParticipant(Long id) {
        if (!eventParticipantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event participant not found with id: " + id);
        }
        eventParticipantRepository.deleteById(id);
    }

    @Override
    @Transactional
    public EventParticipantResponseDTO updateEventParticipant(Long id, EventParticipantRequestDTO requestDTO) {
        EventParticipant existingParticipant = eventParticipantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event participant not found with id: " + id));

        eventParticipantMapper.updateEntityFromDTO(requestDTO, existingParticipant);
        existingParticipant.setTimestamp(LocalDateTime.now());

        // Update User link if provided
        if (requestDTO.getUserId() != null) {
            User user = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
            existingParticipant.setUser(user);
        }

        // Update VirtualEvent link if provided
        if (requestDTO.getEventId() != null) {
            VirtualEvent virtualEvent = virtualEventRepository.findById(requestDTO.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + requestDTO.getEventId()));
            existingParticipant.setVirtualEvent(virtualEvent);
        }

        EventParticipant updatedParticipant = eventParticipantRepository.save(existingParticipant);
        return eventParticipantMapper.toResponseDTO(updatedParticipant);
    }

    @Override
    public Page<EventParticipantResponseDTO> getEventParticipantsPaginated(Pageable pageable) {
        return eventParticipantRepository.findAll(pageable)
                .map(eventParticipantMapper::toResponseDTO);
    }

    @Override
    public List<EventParticipantResponseDTO> getParticipantsByEventId(Long eventId) {
        if (!virtualEventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Virtual event not found with id: " + eventId);
        }
        return eventParticipantRepository.findByVirtualEventEventId(eventId).stream()
                .map(eventParticipantMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}