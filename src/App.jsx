import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TriageWorkbench from './components/TriageWorkbench';
import IncidentView from './components/IncidentView';
import CodeRectifier from './components/CodeRectifier';
import RectificationView from './components/RectificationView';

export default function App() {
  const [activeTab, setActiveTab] = useState('triage'); // 'triage' | 'rectify'
  const [incidents, setIncidents] = useState([]);
  const [activeIncident, setActiveIncident] = useState(null);
  const [activeRectification, setActiveRectification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) setIncidents(await res.json());
    } catch (err) {
      console.warn('[PanicZero] /api/incidents unreachable:', err.message);
    }
  };

  // ── Log Triage ──────────────────────────────────────────────────────
  const handleTriageLog = async ({ rawLog, ecosystem }) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawLog, ecosystem }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Triage failed with status ${res.status}`);
      }

      setIncidents((prev) => [data, ...prev]);
      setActiveIncident(data);
    } catch (err) {
      console.error('[PanicZero] Triage Error:', err);
      setErrorMessage(err.message || 'Failed to process triage.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Code Rectification ─────────────────────────────────────────────
  const handleRectifyCode = async ({ code, language, instructions }) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/rectify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, instructions }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Rectification failed with status ${res.status}`);
      }

      setActiveRectification(data);
    } catch (err) {
      console.error('[PanicZero] Rectify Error:', err);
      setErrorMessage(err.message || 'Failed to process code rectification.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Incident Actions ───────────────────────────────────────────────
  const handleDeleteIncident = async (id) => {
    try {
      await fetch(`/api/incidents/${id}`, { method: 'DELETE' });
      setIncidents((prev) => prev.filter((i) => i.id !== id));
      if (activeIncident?.id === id) setActiveIncident(null);
    } catch (err) {
      console.error('[PanicZero] Delete Error:', err);
    }
  };

  const handleNewSession = () => {
    setActiveIncident(null);
    setActiveRectification(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveIncident(null);
    setActiveRectification(null);
    setErrorMessage(null);
  };

  // ── Determine main content ─────────────────────────────────────────
  const renderMainContent = () => {
    // If viewing an incident detail
    if (activeTab === 'triage' && activeIncident) {
      return (
        <IncidentView
          incident={activeIncident}
          onBack={() => setActiveIncident(null)}
        />
      );
    }

    // If viewing a rectification result
    if (activeTab === 'rectify' && activeRectification) {
      return (
        <RectificationView
          rectification={activeRectification}
          onBack={() => setActiveRectification(null)}
        />
      );
    }

    // Otherwise show the input form for the active tab
    if (activeTab === 'triage') {
      return (
        <TriageWorkbench
          onSubmit={handleTriageLog}
          isTriaging={isProcessing}
        />
      );
    }

    return (
      <CodeRectifier
        onSubmit={handleRectifyCode}
        isRectifying={isProcessing}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNewSession={handleNewSession}
        isProcessing={isProcessing}
        totalIncidents={incidents.length}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar — only visible in triage tab */}
        {activeTab === 'triage' && (
          <Sidebar
            incidents={incidents}
            activeIncidentId={activeIncident?.id}
            onSelectIncident={(incident) => setActiveIncident(incident)}
            onDeleteIncident={handleDeleteIncident}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        )}

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
          {errorMessage && (
            <div className="max-w-4xl mx-auto m-4 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-white font-bold px-2 py-0.5 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Mobile tab switcher (visible on small screens) */}
          <div className="sm:hidden flex items-center justify-center p-3 gap-2">
            <button
              onClick={() => handleTabChange('triage')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'triage'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Log Triage
            </button>
            <button
              onClick={() => handleTabChange('rectify')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === 'rectify'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Code Fix
            </button>
          </div>

          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}
