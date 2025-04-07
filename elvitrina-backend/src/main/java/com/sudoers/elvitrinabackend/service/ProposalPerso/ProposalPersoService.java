package com.sudoers.elvitrinabackend.service.ProposalPerso;

import com.sudoers.elvitrinabackend.model.dto.ProposalPersoDTO;
import com.sudoers.elvitrinabackend.model.dto.UserDTO;
import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.ProposalPersoRepository;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProposalPersoService implements IProposalPersoService{
  ProposalPersoRepository proposalPersoRepository;
  RequestPersoRepository requestPersoRepository;
    UserRepository userRepository;
    @Override
    public ProposalPerso addProposalPerso(ProposalPerso prop) {
        RequestPerso requestPerso;
        requestPerso=requestPersoRepository.findById(prop.getRequestPerso().getId()).orElseThrow(null);
        prop.setRequestPerso(requestPerso);

        return proposalPersoRepository.save(prop);
    }

    @Override
    public List<ProposalPerso> getAllProposalPerso() {
        return proposalPersoRepository.findAll();
    }

    @Override
    public ProposalPerso getProposalPersoById(Long id) {
        return proposalPersoRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteProposalPersoById(Long id) {
     proposalPersoRepository.deleteById(id);
    }

    @Override
    public ProposalPerso updateProposalPerso(ProposalPerso prop) {
        return proposalPersoRepository.save(prop);
    }

    @Override
    public ProposalPerso addProposalPerso(ProposalPersoDTO proposalDTO) {
        // Fetch the RequestPerso entity
        RequestPerso requestPerso = requestPersoRepository.findById(proposalDTO.getRequestPersoId())
                .orElseThrow(() -> new EntityNotFoundException("RequestPerso not found"));
        // Convert DTO to entity
        ProposalPerso proposalPerso = new ProposalPerso();
        proposalPerso.setRequestPerso(requestPerso);
       // proposalPerso.setTitle(proposalDTO.getTitle());
        proposalPerso.setDescription(proposalDTO.getDescription());
        proposalPerso.setPrice(proposalDTO.getPrice());
        //proposalPerso.setImage(proposalDTO.getImage());
        proposalPerso.setDate(proposalDTO.getDate());

        // Save the entity
        return proposalPersoRepository.save(proposalPerso);
    }



    /*@Override
    public List<ProposalPerso> getProposalPersoByrequestPersoID(Long requestPersoId) {
        return proposalPersoRepository.findProposalPersoByRequestPersoId(requestPersoId);
    }*/

    private ProposalPersoDTO convertToDto(ProposalPerso proposal) {
        ProposalPersoDTO dto = new ProposalPersoDTO();
        dto.setId(proposal.getId());
        dto.setRequestPersoId(proposal.getRequestPerso().getId());
        dto.setDescription(proposal.getDescription());
        dto.setPrice(proposal.getPrice());
        dto.setDate(proposal.getDate());
        dto.setUser(copyUserToDto(proposal.getRequestPerso().getUser()));
        // Set other DTO fields as needed
        return dto;
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
    public List<ProposalPersoDTO> getProposalPersoByrequestPersoID(Long requestPersoId) {
        return proposalPersoRepository.findProposalPersoByRequestPersoId(requestPersoId)
                .stream()
                .map(this::convertToDto)
                .toList();
    }
}
