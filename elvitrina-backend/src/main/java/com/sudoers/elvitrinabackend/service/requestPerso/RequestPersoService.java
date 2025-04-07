package com.sudoers.elvitrinabackend.service.requestPerso;

import com.sudoers.elvitrinabackend.model.dto.ProposalPersoDTO;
import com.sudoers.elvitrinabackend.model.dto.RequestPersoDTO;
import com.sudoers.elvitrinabackend.model.dto.UserDTO;
import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    @Transactional(readOnly = true)
    public List<RequestPersoDTO> getAllRequestPersoDTO() {
    return requestPersoRepository.findAll().stream()
                .map(this::copyEntityToDto)
                .collect(Collectors.toList());
}

    @Override
    public RequestPersoDTO getRequestPersoByIdd(Long id) {
        RequestPerso request = requestPersoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("RequestPerso not found with id: " + id));
        // Increment view count
        request.setViewCount(request.getViewCount() + 1);
        requestPersoRepository.save(request);
        // Map to DTO
        return copyEntityToDto(request);
    }


    private RequestPersoDTO copyEntityToDto(RequestPerso requestPerso) {
        User user = requestPerso.getUser();
        if (user == null) {
            System.out.println("User is null for RequestPerso ID: " + requestPerso.getId());
        } else {
            System.out.println("User ID: " + user.getId() + " for RequestPerso ID: " + requestPerso.getId());
        }
        return RequestPersoDTO.builder()
                .id(requestPerso.getId())
                .title(requestPerso.getTitle())
                .description(requestPerso.getDescription())
                .minPrice(requestPerso.getMinPrice())
                .maxPrice(requestPerso.getMaxPrice())
                .image(requestPerso.getImage())
                .deliveryTime(requestPerso.getDeliveryTime())
                .viewCount(requestPerso.getViewCount())
                .tags(requestPerso.getTags())
                .date(requestPerso.getDate())
                .proposals(requestPerso.getProposals().stream()
                        .map(this::copyProposalPersoToDto)
                        .collect(Collectors.toList()))
                .user(copyUserToDto(requestPerso.getUser()))
                //.userId(requestPerso.getUser().getId())
                .build();
    }

    private ProposalPersoDTO copyProposalPersoToDto(ProposalPerso proposalPerso) {
        return ProposalPersoDTO.builder()
                .id(proposalPerso.getId())
               // .title(proposalPerso.getTitle())
                .description(proposalPerso.getDescription())
                .price(proposalPerso.getPrice())
               // .image(proposalPerso.getImage())
                .date(proposalPerso.getDate())
                .build();
    }

    private UserDTO copyUserToDto(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .image(user.getImage())
                // Map other fields as needed
                .build();
    }




    @Override
    public RequestPerso getRequestPersoById(Long id) {
        RequestPerso request = requestPersoRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("RequestPerso not found with id: " + id));
        if(request!=null)
        {
            request.setViewCount(request.getViewCount()+1);

            return requestPersoRepository.save(request);
        }
else {
    throw new EntityNotFoundException("Request Not Found");
        }

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
