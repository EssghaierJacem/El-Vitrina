package com.sudoers.elvitrinabackend.service.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.repository.ProposalPersoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProposalPersoServiceAdmin {
    @Autowired
    private ProposalPersoRepository proposalPersoRepository;

    public List<ProposalPerso> getAllProposalPerso() {
        return proposalPersoRepository.findAllByOrderByDateDesc();
    }

    public ProposalPerso getProposalPersoById(Long id) {
        return proposalPersoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProposalPerso not found with id: " + id));
    }

    public ProposalPerso updateProposalPerso(Long id, ProposalPerso proposalPerso) {
        ProposalPerso existing = getProposalPersoById(id);
        existing.setDescription(proposalPerso.getDescription());
        existing.setPrice(proposalPerso.getPrice());
        existing.setDate(proposalPerso.getDate());
        return proposalPersoRepository.save(existing);
    }

    public void deleteProposalPerso(Long id) {
        proposalPersoRepository.deleteById(id);
    }
}