package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;
import com.sudoers.elvitrinabackend.repository.VirtualEventRepository;
import com.sudoers.elvitrinabackend.service.VirtualEvent.VirtualEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VirtualEventServiceImpl implements VirtualEventService {

    @Autowired
    private VirtualEventRepository virtualEventRepository;

    @Override
    public VirtualEvent saveVirtualEvent(VirtualEvent virtualEvent) {
        return virtualEventRepository.save(virtualEvent);
    }

    @Override
    public List<VirtualEvent> getAllVirtualEvents() {
        return virtualEventRepository.findAll();
    }

    @Override
    public VirtualEvent getVirtualEventById(Long id) {
        Optional<VirtualEvent> virtualEvent = virtualEventRepository.findById(id);
        return virtualEvent.orElseThrow(() -> new RuntimeException("VirtualEvent not found"));
    }

    @Override
    public void deleteVirtualEvent(Long id) {
        virtualEventRepository.deleteById(id);
    }

    @Override
    public VirtualEvent updateVirtualEvent(Long id, VirtualEvent virtualEvent) {
        VirtualEvent existingEvent = getVirtualEventById(id);
        existingEvent.setTitle(virtualEvent.getTitle());
        existingEvent.setDescription(virtualEvent.getDescription());
        existingEvent.setEventDate(virtualEvent.getEventDate());
        existingEvent.setEventType(virtualEvent.getEventType());
        existingEvent.setTicketPrice(virtualEvent.getTicketPrice());
        existingEvent.setStatus(virtualEvent.getStatus());
        existingEvent.setTimestamp(virtualEvent.getTimestamp());
        existingEvent.setStore(virtualEvent.getStore());
        return virtualEventRepository.save(existingEvent);
    }


}
