package io.valkycodes.paniczero_api.repository;

import io.valkycodes.paniczero_api.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    List<Incident> findAllByOrderByCreatedAtDesc();
}
