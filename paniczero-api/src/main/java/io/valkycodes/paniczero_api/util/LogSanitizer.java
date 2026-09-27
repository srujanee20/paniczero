package io.valkycodes.paniczero_api.util;

import java.util.regex.Pattern;

public class LogSanitizer {

    private static final Pattern BEARER_PATTERN = Pattern.compile("Bearer\\s+[A-Za-z0-9\\-_\\.\\+\\/]+=*", Pattern.CASE_INSENSITIVE);
    private static final Pattern JWT_PATTERN = Pattern.compile("eyJ[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_.+/=]+");
    private static final Pattern SENSITIVE_KV_PATTERN = Pattern.compile("(?i)(password|passwd|secret|api_?key|access_?token|auth_?token)\\s*[:=]\\s*[\"']?[^\\s, \"']+[\"']?");

    public static String sanitize(String rawLog) {
        if (rawLog == null || rawLog.isBlank()) {
            return "";
        }

        String cleaned = rawLog;
        cleaned = BEARER_PATTERN.matcher(cleaned).replaceAll("Bearer [REDACTED]");
        cleaned = JWT_PATTERN.matcher(cleaned).replaceAll("[JWT_TOKEN_REDACTED]");
        cleaned = SENSITIVE_KV_PATTERN.matcher(cleaned).replaceAll("$1=[REDACTED]");

        return cleaned.strip();
    }
}
