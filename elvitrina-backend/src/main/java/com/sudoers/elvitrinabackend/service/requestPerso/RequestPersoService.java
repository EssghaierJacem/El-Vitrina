package com.sudoers.elvitrinabackend.service.requestPerso;

import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RequestPersoService implements IRequestPersoService{
    RequestPersoRepository requestPersoRepository;
    UserRepository userRepository;
    @Override
    public RequestPerso addRequestPerso(RequestPerso request) {
        User user;
        user=userRepository.findById(request.getUser().getId()).orElseThrow(null);
       request.setUser(user);
        return requestPersoRepository.save(request);
    }

    @Override
    public List<RequestPerso> getAllRequestPerso() {
        return requestPersoRepository.findAll();
    }

    @Override
    public RequestPerso getRequestPersoById(Long id) {
        return requestPersoRepository.findById(id).orElse(null);
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
