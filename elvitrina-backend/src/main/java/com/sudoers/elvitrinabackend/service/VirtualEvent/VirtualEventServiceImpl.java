package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.mapper.EventTicketMapper;
import com.sudoers.elvitrinabackend.model.mapper.VirtualEventMapper;
import com.sudoers.elvitrinabackend.model.dto.request.VirtualEventRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.VirtualEventResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.repository.EventTicketRepository;
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
public class VirtualEventServiceImpl implements VirtualEventService {

    private final VirtualEventRepository virtualEventRepository;
    private final VirtualEventMapper virtualEventMapper;
    private final EventTicketRepository eventTicketRepository;
    private final EventTicketMapper eventTicketMapper;

    @Autowired
    public VirtualEventServiceImpl(VirtualEventRepository virtualEventRepository,
                                   VirtualEventMapper virtualEventMapper,
                                   EventTicketRepository eventTicketRepository,
                                   EventTicketMapper eventTicketMapper) {
        this.virtualEventRepository = virtualEventRepository;
        this.virtualEventMapper = virtualEventMapper;
        this.eventTicketRepository = eventTicketRepository;
        this.eventTicketMapper = eventTicketMapper;
    }

    @Override
    @Transactional
    public VirtualEventResponseDTO createEvent(VirtualEventRequestDTO requestDTO) {
        VirtualEvent virtualEvent = virtualEventMapper.toEntity(requestDTO);
        virtualEvent.setTimestamp(LocalDateTime.now()); // Using timestamp instead of createdAt/updatedAt

        if (virtualEvent.getStatus() == null) {
            virtualEvent.setStatus("DRAFT");
        }

        // Handle tickets if provided in the request
        if (requestDTO.getTickets() != null && !requestDTO.getTickets().isEmpty()) {
            List<EventTicket> tickets = requestDTO.getTickets().stream()
                    .map(eventTicketMapper::toEntity)
                    .peek(ticket -> ticket.setVirtualEvent(virtualEvent))
                    .collect(Collectors.toList());
            virtualEvent.setTickets(tickets);
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
        virtualEvent.setTimestamp(LocalDateTime.now()); // Update timestamp
        if (requestDTO.getTickets() != null) {
            eventTicketRepository.deleteByVirtualEventEventId(id);
            List<EventTicket> tickets = requestDTO.getTickets().stream()
                    .map(eventTicketMapper::toEntity)
                    .peek(ticket -> ticket.setVirtualEvent(virtualEvent))
                    .collect(Collectors.toList());
            virtualEvent.setTickets(tickets);
        }

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
    public VirtualEventResponseDTO changeEventStatus(Long eventId, String newStatus) {
        VirtualEvent virtualEvent = virtualEventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + eventId));

        virtualEvent.setStatus(newStatus);
        virtualEvent.setTimestamp(LocalDateTime.now());

        VirtualEvent updatedEvent = virtualEventRepository.save(virtualEvent);
        return virtualEventMapper.toResponseDTO(updatedEvent);
    }
}