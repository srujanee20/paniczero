package io.valkycodes.paniczero_api.controller;

import io.valkycodes.paniczero_api.dto.TriageRequest;
import io.valkycodes.paniczero_api.dto.TriageResult;
import io.valkycodes.paniczero_api.model.Incident;
import io.valkycodes.paniczero_api.repository.IncidentRepository;
import io.valkycodes.paniczero_api.service.GeminiService;
import io.valkycodes.paniczero_api.util.LogSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IncidentController {

    private final GeminiService geminiService;
    private final IncidentRepository incidentRepository;

    @PostMapping("/triage")
    public ResponseEntity<Incident> triageIncident(@RequestBody TriageRequest request) {
        if (request.getRawLog() == null || request.getRawLog().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        String sanitizedLog = LogSanitizer.sanitize(request.getRawLog());
        String ecosystem = (request.getEcosystem() != null && !request.getEcosystem().isBlank())
                ? request.getEcosystem() : "Auto-Detect";

        TriageResult result = geminiService.triageLog(sanitizedLog, ecosystem);

        Incident incident = Incident.builder()
                .title(result.getTitle())
                .severity(result.getSeverity())
                .ecosystem(ecosystem)
                .rootCause(result.getRootCause())
                .actionItems(result.getActionItems())
                .patchDiff(result.getPatchDiff())
                .rawLog(sanitizedLog)
                .build();

        Incident savedIncident = incidentRepository.save(incident);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIncident);
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<Incident>> getAllIncidents() {
        return ResponseEntity.ok(incidentRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/incidents/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable UUID id) {
        return incidentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/incidents/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable UUID id) {
        if (!incidentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        incidentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
