package com.sudoers.elvitrinabackend.controller.requestPerso;
        import com.sudoers.elvitrinabackend.model.entity.ProposalPerso;
        import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
        import com.sudoers.elvitrinabackend.model.enums.RequestStatus;
        import com.sudoers.elvitrinabackend.repository.ProposalPersoRepository;
        import com.sudoers.elvitrinabackend.repository.RequestPersoRepository;
        import com.sudoers.elvitrinabackend.service.ProposalPerso.ProposalPersoServiceAdmin;
        import com.sudoers.elvitrinabackend.service.requestPerso.RequestPersoAdmin;
        import com.sudoers.elvitrinabackend.service.requestPerso.RequestPersoService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.time.Instant;
        import java.time.temporal.ChronoUnit;
        import java.util.Date;
        import java.util.HashMap;
        import java.util.List;
        import java.util.Map;

@RestController
@RequestMapping("/api/admin/requestPerso")
public class RequestPersoAdminController {
    @Autowired
    private RequestPersoAdmin requestPersoService;
    @Autowired
    private ProposalPersoServiceAdmin proposalPersoServiceAdmin;
    @GetMapping
    public ResponseEntity<List<RequestPerso>> getAllRequestPerso() {
        return ResponseEntity.ok(requestPersoService.getAllRequestPerso());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestPerso> getRequestPersoById(@PathVariable Long id) {
        return ResponseEntity.ok(requestPersoService.getRequestPersoById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RequestPerso> updateRequestPerso(@PathVariable Long id, @RequestBody RequestPerso requestPerso) {
        return ResponseEntity.ok(requestPersoService.updateRequestPerso(id, requestPerso));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequestPerso(@PathVariable Long id) {
        requestPersoService.deleteRequestPerso(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pending")
    public List<RequestPerso> getPending() {
        return requestPersoService.getPendingRequests();
    }

    @PutMapping("/{id}/moderate")
    public ResponseEntity<Void> moderate(
            @PathVariable Long id,
            @RequestParam RequestStatus status
    ) {
        requestPersoService.moderateRequest(id, status);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{requestId}/proposals")
    public ResponseEntity<List<ProposalPerso>> getProposalsForRequest(@PathVariable Long requestId) {
        List<ProposalPerso> proposals = proposalPersoServiceAdmin.getProposalsByRequestId(requestId);
        if (proposals != null && !proposals.isEmpty()) {
            return ResponseEntity.ok(proposals);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}