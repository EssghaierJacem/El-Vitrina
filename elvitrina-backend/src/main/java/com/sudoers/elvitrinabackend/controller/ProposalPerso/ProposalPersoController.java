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
    public ResponseEntity<ProposalPersoDTO> updateProposalPerso(
            @PathVariable Long id,
            @RequestBody ProposalPersoDTO proposalDTO) {

        // Convert DTO to entity
        ProposalPerso proposal = convertToEntity(proposalDTO);
        proposal.setId(id); // Ensure ID matches path

        // Update in service
        ProposalPerso updatedProposal = proposalPersoService.updateProposalPerso(proposal);

        // Convert back to DTO
        ProposalPersoDTO responseDTO = convertToDTO(updatedProposal);
        return ResponseEntity.ok(responseDTO);
    }

    private ProposalPerso convertToEntity(ProposalPersoDTO dto) {
        ProposalPerso proposal = new ProposalPerso();
        proposal.setDescription(dto.getDescription());
        proposal.setPrice(dto.getPrice());
        // Add other fields if needed
        return proposal;
    }

    private ProposalPersoDTO convertToDTO(ProposalPerso entity) {
        return ProposalPersoDTO.builder()
                .id(entity.getId())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .date(entity.getDate())
                .requestPersoId(entity.getRequestPerso().getId())
                .userId(entity.getUser().getId())
                .build();
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
