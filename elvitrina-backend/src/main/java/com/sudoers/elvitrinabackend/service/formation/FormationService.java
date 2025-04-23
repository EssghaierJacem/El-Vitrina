package com.sudoers.elvitrinabackend.service.formation;

import com.sudoers.elvitrinabackend.model.entity.BlogPost;
import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.model.entity.User;
import com.sudoers.elvitrinabackend.repository.FormationRepository;
import com.sudoers.elvitrinabackend.service.ActionHistory.ActionHistoryService;
import com.sudoers.elvitrinabackend.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class FormationService implements IFormationService {

    @Autowired
    private FormationRepository formationRepository ;

    @Autowired
    private ActionHistoryService actionHistoryService;

    @Autowired
    private UserService userService;
    @Override
    public List<Formation> retrieveAllFormation() {
        return (List<Formation>) formationRepository.findAll();    }


    /*
    @Override
    public Formation addFormation(Formation formation) {
        return formationRepository.save(formation);
    }

    @Override
    public Formation updateFormation(Formation formation) {
        Formation existingFormation = formationRepository.findById(formation.getId())
                .orElseThrow(() -> new RuntimeException("Formation not found"));


        formation.setUser( existingFormation.getUser() );
        return formationRepository.save(formation);
    }

    @Override
    public void removeFormation(long id) {
        formationRepository.deleteById(id);
    }

    */

    @Override
    public Formation addFormation(Formation formation) {
        Formation saved = formationRepository.save(formation);
        User currentUser = formation.getUser();

        actionHistoryService.logAction(
                "Formation",
                saved.getId(),
                "CREATE",
                "Ajout d'une formation : " + saved.getCourseTitle(),
                currentUser
        );

        return saved;
    }

    @Override
    public Formation updateFormation(Formation formation) {
        Formation existingFormation = formationRepository.findById(formation.getId())
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));

        formation.setUser(existingFormation.getUser()); // garder l’auteur original
        Formation updated = formationRepository.save(formation);

        User currentUser = formation.getUser();
        actionHistoryService.logAction(
                "Formation",
                updated.getId(),
                "UPDATE",
                "Modification de la formation : " + updated.getCourseTitle(),
                currentUser
        );

        return updated;
    }

    @Override
    public void removeFormation(long id) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation non trouvée"));

        formationRepository.deleteById(id);

        User currentUser = formation.getUser();
        actionHistoryService.logAction(
                "Formation",
                formation.getId(),
                "DELETE",
                "Suppression de la formation : " + formation.getCourseTitle(),
                currentUser
        );
    }
    @Override
    public Formation retrieveFormation(long id) {
        return formationRepository.findById(id).orElse(null);
    }


}
