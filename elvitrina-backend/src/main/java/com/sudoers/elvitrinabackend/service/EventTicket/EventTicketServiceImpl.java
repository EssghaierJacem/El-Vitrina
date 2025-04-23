package com.sudoers.elvitrinabackend.service.EventTicket;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.sudoers.elvitrinabackend.exception.ResourceNotFoundException;
import com.sudoers.elvitrinabackend.model.dto.request.EventTicketRequestDTO;
import com.sudoers.elvitrinabackend.model.dto.response.EventTicketResponseDTO;
import com.sudoers.elvitrinabackend.model.entity.EventSession;
import com.sudoers.elvitrinabackend.model.entity.EventTicket;
import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.model.mapper.EventTicketMapper;
import com.sudoers.elvitrinabackend.repository.EventSessionRepository;
import com.sudoers.elvitrinabackend.repository.EventTicketRepository;
import com.sudoers.elvitrinabackend.repository.VirtualEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventTicketServiceImpl implements EventTicketService {

    private final EventTicketRepository eventTicketRepository;
    private final VirtualEventRepository virtualEventRepository;
    private final EventSessionRepository eventSessionRepository;
    private final EventTicketMapper eventTicketMapper;

    @Autowired
    public EventTicketServiceImpl(EventTicketRepository eventTicketRepository,
                                  VirtualEventRepository virtualEventRepository,
                                  EventSessionRepository eventSessionRepository,
                                  EventTicketMapper eventTicketMapper) {
        this.eventTicketRepository = eventTicketRepository;
        this.virtualEventRepository = virtualEventRepository;
        this.eventSessionRepository = eventSessionRepository;
        this.eventTicketMapper = eventTicketMapper;
    }

    @Override
    @Transactional
    public EventTicketResponseDTO saveEventTicket(EventTicketRequestDTO requestDTO) {
        EventTicket eventTicket = eventTicketMapper.toEntity(requestDTO);
        eventTicket.setCreatedAt(LocalDateTime.now());

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
        existingTicket.setUpdatedAt(LocalDateTime.now());

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


    @Override
    public EventTicketResponseDTO generateQRCodeForTicket(Long ticketId) {
        EventTicket ticket = eventTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        String qrContent = "ticketId:" + ticket.getTicketId() + "|eventId:" + ticket.getVirtualEvent().getEventId() + "|hash:" + ticket.getQrCodeHash();
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 250, 250);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            ticket.setUpdatedAt(LocalDateTime.now());
            EventTicket savedTicket = eventTicketRepository.save(ticket);
            EventTicketResponseDTO dto = eventTicketMapper.toResponseDTO(savedTicket);
            dto.setQrCodeHash(ticket.getQrCodeHash() ); // Placeholder URL
            return dto;
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    @Override
    public boolean validateTicket(Long ticketId) {
        EventTicket ticket = eventTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return ticket.getIsValid() && (ticket.getValidUntil() == null || ticket.getValidUntil().isAfter(LocalDateTime.now()));
    }

   /* @Override
    public List<EventTicketResponseDTO> issueMultiSessionTickets(EventTicketRequestDTO requestDTO, int quantity) {
        VirtualEvent event = virtualEventRepository.findById(requestDTO.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + requestDTO.getEventId()));

        if (requestDTO.getQuantity() < quantity) {
            throw new IllegalArgumentException("Requested quantity exceeds available tickets");
        }

        List<EventSession> sessions = requestDTO.getSessionIds() != null && !requestDTO.getSessionIds().isEmpty()
                ? eventSessionRepository.findAllById(requestDTO.getSessionIds())
                : event.getSessions();

        List<EventTicket> tickets = new ArrayList<>();
        for (int i = 0; i < quantity && i < sessions.size(); i++) {
            EventTicket ticket = eventTicketMapper.toEntity(requestDTO);
            ticket.setVirtualEvent(event);
            ticket.setQuantityAvailable(quantity);
            ticket.setQuantityRemaining(quantity - i - 1); // Decrease as issued
            ticket.setEarlyBirdPricing(requestDTO.getEarlyBirdPricing() != null ? requestDTO.getEarlyBirdPricing().doubleValue() : null);
            ticket.setValidUntil(event.getEventDate().plusDays(30)); // Example expiration
            tickets.add(eventTicketRepository.save(ticket));
        }

        return tickets.stream()
                .map(eventTicketMapper::toResponseDTO)
                .peek(dto -> dto.setSessionIds(sessions.stream().map(EventSession::getSessionId).collect(Collectors.toList())))
                .collect(Collectors.toList());
    }
*/
    @Override
    public EventTicketResponseDTO applyEarlyBirdPricing(Long ticketId) {
        EventTicket ticket = eventTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (ticket.getEarlyBirdPricing() != null && LocalDateTime.now().isBefore(ticket.getCreatedAt().plusDays(7))) { // Example deadline
            ticket.setPrice(ticket.getEarlyBirdPricing());
        }
        ticket.setUpdatedAt(LocalDateTime.now());
        return eventTicketMapper.toResponseDTO(eventTicketRepository.save(ticket));
    }

    @Override
    public EventTicketResponseDTO trackTicketAvailability(Long ticketId) {
        EventTicket ticket = eventTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        return eventTicketMapper.toResponseDTO(ticket); // Quantity remaining is already mapped
    }

    @Override
    public EventTicketResponseDTO cancelTicket(Long ticketId) {
        EventTicket ticket = eventTicketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));
        ticket.setIsValid(false);
        ticket.setQuantityRemaining(ticket.getQuantityRemaining() + 1);
        ticket.setUpdatedAt(LocalDateTime.now());
        return eventTicketMapper.toResponseDTO(eventTicketRepository.save(ticket));
    }
}