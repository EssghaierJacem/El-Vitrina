package com.sudoers.elvitrinabackend.controller.ProposalPerso;

import com.sudoers.elvitrinabackend.model.dto.ProposalPersoDTO;
import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
import com.sudoers.elvitrinabackend.service.ProposalPerso.IProposalPersoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ProposalPerso")
@AllArgsConstructor
public class ProposalPersoController {
    IProposalPersoService proposalPersoService;
   /* @PostMapping
    public ResponseEntity<ProposalPerso> createProposalPerso(@RequestBody ProposalPerso prop) {
        ProposalPerso createdRequest = proposalPersoService.addProposalPerso(prop);
        return new ResponseEntity<>(createdRequest, HttpStatus.CREATED);
    }*/

    @GetMapping("/{id}")
    public ResponseEntity<ProposalPerso> getProposalPersoById(@PathVariable Long id) {
        ProposalPerso request = proposalPersoService.getProposalPersoById(id);
        return new ResponseEntity<>(request, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ProposalPerso>> getAllRequestPerso() {
        List<ProposalPerso> requests = proposalPersoService.getAllProposalPerso();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProposalPerso> updateProposalPerso(@PathVariable Long id, @RequestBody ProposalPerso prop) {
        ProposalPerso updatedRequest = proposalPersoService.updateProposalPerso(prop);
        return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequestPerso(@PathVariable Long id) {
        proposalPersoService.deleteProposalPersoById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


    @PostMapping
    public ResponseEntity<ProposalPerso> createProposalPersoDTO(@RequestBody ProposalPersoDTO proposalDTO) {
        ProposalPerso createdProposal = proposalPersoService.addProposalPerso(proposalDTO);
        return new ResponseEntity<>(createdProposal, HttpStatus.CREATED);
    }

@GetMapping("proposal-request/{RequestPersoID}")
    public ResponseEntity<?> getProposalRequestByRequestPersoId(@PathVariable Long RequestPersoID)
{
    try {
        return ResponseEntity.ok(proposalPersoService.getProposalPersoByrequestPersoID(RequestPersoID));
    } catch (Exception e){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("something went wrong.");
    }
}

}
