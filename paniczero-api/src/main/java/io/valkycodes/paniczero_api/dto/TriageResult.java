package io.valkycodes.paniczero_api.dto;

import io.valkycodes.paniczero_api.model.Severity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TriageResult {
    private String title;
    private Severity severity;
    private String rootCause;
    private List<String> actionItems;
    private String patchDiff;
}
