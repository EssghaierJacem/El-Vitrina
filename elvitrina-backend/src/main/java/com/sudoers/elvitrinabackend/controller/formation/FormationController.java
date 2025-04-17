package com.sudoers.elvitrinabackend.controller.formation;

import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.service.formation.IFormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RequestMapping ("/api/formations")
public class FormationController {
    @Autowired
    IFormationService formationService;

    @GetMapping("/getformations")
    public List<Formation> getFormations (){
        return (List<Formation>) formationService.retrieveAllFormation();
    }

    @PostMapping("/addformation")
    public Formation addFormation (@RequestBody Formation formation){
        return formationService.addFormation(formation);
    }

    @PutMapping("/{id}/updateformation")
    public Formation updateFormation(@PathVariable("id") Long id, @RequestBody Formation formation) {
        formation.setId(id);  // On définit l'ID de la formation à mettre à jour
        return formationService.updateFormation(formation);
    }

    @GetMapping("/{id}")
    public Formation getFormation (@PathVariable("id") long id){
        return formationService.retrieveFormation(id);
    }

    @DeleteMapping("/{id}/removeformation")
    public void removeFormation (@PathVariable("id") long id){
        formationService.removeFormation(id);
    }
}


