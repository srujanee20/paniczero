package io.valkycodes.paniczero_api.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(nullable = false)
    private String ecosystem;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rootCause;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "incident_action_items", joinColumns = @JoinColumn(name = "incident_id"))
    @Column(name = "action_item", columnDefinition = "TEXT")
    private List<String> actionItems;

    @Column(columnDefinition = "TEXT")
    private String patchDiff;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String rawLog;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }
}
