package com.sudoers.elvitrinabackend.service.requestPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.service.user.EmailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequestPersoAdmin {
    @Autowired
    private RequestPersoRepository requestPersoRepository;
@Autowired
private EmailService emailService;
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
        existing.setStatus(requestPerso.getStatus());
        return requestPersoRepository.save(existing);
    }

    public void deleteRequestPerso(Long id) {
        RequestPerso request = requestPersoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Get user information
        String userEmail = request.getUser().getEmail();
        String userName = request.getUser().getUsername(); // Or .getFirstName() + " " + .getLastName()
        String requestTitle = request.getTitle();

        requestPersoRepository.deleteById(id);
        emailService.sendDeletedRequestPersomail(userEmail, userName, requestTitle);

    }


    public List<RequestPerso> getPendingRequests() {
        return requestPersoRepository.findByStatus(RequestStatus.PENDING);
    }

    public void moderateRequest(Long id, RequestStatus newStatus) {
        RequestPerso req = requestPersoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(newStatus);  String userEmail = req .getUser().getEmail();
        String userName = req .getUser().getFirstname() + " " + req .getUser().getLastname();
        String requestTitle = req .getTitle();

        requestPersoRepository.save(req);



        emailService.sendApprovedRequestPersomail(userEmail, userName, requestTitle);
    }
}