package com.sudoers.elvitrinabackend.controller.ProposalPerso;


import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.service.ProposalPerso.ProposalPersoService;
import com.sudoers.elvitrinabackend.service.ProposalPerso.ProposalPersoServiceAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/proposalPerso")
public class ProposalPersoAdminController {
    @Autowired
    private ProposalPersoServiceAdmin proposalPersoService;

    @GetMapping
    public ResponseEntity<List<ProposalPerso>> getAllProposalPerso() {
        return ResponseEntity.ok(proposalPersoService.getAllProposalPerso());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProposalPerso> getProposalPersoById(@PathVariable Long id) {
        return ResponseEntity.ok(proposalPersoService.getProposalPersoById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProposalPerso> updateProposalPerso(@PathVariable Long id, @RequestBody ProposalPerso proposalPerso) {
        return ResponseEntity.ok(proposalPersoService.updateProposalPerso(id, proposalPerso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProposalPerso(@PathVariable Long id) {
        proposalPersoService.deleteProposalPerso(id);
        return ResponseEntity.noContent().build();
    }
}