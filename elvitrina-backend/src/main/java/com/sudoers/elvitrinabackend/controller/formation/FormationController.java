package com.sudoers.elvitrinabackend.controller.formation;

import com.sudoers.elvitrinabackend.model.entity.Formation;
import com.sudoers.elvitrinabackend.service.formation.IFormationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping ("/formation")
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

    @PutMapping("/updateformation")
    public Formation updateFormation (@RequestBody Formation formation){
        return formationService.updateFormation(formation);
    }

    @GetMapping("/getformation/{id}")
    public Formation getFormation (@PathVariable("id") long id){
        return formationService.retrieveFormation(id);
    }

    @DeleteMapping("/removeformation/{id}")
    public void removeFormation (@PathVariable("id") long id){
        formationService.removeFormation(id);
    }
}
