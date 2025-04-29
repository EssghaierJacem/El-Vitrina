package com.sudoers.elvitrinabackend.service.EventParticipant;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.EventParticipantRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventParticipantResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.*;
import com.sudoers.elvitrinabackend.model.mapper.EventParticipantMapper;
import com.sudoers.elvitrinabackend.repository.EventParticipantRepository;
import com.sudoers.elvitrinabackend.repository.EventTicketRepository;
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
    private final VirtualEventRepository virtualEventRepository;
    private final UserRepository userRepository;
    private final EventTicketRepository eventTicketRepository;
    private final EventParticipantMapper eventParticipantMapper;

    @Autowired
    public EventParticipantServiceImpl(EventParticipantRepository eventParticipantRepository,
                                       VirtualEventRepository virtualEventRepository,
                                       UserRepository userRepository,
                                       EventTicketRepository eventTicketRepository,
                                       EventParticipantMapper eventParticipantMapper) {
        this.eventParticipantRepository = eventParticipantRepository;
        this.virtualEventRepository = virtualEventRepository;
        this.userRepository = userRepository;
        this.eventTicketRepository = eventTicketRepository;
        this.eventParticipantMapper = eventParticipantMapper;
    }

    @Override
    @Transactional
    public EventParticipantResponseDTO saveEventParticipant(EventParticipantRequestDTO requestDTO) {
        EventParticipant participant = eventParticipantMapper.toEntity(requestDTO);
        participant.setCreatedAt(LocalDateTime.now());

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
    public EventParticipantResponseDTO getEventParticipantByUserId(Long userId) {
        EventParticipant participant = eventParticipantRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Event participant not found with userId: " + userId));
        System.out.println(participant.getId());
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
        existingParticipant.setUpdatedAt(LocalDateTime.now());

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

    @Override
    @Transactional
    public EventParticipantResponseDTO registerParticipant(EventParticipantRequestDTO requestDTO) {
        System.out.println("***********");
        System.out.println(requestDTO.getSeatIds());
        // Check if participant already exists
        if (eventParticipantRepository.existsByUserIdAndVirtualEventEventId(
                requestDTO.getUserId(), requestDTO.getEventId())) {
            throw new IllegalStateException("User already registered for this event");
        }

        // Get user and event
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestDTO.getUserId()));
        VirtualEvent event = virtualEventRepository.findById(requestDTO.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + requestDTO.getEventId()));

        // Create and save participant
        EventParticipant participant = new EventParticipant();
        participant.setUser(user);
        participant.setVirtualEvent(event);
        participant.setAttended(false);

        EventParticipant savedParticipant = eventParticipantRepository.save(participant);

        // Create and save ticket
        EventTicket ticket = new EventTicket();
        ticket.setName(event.getTitle());
        ticket.setDescription(event.getDescription());
        ticket.setPrice(event.getTicketPrice() * requestDTO.getTicketCount());
        ticket.setVirtualEvent(event);
        ticket.setEventParticipant(savedParticipant);
        List<Seats> seats = requestDTO.getSeatIds().stream()
                .map(seatId -> new Seats(null, seatId, ticket))
                .collect(Collectors.toList());
        ticket.setSeats(seats);
        EventTicket savedTicket = eventTicketRepository.save(ticket);
        System.out.println(savedTicket.getTicketId());

        // Update participant with ticket reference
        savedParticipant.setEventTicket(savedTicket);
        eventParticipantRepository.save(savedParticipant);

        return eventParticipantMapper.toResponseDTO(savedParticipant);
    }

    @Override
    public EventParticipantResponseDTO grantChatAccess(Long participantId, boolean enable) {
        EventParticipant participant = eventParticipantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with id: " + participantId));
        participant.setHasAccessToChat(enable);
        participant.setUpdatedAt(LocalDateTime.now());
        return eventParticipantMapper.toResponseDTO(eventParticipantRepository.save(participant));
    }

    @Override
    public EventParticipantResponseDTO provideRecordingAccess(Long participantId, boolean enable) {
        EventParticipant participant = eventParticipantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with id: " + participantId));
        participant.setHasAccessToRecordings(enable);
        participant.setUpdatedAt(LocalDateTime.now());
        return eventParticipantMapper.toResponseDTO(eventParticipantRepository.save(participant));
    }

    @Override
    public EventParticipantResponseDTO trackSessionAttendance(Long participantId, boolean attended) {
        EventParticipant participant = eventParticipantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with id: " + participantId));
        participant.setAttended(attended);
        participant.setUpdatedAt(LocalDateTime.now());
        return eventParticipantMapper.toResponseDTO(eventParticipantRepository.save(participant));
    }

    @Override
    public boolean validateParticipantTicket(Long participantId) {
        EventParticipant participant = eventParticipantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant not found with id: " + participantId));
        EventTicket ticket = participant.getEventTicket();
        if (ticket == null) {
            return false;
        }
        return ticket.getIsValid() && (ticket.getValidUntil() == null || ticket.getValidUntil().isAfter(LocalDateTime.now()));
    }
}