package com.sudoers.elvitrinabackend.service.VirtualEvent;

import com.sudoers.elvitrinabackend.model.entity.VirtualEvent;

import java.util.List;

public interface VirtualEventService {
    VirtualEvent saveVirtualEvent(VirtualEvent virtualEvent);
    List<VirtualEvent> getAllVirtualEvents();
    VirtualEvent getVirtualEventById(Long id);
    void deleteVirtualEvent(Long id);
    VirtualEvent updateVirtualEvent(Long id, VirtualEvent virtualEvent);
}