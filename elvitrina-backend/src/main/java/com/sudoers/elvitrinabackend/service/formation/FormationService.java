package com.sudoers.elvitrinabackend.service.formation;

import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.repository.FormationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class FormationService implements IFormationService {

    @Autowired
    private FormationRepository formationRepository ;

    @Override
    public List<Formation> retrieveAllFormation() {
        return (List<Formation>) formationRepository.findAll();    }

    @Override
    public Formation addFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    @Override
    public Formation updateFormation(Formation formation) {
        return formationRepository.save(formation);
    }
    @Override
    public Formation retrieveFormation(long id) {
        return formationRepository.findById(id).orElse(null);
    }
    @Override
    public void removeFormation(long id) {
            formationRepository.deleteById(id);
    }


}
