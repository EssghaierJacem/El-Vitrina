package com.sudoers.elvitrinabackend.service.requestPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestPersoAdmin {
    @Autowired
    private RequestPersoRepository requestPersoRepository;

    public List<RequestPerso> getAllRequestPerso() {
        return requestPersoRepository.findAllByOrderByDateDesc();
    }

    public RequestPerso getRequestPersoById(Long id) {
        return requestPersoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RequestPerso not found with id: " + id));
    }

    public RequestPerso updateRequestPerso(Long id, RequestPerso requestPerso) {
        RequestPerso existing = getRequestPersoById(id);
        existing.setTitle(requestPerso.getTitle());
        existing.setDescription(requestPerso.getDescription());
        existing.setMinPrice(requestPerso.getMinPrice());
        existing.setMaxPrice(requestPerso.getMaxPrice());
        existing.setImage(requestPerso.getImage());
        existing.setDeliveryTime(requestPerso.getDeliveryTime());
        existing.setTags(requestPerso.getTags());
        existing.setDate(requestPerso.getDate());
        return requestPersoRepository.save(existing);
    }

    public void deleteRequestPerso(Long id) {
        requestPersoRepository.deleteById(id);
    }
}