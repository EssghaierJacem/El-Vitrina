package com.sudoers.elvitrinabackend.service.EventTicket;

import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.model.mapper.EventTicketMapper;
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
public class EventTicketServiceImpl implements EventTicketService {

    private final EventTicketRepository eventTicketRepository;
    private final VirtualEventRepository virtualEventRepository;
    private final EventTicketMapper eventTicketMapper;

    @Autowired
    public EventTicketServiceImpl(EventTicketRepository eventTicketRepository,
                                  VirtualEventRepository virtualEventRepository,
                                  EventTicketMapper eventTicketMapper) {
        this.eventTicketRepository = eventTicketRepository;
        this.virtualEventRepository = virtualEventRepository;
        this.eventTicketMapper = eventTicketMapper;
    }

    @Override
    @Transactional
    public EventTicketResponseDTO saveEventTicket(EventTicketRequestDTO requestDTO) {
        EventTicket eventTicket = eventTicketMapper.toEntity(requestDTO);
        eventTicket.setTimestamp(LocalDateTime.now());

        // Link to VirtualEvent if eventId is provided
        if (requestDTO.getEventId() != null) {
            VirtualEvent virtualEvent = virtualEventRepository.findById(requestDTO.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + requestDTO.getEventId()));
            eventTicket.setVirtualEvent(virtualEvent);
        }

        EventTicket savedTicket = eventTicketRepository.save(eventTicket);
        return eventTicketMapper.toResponseDTO(savedTicket);
    }

    @Override
    public List<EventTicketResponseDTO> getAllEventTickets() {
        return eventTicketRepository.findAll().stream()
                .map(eventTicketMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventTicketResponseDTO getEventTicketById(Long id) {
        EventTicket eventTicket = eventTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event ticket not found with id: " + id));
        return eventTicketMapper.toResponseDTO(eventTicket);
    }

    @Override
    @Transactional
    public void deleteEventTicket(Long id) {
        if (!eventTicketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event ticket not found with id: " + id);
        }
        eventTicketRepository.deleteById(id);
    }

    @Override
    @Transactional
    public EventTicketResponseDTO updateEventTicket(Long id, EventTicketRequestDTO requestDTO) {
        EventTicket existingTicket = eventTicketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event ticket not found with id: " + id));

        eventTicketMapper.updateEntityFromDTO(requestDTO, existingTicket);
        existingTicket.setTimestamp(LocalDateTime.now());

        // Update VirtualEvent link if eventId is provided
        if (requestDTO.getEventId() != null) {
            VirtualEvent virtualEvent = virtualEventRepository.findById(requestDTO.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Virtual event not found with id: " + requestDTO.getEventId()));
            existingTicket.setVirtualEvent(virtualEvent);
        }

        EventTicket updatedTicket = eventTicketRepository.save(existingTicket);
        return eventTicketMapper.toResponseDTO(updatedTicket);
    }

    @Override
    public Page<EventTicketResponseDTO> getEventTicketsPaginated(Pageable pageable) {
        return eventTicketRepository.findAll(pageable)
                .map(eventTicketMapper::toResponseDTO);
    }

    @Override
    public List<EventTicketResponseDTO> getTicketsByEventId(Long eventId) {
        if (!virtualEventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Virtual event not found with id: " + eventId);
        }
        return eventTicketRepository.findByVirtualEventEventId(eventId).stream()
                .map(eventTicketMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}