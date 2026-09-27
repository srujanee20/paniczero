import React from 'react';
import { ShieldAlert, Sparkles, RefreshCw, PlusCircle, Terminal, Code2 } from 'lucide-react';

export default function Header({ activeTab, onTabChange, onNewSession, isProcessing, totalIncidents }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 p-0.5 shadow-lg shadow-rose-950/50">
            <div className="h-full w-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
                Panic<span className="text-rose-500">Zero</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/60 rounded-full uppercase">
                SRE Workbench
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              AI-Powered Incident Triage &amp; Code Rectification
            </p>
          </div>
        </div>

        {/* Gemini Status */}
        <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-mono text-slate-300">Gemini 2.5 Flash Online</span>
        </div>
      </div>

      {/* Center: Tab Switcher */}
      <div className="hidden sm:flex items-center bg-slate-900 rounded-lg border border-slate-800 p-0.5">
        <button
          onClick={() => onTabChange('triage')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
            activeTab === 'triage'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Log Triage</span>
        </button>
        <button
          onClick={() => onTabChange('rectify')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
            activeTab === 'rectify'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-950/50'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Code Fix</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-slate-500" />
          <span>Records:</span>
          <span className="font-mono font-semibold text-rose-400">{totalIncidents}</span>
        </div>

        <button
          onClick={onNewSession}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold font-mono text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 rounded-lg shadow-md shadow-rose-950/40 border border-rose-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
          ) : (
            <PlusCircle className="h-4 w-4" />
          )}
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
}
