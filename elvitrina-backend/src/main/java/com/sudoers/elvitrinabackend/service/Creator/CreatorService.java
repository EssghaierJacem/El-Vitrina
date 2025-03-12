package com.sudoers.elvitrinabackend.service.Creator;

import com.sudoers.elvitrinabackend.model.entity.Creator;

import java.util.List;

public interface CreatorService {
    Creator saveCreator(Creator creator);
    List<Creator> getAllCreators();
    Creator getCreatorById(Long id);
    void deleteCreator(Long id);
    Creator updateCreator(Long id, Creator creator);
}