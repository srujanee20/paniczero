import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, CheckSquare, Square, Shield, ChevronDown, ChevronUp, Terminal, FileCode, ArrowLeft } from 'lucide-react';
import DiffViewer from './DiffViewer';

export default function IncidentView({ incident, onBack }) {
  const [completedItems, setCompletedItems] = useState({});
  const [showRawLog, setShowRawLog] = useState(false);

  if (!incident) return null;

  const toggleItem = (idx) => {
    setCompletedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const actionItems = incident.actionItems || [];
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = actionItems.length > 0 ? Math.round((completedCount / actionItems.length) * 100) : 0;

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-950/70 border-rose-600/80 shadow-rose-950/50',
          badgeBg: 'bg-rose-900/80 text-rose-300 border-rose-700',
          text: 'text-rose-400',
          icon: AlertCircle,
          glow: 'glass-panel-glow'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-950/70 border-amber-600/80 shadow-amber-950/50',
          badgeBg: 'bg-amber-900/80 text-amber-300 border-amber-700',
          text: 'text-amber-400',
          icon: AlertTriangle,
          glow: 'glass-panel'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-yellow-950/70 border-yellow-600/80 shadow-yellow-950/50',
          badgeBg: 'bg-yellow-900/80 text-yellow-300 border-yellow-700',
          text: 'text-yellow-400',
          icon: Info,
          glow: 'glass-panel'
        };
      default:
        return {
          bg: 'bg-blue-950/70 border-blue-600/80 shadow-blue-950/50',
          badgeBg: 'bg-blue-900/80 text-blue-300 border-blue-700',
          text: 'text-blue-400',
          icon: CheckCircle2,
          glow: 'glass-panel'
        };
    }
  };

  const config = getSeverityConfig(incident.severity);
  const SeverityIcon = config.icon;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Back button & Incident Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Triage Console</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Incident ID:</span>
          <span className="text-xs font-mono text-rose-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {incident.id ? incident.id.substring(0, 8) : 'RECENT'}
          </span>
        </div>
      </div>

      {/* Hero Severity War-Room Header Banner */}
      <div className={`p-6 rounded-2xl border transition-all ${config.glow}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${config.badgeBg} animate-pulse-glow`}>
                <SeverityIcon className="h-4 w-4" />
                {incident.severity} SEVERITY
              </span>

              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                {incident.ecosystem || 'GENERIC'}
              </span>

              <span className="text-xs font-mono text-slate-500">
                {incident.createdAt ? new Date(incident.createdAt).toLocaleString() : 'Just triaged'}
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-white font-sans leading-tight">
              {incident.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Grid: Root Cause Analysis & Mitigation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Root Cause Card (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Root Cause Analysis (Principal SRE)
            </h3>
          </div>

          <div className="text-xs lg:text-sm text-slate-300 leading-relaxed font-sans space-y-3">
            <p className="bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 font-mono text-rose-200/90 whitespace-pre-wrap">
              {incident.rootCause}
            </p>
          </div>
        </div>

        {/* Actionable Mitigation Checklist (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                  Mitigation Steps
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {completedCount}/{actionItems.length} Done ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mb-4">
              <div
                className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {actionItems.map((item, idx) => {
                const isChecked = !!completedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleItem(idx)}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-800/50 text-slate-400 line-through'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs font-sans leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Visual Red/Green Diff Viewer Section */}
      <div className="space-y-3">
        <DiffViewer patchDiff={incident.patchDiff} />
      </div>

      {/* Raw Log Accordion */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => setShowRawLog(!showRawLog)}
          className="w-full bg-slate-900/60 px-4 py-3 flex items-center justify-between text-left font-mono text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-slate-500" />
            <span>Sanitized Raw Stack Trace Log</span>
          </div>
          {showRawLog ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showRawLog && (
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {incident.rawLog}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
