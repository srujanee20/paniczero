import React, { useState } from 'react';
import { ArrowLeft, Bug, Shield, Zap, Paintbrush, AlertTriangle, Copy, Check, Code2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import DiffViewer from './DiffViewer';

const ISSUE_CONFIG = {
  BUG: { icon: Bug, color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-800/60' },
  SECURITY: { icon: Shield, color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-800/60' },
  PERFORMANCE: { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-950/60 border-cyan-800/60' },
  STYLE: { icon: Paintbrush, color: 'text-violet-400', bg: 'bg-violet-950/60 border-violet-800/60' },
  LOGIC: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-950/60 border-orange-800/60' },
};

export default function RectificationView({ rectification, onBack }) {
  const [copiedFixed, setCopiedFixed] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!rectification) return null;

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(rectification.fixedCode || '');
    setCopiedFixed(true);
    setTimeout(() => setCopiedFixed(false), 2000);
  };

  const issues = rectification.issues || [];

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Back + ID bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Code Rectifier</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Rectification ID:</span>
          <span className="text-xs font-mono text-violet-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {rectification.id ? rectification.id.substring(0, 8) : 'RECENT'}
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-violet-800/30 shadow-lg shadow-violet-950/20">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border bg-violet-900/80 text-violet-300 border-violet-700">
              <Code2 className="h-4 w-4" />
              CODE RECTIFIED
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
              {rectification.language || 'Unknown'}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {rectification.createdAt ? new Date(rectification.createdAt).toLocaleString() : 'Just now'}
            </span>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white font-sans leading-tight">
            {rectification.summary}
          </h1>
        </div>
      </div>

      {/* Grid: Issues Found + Fixed Code */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Issues Found */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bug className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Issues Detected ({issues.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {issues.length === 0 ? (
              <div className="text-xs text-slate-500 font-mono p-4 text-center">No issues detected.</div>
            ) : (
              issues.map((issue, idx) => {
                const cfg = ISSUE_CONFIG[issue.type] || ISSUE_CONFIG.BUG;
                const IssueIcon = cfg.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg}`}
                  >
                    <IssueIcon className={`h-4 w-4 ${cfg.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold font-mono ${cfg.color} uppercase`}>
                          {issue.type}
                        </span>
                        {issue.line && (
                          <span className="text-[10px] font-mono text-slate-500">
                            Line {issue.line}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-snug">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Explanation + Fixed Code */}
        <div className="lg:col-span-7 space-y-4">
          {/* Explanation */}
          <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Explanation
              </h3>
            </div>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 whitespace-pre-wrap">
              {rectification.explanation}
            </p>
          </div>

          {/* Fixed Code Block */}
          <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Fixed Code
                </span>
              </div>
              <button
                onClick={handleCopyFixed}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
              >
                {copiedFixed ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedFixed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 text-xs font-mono text-emerald-200/90 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
              {rectification.fixedCode}
            </pre>
          </div>
        </div>
      </div>

      {/* Diff Viewer */}
      {rectification.patchDiff && (
        <DiffViewer patchDiff={rectification.patchDiff} />
      )}

      {/* Original Code Accordion */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className="w-full bg-slate-900/60 px-4 py-3 flex items-center justify-between text-left font-mono text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-slate-500" />
            <span>Original Code Snippet</span>
          </div>
          {showOriginal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showOriginal && (
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {rectification.originalCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
