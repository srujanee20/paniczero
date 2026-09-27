import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import { GitCommit, Copy, Check, Columns, AlignJustify } from 'lucide-react';

export default function DiffViewer({ patchDiff }) {
  const [copied, setCopied] = useState(false);
  const [splitView, setSplitView] = useState(true);

  if (!patchDiff) {
    return (
      <div className="p-6 text-center text-slate-500 font-mono text-xs bg-slate-950/60 rounded-xl border border-slate-800">
        No git diff patch suggestion provided for this incident.
      </div>
    );
  }

  // Extract old / new code segments if patch diff contains --- / +++
  const handleCopy = () => {
    navigator.clipboard.writeText(patchDiff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom Dark Mode styles for react-diff-viewer-continued
  const customStyles = {
    variables: {
      dark: {
        diffViewerBackground: '#030712',
        diffViewerColor: '#e2e8f0',
        addedBackground: '#064e3b',
        addedColor: '#6ee7b7',
        removedBackground: '#7f1d1d',
        removedColor: '#fca5a5',
        wordAddedBackground: '#047857',
        wordRemovedBackground: '#991b1b',
        addedGutterBackground: '#022c22',
        removedGutterBackground: '#450a0a',
        gutterBackground: '#090d16',
        gutterBackgroundDark: '#090d16',
        highlightBackground: '#1e293b',
        highlightGutterBackground: '#0f172a',
        codeFoldGutterBackground: '#0f172a',
        codeFoldBackground: '#090d16',
        emptyLineBackground: '#090d16',
        gutterColor: '#64748b',
        addedGutterColor: '#34d399',
        removedGutterColor: '#f87171',
      },
    },
    line: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      lineHeight: '1.6',
    },
    wordDiff: {
      padding: '1px 2px',
      borderRadius: '2px',
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Diff Toolbar Header */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Unified Git Patch Solution
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono border border-emerald-800">
            Split Red/Green Diff
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Split / Unified Toggle */}
          <button
            onClick={() => setSplitView(!splitView)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            {splitView ? <Columns className="h-3.5 w-3.5" /> : <AlignJustify className="h-3.5 w-3.5" />}
            <span>{splitView ? 'Split View' : 'Unified View'}</span>
          </button>

          {/* Copy Patch Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/80 border border-rose-800/80 text-rose-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied Patch!' : 'Copy Patch'}</span>
          </button>
        </div>
      </div>

      {/* Raw Patch Snippet / Viewer */}
      <div className="overflow-x-auto text-xs font-mono">
        <ReactDiffViewer
          oldValue={extractOldCode(patchDiff)}
          newValue={extractNewCode(patchDiff)}
          splitView={splitView}
          useDarkTheme={true}
          styles={customStyles}
          compareMethod={DiffMethod.WORDS}
          leftTitle="Original Buggy Code"
          rightTitle="Patched Solution"
        />
      </div>
    </div>
  );
}

// Helpers to parse raw git diff text into old vs new strings for visual diffing
function extractOldCode(diffText) {
  if (!diffText) return '';
  const lines = diffText.split('\n');
  const oldLines = [];
  for (const line of lines) {
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('@@')) continue;
    if (line.startsWith('-')) {
      oldLines.push(line.substring(1));
    } else if (!line.startsWith('+')) {
      oldLines.push(line);
    }
  }
  return oldLines.join('\n');
}

function extractNewCode(diffText) {
  if (!diffText) return '';
  const lines = diffText.split('\n');
  const newLines = [];
  for (const line of lines) {
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('@@')) continue;
    if (line.startsWith('+')) {
      newLines.push(line.substring(1));
    } else if (!line.startsWith('-')) {
      newLines.push(line);
    }
  }
  return newLines.join('\n');
}
