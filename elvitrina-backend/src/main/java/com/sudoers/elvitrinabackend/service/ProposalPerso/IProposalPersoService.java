package com.sudoers.elvitrinabackend.service.ProposalPerso;

import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;

import java.util.List;

public interface IProposalPersoService {
    public ProposalPerso addProposalPerso (ProposalPerso prop);
    public List<ProposalPerso> getAllProposalPerso();
    public ProposalPerso getProposalPersoById(Long id);
    public void deleteProposalPersoById(Long id);
    public ProposalPerso updateProposalPerso (ProposalPerso prop);
}
