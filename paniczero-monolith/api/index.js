/**
 * PanicZero — Express API Server
 * Vercel-compatible serverless entry point.
 */
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { sanitize } from './logSanitizer.js';
import { triageLog, rectifyCode } from './geminiService.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// In-memory stores (resets on cold start — fine for demo/hackathon)
let incidents = [];
let rectifications = [];

const router = express.Router();

// ── Triage Endpoints ────────────────────────────────────────────────────

router.post('/triage', async (req, res) => {
  try {
    const { rawLog, ecosystem } = req.body;

    if (!rawLog?.trim()) {
      return res.status(400).json({ error: 'rawLog is required' });
    }

    const sanitizedLog = sanitize(rawLog);
    const eco = ecosystem?.trim() || 'Auto-Detect';
    const triageResult = await triageLog(sanitizedLog, eco);

    const incident = {
      id: crypto.randomUUID(),
      title: triageResult.title,
      severity: triageResult.severity,
      ecosystem: eco,
      rootCause: triageResult.rootCause,
      actionItems: triageResult.actionItems || [],
      patchDiff: triageResult.patchDiff,
      rawLog: sanitizedLog,
      createdAt: new Date().toISOString(),
    };

    incidents.unshift(incident);
    res.status(201).json(incident);
  } catch (error) {
    console.error('[PanicZero] Triage Error:', error);
    res.status(500).json({ error: 'Failed to process triage request.' });
  }
});

router.get('/incidents', (_req, res) => {
  res.json(incidents);
});

router.get('/incidents/:id', (req, res) => {
  const incident = incidents.find((i) => i.id === req.params.id);
  if (incident) return res.json(incident);
  res.status(404).json({ error: 'Incident not found' });
});

router.delete('/incidents/:id', (req, res) => {
  const before = incidents.length;
  incidents = incidents.filter((i) => i.id !== req.params.id);
  incidents.length < before ? res.status(204).send() : res.status(404).json({ error: 'Incident not found' });
});

// ── Code Rectification Endpoints ────────────────────────────────────────

router.post('/rectify', async (req, res) => {
  try {
    const { code, language, instructions } = req.body;

    if (!code?.trim()) {
      return res.status(400).json({ error: 'code is required' });
    }

    const lang = language?.trim() || 'Auto-Detect';
    const result = await rectifyCode(code, lang, instructions);

    const rectification = {
      id: crypto.randomUUID(),
      summary: result.summary,
      language: result.language || lang,
      issues: result.issues || [],
      originalCode: code,
      fixedCode: result.fixedCode,
      explanation: result.explanation,
      patchDiff: result.patchDiff,
      instructions: instructions || null,
      createdAt: new Date().toISOString(),
    };

    rectifications.unshift(rectification);
    res.status(201).json(rectification);
  } catch (error) {
    console.error('[PanicZero] Rectify Error:', error);
    res.status(500).json({ error: 'Failed to process code rectification.' });
  }
});

router.get('/rectifications', (_req, res) => {
  res.json(rectifications);
});

// ── Health Check ─────────────────────────────────────────────────────────

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'PanicZero API',
    incidents: incidents.length,
    rectifications: rectifications.length,
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
  });
});

app.use('/api', router);

// Export for Vercel serverless
export default app;

// Local dev server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`[PanicZero] API server running at http://localhost:${port}`);
  });
}
