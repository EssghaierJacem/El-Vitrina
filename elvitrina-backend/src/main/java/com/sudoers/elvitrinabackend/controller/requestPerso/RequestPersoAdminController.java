package com.sudoers.elvitrinabackend.controller.requestPerso;
        import com.sudoers.elvitrinabackend.model.entity.RequestPerso;
        import com.sudoers.elvitrinabackend.service.requestPerso.RequestPersoAdmin;
        import com.sudoers.elvitrinabackend.service.requestPerso.RequestPersoService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.http.ResponseEntity;
        import org.springframework.web.bind.annotation.*;

        import java.util.List;

@RestController
@RequestMapping("/api/admin/requestPerso")
public class RequestPersoAdminController {
    @Autowired
    private RequestPersoAdmin requestPersoService;

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
}