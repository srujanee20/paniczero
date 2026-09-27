package io.valkycodes.paniczero_api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.valkycodes.paniczero_api.dto.TriageResult;
import io.valkycodes.paniczero_api.model.Severity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent}")
    private String apiUrl;

    public GeminiService(ObjectMapper objectMapper) {
        this.restClient = RestClient.create();
        this.objectMapper = objectMapper;
    }

    public TriageResult triageLog(String sanitizedLog, String ecosystem) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("GEMINI_API_KEY is not configured. Falling back to local rule-based triage generator.");
            return generateFallbackTriage(sanitizedLog, ecosystem);
        }

        try {
            String fullUrl = apiUrl.contains("?") ? apiUrl + "&key=" + apiKey : apiUrl + "?key=" + apiKey;

            String prompt = String.format("""
                You are a Principal Site Reliability Engineer (SRE). Analyze the provided %s crash log and perform an urgent incident triage.
                
                Strict JSON Output Requirement:
                Return a single JSON object containing:
                1. "title": Short descriptive incident title (max 8-10 words).
                2. "severity": One of ["CRITICAL", "HIGH", "MEDIUM", "LOW"].
                3. "rootCause": In-depth SRE breakdown of why the crash happened and the exact component/line involved.
                4. "actionItems": An array of actionable mitigation steps for on-call engineers.
                5. "patchDiff": A valid Unified Git Patch (git diff format with --- a/ and +++ b/) demonstrating the exact code/config fix required.
                
                Crash Log:
                %s
                """, ecosystem != null ? ecosystem : "System", sanitizedLog);

            Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                    Map.of(
                        "parts", List.of(
                            Map.of("text", prompt)
                        )
                    )
                ),
                "generationConfig", Map.of(
                    "response_mime_type", "application/json",
                    "temperature", 0.2
                )
            );

            log.info("Sending triage request to Gemini 2.5 Flash API...");

            Map<?, ?> response = restClient.post()
                .uri(fullUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

            if (response != null && response.containsKey("candidates")) {
                List<?> candidates = (List<?>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<?, ?> candidate = (Map<?, ?>) candidates.get(0);
                    Map<?, ?> content = (Map<?, ?>) candidate.get("content");
                    List<?> parts = (List<?>) content.get("parts");
                    if (!parts.isEmpty()) {
                        Map<?, ?> part = (Map<?, ?>) parts.get(0);
                        String rawJsonText = (String) part.get("text");

                        log.debug("Received raw JSON text from Gemini: {}", rawJsonText);
                        return objectMapper.readValue(rawJsonText, TriageResult.class);
                    }
                }
            }
            throw new RuntimeException("Empty or invalid candidate response from Gemini API");

        } catch (Exception e) {
            log.error("Failed to query Gemini API: {}. Generating fallback triage result.", e.getMessage(), e);
            return generateFallbackTriage(sanitizedLog, ecosystem);
        }
    }

    private TriageResult generateFallbackTriage(String logText, String ecosystem) {
        Severity severity = logText.contains("OutOfMemoryError") || logText.contains("OOMKilled") || logText.contains("Fatal") 
                ? Severity.CRITICAL 
                : (logText.contains("NullPointerException") || logText.contains("ConnectionRefused") ? Severity.HIGH : Severity.MEDIUM);

        String ecoName = ecosystem != null && !ecosystem.isBlank() ? ecosystem : "General";

        return TriageResult.builder()
            .title(ecoName + " Application Runtime Exception")
            .severity(severity)
            .rootCause("Automated diagnostic fallback: Detected critical stack trace anomaly in " + ecoName + " pipeline. Root cause indicates unhandled exception or resource exhaustion during runtime execution.")
            .actionItems(List.of(
                "Verify service configuration and environment variables.",
                "Inspect memory heap usage and GC logs for potential memory leaks.",
                "Check network connection strings and downstream API availability.",
                "Apply git patch fix to safeguard null references or boundary checks."
            ))
            .patchDiff("""
                --- a/src/main/java/com/example/Application.java
                +++ b/src/main/java/com/example/Application.java
                @@ -42,7 +42,9 @@ public class Application {
                     public void processRequest(Request request) {
                -        request.getPayload().execute();
                +        if (request != null && request.getPayload() != null) {
                +            request.getPayload().execute();
                +        }
                     }
                 }
                """.stripIndent())
            .build();
    }
}
