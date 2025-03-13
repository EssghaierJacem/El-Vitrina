package com.sudoers.elvitrinabackend.service.Creator;

import com.sudoers.elvitrinabackend.model.entity.Creator;
import com.sudoers.elvitrinabackend.repository.CreatorRepository;
import com.sudoers.elvitrinabackend.service.Creator.CreatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CreatorServiceImpl implements CreatorService {

    @Autowired
    private CreatorRepository creatorRepository;

    @Override
    public Creator saveCreator(Creator creator) {
        return creatorRepository.save(creator);
    }

    @Override
    public List<Creator> getAllCreators() {
        return creatorRepository.findAll();
    }

    @Override
    public Creator getCreatorById(Long id) {
        Optional<Creator> creator = creatorRepository.findById(id);
        return creator.orElseThrow(() -> new RuntimeException("Creator not found"));
    }

    @Override
    public void deleteCreator(Long id) {
        creatorRepository.deleteById(id);
    }

    @Override
    public Creator updateCreator(Long id, Creator creator) {
        Creator existingCreator = getCreatorById(id);
        existingCreator.setBio(creator.getBio());
        existingCreator.setSpecialties(creator.getSpecialties());
        existingCreator.setPortfolio(creator.getPortfolio());
        existingCreator.setCommissionRate(creator.getCommissionRate());
        existingCreator.setTierClassification(creator.getTierClassification());
        existingCreator.setFacebookLink(creator.getFacebookLink());
        existingCreator.setYoutubeLink(creator.getYoutubeLink());
        existingCreator.setGithubLink(creator.getGithubLink());
        existingCreator.setLinkedinLink(creator.getLinkedinLink());
        existingCreator.setBehanceLink(creator.getBehanceLink());
        existingCreator.setInstagramLink(creator.getInstagramLink());
        existingCreator.setSnapchatLink(creator.getSnapchatLink());
        existingCreator.setWhatsappLink(creator.getWhatsappLink());
        return creatorRepository.save(existingCreator);
    }
}