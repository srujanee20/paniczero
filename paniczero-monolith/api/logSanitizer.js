export const sanitize = (rawLog) => {
  if (!rawLog || rawLog.trim() === '') {
    return '';
  }

  let cleaned = rawLog;
  
  // Mask Bearer tokens
  const bearerPattern = /Bearer\s+[A-Za-z0-9\-\._~\+\/]+={0,2}/gi;
  cleaned = cleaned.replace(bearerPattern, 'Bearer [REDACTED]');

  // Mask JWTs
  const jwtPattern = /eyJ[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-\._\+/=]+/g;
  cleaned = cleaned.replace(jwtPattern, '[JWT_TOKEN_REDACTED]');

  // Mask sensitive key-value pairs
  const sensitiveKvPattern = /(password|passwd|secret|api_?key|access_?token|auth_?token)\s*[:=]\s*["']?[^\s, "']+["']?/gi;
  cleaned = cleaned.replace(sensitiveKvPattern, '$1=[REDACTED]');

  return cleaned.trim();
};
