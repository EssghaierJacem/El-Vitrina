package com.sudoers.elvitrinabackend.service.formation;

import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.model.entity.Product;

import java.util.List;

public interface IFormationService {
    List<Formation> retrieveAllFormation();
    Formation addFormation (Formation formation);
    Formation updateFormation (Formation e);
    Formation retrieveFormation(long id);
    void removeFormation(long id);
}
