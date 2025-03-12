package com.sudoers.elvitrinabackend.service.ProposalPerso;

import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.ProposalPersoRepository;
import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
import com.sudoers.elvitrinabackend.repository.UserRepository;
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
}
