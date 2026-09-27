package io.valkycodes.paniczero_api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriageRequest {
    private String rawLog;
    private String ecosystem;
}
