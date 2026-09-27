/**
 * PanicZero — Gemini AI Service
 * Handles both log triage and code snippet rectification via Gemini 2.5 Flash.
 */

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Triage a crash log using Gemini 2.5 Flash in strict JSON mode.
 */
export const triageLog = async (sanitizedLog, ecosystem) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[PanicZero] GEMINI_API_KEY not set. Using fallback triage.');
    return generateFallbackTriage(sanitizedLog, ecosystem);
  }

  const prompt = `You are a Principal Site Reliability Engineer (SRE) with 15+ years experience.
Analyze the following ${ecosystem || 'System'} crash log and perform an urgent incident triage.

Return a strict JSON object with exactly these fields:
1. "title": Short descriptive incident title (max 10 words).
2. "severity": One of ["CRITICAL", "HIGH", "MEDIUM", "LOW"].
3. "rootCause": Deep SRE analysis of why the crash happened, referencing the exact component, class, and line.
4. "actionItems": An array of 3-5 actionable mitigation steps for on-call engineers.
5. "patchDiff": A valid Unified Git Patch (git diff format with --- a/ and +++ b/ headers, @@ hunk headers) showing the exact code/config fix.

Crash Log:
\`\`\`
${sanitizedLog}
\`\`\``;

  return callGemini(apiKey, prompt);
};

/**
 * Rectify a code snippet using Gemini 2.5 Flash.
 * User pastes buggy/incomplete code, Gemini returns fixed version + explanation.
 */
export const rectifyCode = async (codeSnippet, language, instructions) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[PanicZero] GEMINI_API_KEY not set. Using fallback rectification.');
    return generateFallbackRectification(codeSnippet, language);
  }

  const prompt = `You are a Principal Software Engineer and Code Reviewer.
Analyze the following ${language || 'code'} snippet and fix all bugs, security issues, performance problems, and anti-patterns.

${instructions ? `Additional context from the developer: "${instructions}"` : ''}

Return a strict JSON object with exactly these fields:
1. "summary": One-line summary of what was fixed (max 15 words).
2. "language": The detected or provided programming language.
3. "issues": An array of objects, each with "type" (one of ["BUG", "SECURITY", "PERFORMANCE", "STYLE", "LOGIC"]), "description" (what's wrong), and "line" (approximate line number, or null if global).
4. "fixedCode": The complete corrected code snippet, ready to use.
5. "explanation": A detailed paragraph explaining all changes made and why.
6. "patchDiff": A valid Unified Git Patch (git diff format with --- a/ and +++ b/ headers) showing original vs fixed.

Code Snippet (${language || 'auto-detect'}):
\`\`\`
${codeSnippet}
\`\`\``;

  return callGemini(apiKey, prompt);
};

/**
 * Core Gemini API caller — shared by triage & rectification.
 */
const callGemini = async (apiKey, prompt) => {
  const fullUrl = `${GEMINI_URL}?key=${apiKey}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.2,
    },
  };

  console.log('[PanicZero] Sending request to Gemini 2.5 Flash...');

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Gemini API ${response.status}: ${errBody}`);
  }

  const data = await response.json();

  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    const raw = data.candidates[0].content.parts[0].text;
    return JSON.parse(raw);
  }

  throw new Error('Empty or malformed Gemini API response');
};


// ── Fallback generators (when API key is missing) ───────────────────────

const generateFallbackTriage = (logText, ecosystem) => {
  const isCritical = /OutOfMemoryError|OOMKilled|FATAL|StackOverflow/i.test(logText);
  const isHigh = /NullPointerException|ECONNREFUSED|ConnectionRefused|TypeError|Segfault/i.test(logText);
  const severity = isCritical ? 'CRITICAL' : isHigh ? 'HIGH' : 'MEDIUM';
  const eco = ecosystem?.trim() || 'General';

  return {
    title: `${eco} Application Runtime Exception`,
    severity,
    rootCause: `[Fallback] Detected stack trace anomaly in the ${eco} runtime pipeline. The crash signature indicates an unhandled exception or resource exhaustion. Configure GEMINI_API_KEY for full AI-powered root cause analysis.`,
    actionItems: [
      'Verify service configuration and environment variables.',
      'Inspect memory/heap usage and GC logs for potential leaks.',
      'Check network connectivity and downstream API availability.',
      'Review the stack trace for null-safety and boundary checks.',
      'Apply the suggested git patch fix below.',
    ],
    patchDiff: `--- a/src/Application.java
+++ b/src/Application.java
@@ -42,7 +42,9 @@
     public void processRequest(Request request) {
-        request.getPayload().execute();
+        if (request != null && request.getPayload() != null) {
+            request.getPayload().execute();
+        }
     }`,
  };
};

const generateFallbackRectification = (codeSnippet, language) => {
  return {
    summary: 'Fallback: Add GEMINI_API_KEY for AI-powered code rectification',
    language: language || 'unknown',
    issues: [
      {
        type: 'BUG',
        description: 'AI code analysis unavailable — GEMINI_API_KEY not configured.',
        line: null,
      },
    ],
    fixedCode: codeSnippet,
    explanation:
      'The Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable (in .env locally or Vercel dashboard for production) to enable full AI-powered code rectification with detailed bug detection, security analysis, and auto-patching.',
    patchDiff: '--- a/code\n+++ b/code\n@@ No changes — API key required @@',
  };
};
