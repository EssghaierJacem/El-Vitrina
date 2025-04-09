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

import java.util.Date;
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
    public ProposalPerso updateProposalPerso(ProposalPerso proposal) {
        // Get existing proposal
        ProposalPerso existing = proposalPersoRepository.findById(proposal.getId())
                .orElseThrow(() -> new EntityNotFoundException("Proposal not found"));

        // Update allowed fields
        existing.setDescription(proposal.getDescription());
        existing.setPrice(proposal.getPrice());
        existing.setDate(new Date()); // Update timestamp

        return proposalPersoRepository.save(existing);
    }

    @Override
    public ProposalPerso addProposalPerso(ProposalPersoDTO proposalDTO) {
        RequestPerso requestPerso = requestPersoRepository.findById(proposalDTO.getRequestPersoId())
                .orElseThrow(() -> new EntityNotFoundException("RequestPerso not found"));

        User user = userRepository.findById(proposalDTO.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ProposalPerso proposalPerso = new ProposalPerso();
        proposalPerso.setRequestPerso(requestPerso);
        proposalPerso.setUser(user);
        proposalPerso.setDescription(proposalDTO.getDescription());
        proposalPerso.setPrice(proposalDTO.getPrice());
        proposalPerso.setDate(proposalDTO.getDate());

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
        //
        dto.setUser(copyUserToDto(proposal.getUser()));
     //   dto.setProposalPersoID(proposal.getProposalPersoID());
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
