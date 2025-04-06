package com.sudoers.elvitrinabackend.service.requestPerso;

import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RequestPersoService implements IRequestPersoService{
    RequestPersoRepository requestPersoRepository;
    UserRepository userRepository;
    @Override
    public RequestPerso addRequestPerso(RequestPerso request) {
       /* User user;
        System.out.println("aaaa");
        System.out.println(request.getUser());
      user=userRepository.findById(request.getUser().getId()).orElseThrow(null);
        System.out.println("aaaa1");
      request.setUser(user);
        System.out.println("aaaa");
        System.out.println(user);
        */
        return requestPersoRepository.save(request);
    }
    @Override
    public List<RequestPerso> getAllRequestPerso() {
        return requestPersoRepository.findAll();
    }

    @Override
    public RequestPerso getRequestPersoById(Long id) {
        return requestPersoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RequestPerso not found with id: " + id));
    }
    @Override
    public void deleteRequestPersoById(Long id) {
        requestPersoRepository.deleteById(id);
    }

    @Override
    public RequestPerso updateRequestPerso(Long id,RequestPerso request) {
        return requestPersoRepository.save(request);
    }
}
