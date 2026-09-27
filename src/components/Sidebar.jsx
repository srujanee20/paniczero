import React, { useState } from 'react';
import { History, Search, Trash2, AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronLeft, ChevronRight, Server } from 'lucide-react';

export default function Sidebar({ incidents, activeIncidentId, onSelectIncident, onDeleteIncident, isOpen, onToggle }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter(incident => 
    incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.ecosystem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.severity?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return { bg: 'bg-rose-950/80 text-rose-400 border-rose-800/80', icon: AlertCircle };
      case 'HIGH':
        return { bg: 'bg-amber-950/80 text-amber-400 border-amber-800/80', icon: AlertTriangle };
      case 'MEDIUM':
        return { bg: 'bg-yellow-950/80 text-yellow-400 border-yellow-800/80', icon: Info };
      default:
        return { bg: 'bg-blue-950/80 text-blue-400 border-blue-800/80', icon: CheckCircle2 };
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className={`relative transition-all duration-300 z-30 bg-slate-900/90 border-r border-slate-800 flex flex-col h-[calc(100vh-61px)] ${isOpen ? 'w-80' : 'w-12'}`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 z-40 h-6 w-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors cursor-pointer shadow-md"
        title={isOpen ? "Collapse Sidebar" : "Expand History Sidebar"}
      >
        {isOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>

      {isOpen ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200 font-semibold font-mono text-xs tracking-wider uppercase">
              <History className="h-4 w-4 text-rose-500" />
              <span>Incident History</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {incidents.length} Saved
            </span>
          </div>

          {/* Search Box */}
          <div className="p-3 border-b border-slate-800/60">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter logs or severity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-1.5 rounded-md border border-slate-800 focus:outline-none focus:border-rose-500/50 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Incident List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-10 px-4">
                <Server className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-mono">No incidents found in DB</p>
              </div>
            ) : (
              filteredIncidents.map((incident) => {
                const badge = getSeverityBadge(incident.severity);
                const Icon = badge.icon;
                const isSelected = incident.id === activeIncidentId;

                return (
                  <div
                    key={incident.id}
                    onClick={() => onSelectIncident(incident)}
                    className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-600/60 shadow-lg shadow-rose-950/20'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border font-mono ${badge.bg}`}>
                          <Icon className="h-2.5 w-2.5" />
                          {incident.severity}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {incident.ecosystem || 'GENERIC'}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteIncident(incident.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs font-medium text-slate-200 line-clamp-2 leading-snug mb-1 font-sans">
                      {incident.title}
                    </h4>

                    <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>{formatDate(incident.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div className="py-6 flex flex-col items-center gap-4 text-slate-500">
          <History className="h-5 w-5 text-rose-500" />
          <span className="text-[10px] font-mono [writing-mode:vertical-lr] rotate-180 uppercase tracking-widest">
            History ({incidents.length})
          </span>
        </div>
      )}
    </aside>
  );
}
