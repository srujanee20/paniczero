# PanicZero — Automated SRE Triage Workbench

> AI-powered crash log triage and code rectification, powered by Google Gemini 2.5 Flash.

## Features

- **🔥 Log Triage** — Paste any crash log (Java, Python, Node.js, Docker) and get instant severity scoring, root cause analysis, mitigation steps, and a unified git patch fix.
- **🔧 Code Rectification** — Paste buggy code snippets and get AI-powered bug detection, security analysis, and auto-generated fixes with explanations.
- **📊 Visual Diff Viewer** — GitHub-style red/green split diff viewer for patches.
- **📋 Incident History** — Sidebar with searchable incident history.
- **🛡️ Log Sanitizer** — Automatically redacts Bearer tokens, JWTs, passwords, and API keys before sending to AI.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS v4
- **Backend:** Express.js (Vercel Serverless Functions)
- **AI:** Google Gemini 2.5 Flash (Strict JSON Mode)
- **Deployment:** Vercel

## Quick Start (Local Development)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd paniczero
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Start the backend (Terminal 1)
npm run server

# 4. Start the frontend (Terminal 2)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Vercel auto-detects Vite + the `api/` serverless functions.
4. Add `GEMINI_API_KEY` in **Settings → Environment Variables**.
5. Deploy!

## Project Structure

```
paniczero/
├── api/                    # Express serverless functions
│   ├── index.js            # Main API routes (triage, rectify, incidents)
│   ├── geminiService.js    # Gemini 2.5 Flash integration
│   └── logSanitizer.js     # Credential redaction engine
├── src/                    # React frontend
│   ├── App.jsx             # Main app with tab navigation
│   ├── components/
│   │   ├── Header.jsx      # Navigation header with tab switcher
│   │   ├── Sidebar.jsx     # Incident history sidebar
│   │   ├── TriageWorkbench.jsx   # Log triage input form
│   │   ├── IncidentView.jsx      # Triage results view
│   │   ├── CodeRectifier.jsx     # Code snippet input form
│   │   ├── RectificationView.jsx # Code fix results view
│   │   └── DiffViewer.jsx        # Visual diff component
│   ├── index.css           # Tailwind + custom styles
│   └── main.jsx            # React entry point
├── index.html              # HTML shell
├── vite.config.js          # Vite configuration
├── vercel.json             # Vercel deployment config
├── package.json
└── .env.example
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/triage` | Triage a crash log |
| `POST` | `/api/rectify` | Rectify a code snippet |
| `GET` | `/api/incidents` | List all triage incidents |
| `GET` | `/api/incidents/:id` | Get a specific incident |
| `DELETE` | `/api/incidents/:id` | Delete an incident |
| `GET` | `/api/rectifications` | List all rectifications |
| `GET` | `/api/health` | Health check |

## License

MIT
