import React, { useState } from 'react';
import { Code2, Play, Sparkles, Wrench, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  'Auto-Detect',
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'Go',
  'Rust',
  'C++',
  'C#',
  'Ruby',
  'PHP',
  'SQL',
  'Bash',
  'YAML',
  'Dockerfile',
];

const CODE_SAMPLES = [
  {
    name: 'Java Null Unsafe',
    language: 'Java',
    code: `public class UserService {
    private UserRepository userRepo;

    public String getUserEmail(Long userId) {
        User user = userRepo.findById(userId);
        return user.getEmail().toLowerCase();
    }

    public void deleteUser(Long userId) {
        User user = userRepo.findById(userId);
        user.setActive(false);
        userRepo.save(user);
        auditLog.record("Deleted user " + user.getName());
    }
}`,
  },
  {
    name: 'Python SQL Injection',
    language: 'Python',
    code: `import sqlite3

def get_user(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    query = "SELECT * FROM users WHERE username = '" + username + "'"
    cursor.execute(query)
    result = cursor.fetchone()
    return result

def update_password(user_id, new_password):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(f"UPDATE users SET password = '{new_password}' WHERE id = {user_id}")
    conn.commit()`,
  },
  {
    name: 'Node.js Async Bug',
    language: 'JavaScript',
    code: `const express = require('express');
const fs = require('fs');

app.get('/api/data/:file', (req, res) => {
    const filePath = './data/' + req.params.file;
    const data = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(data);
    res.json(parsed);
});

app.post('/api/process', async (req, res) => {
    const items = req.body.items;
    const results = [];
    items.forEach(async (item) => {
        const result = await processItem(item);
        results.push(result);
    });
    res.json({ results });
});`,
  },
  {
    name: 'Go Race Condition',
    language: 'Go',
    code: `package main

import (
    "fmt"
    "net/http"
)

var counter int

func handler(w http.ResponseWriter, r *http.Request) {
    counter++
    fmt.Fprintf(w, "Request count: %d", counter)
}

func main() {
    http.HandleFunc("/", handler)
    http.ListenAndServe(":8080", nil)
}`,
  },
];

export default function CodeRectifier({ onSubmit, isRectifying }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('Auto-Detect');
  const [instructions, setInstructions] = useState('');

  const handleSampleSelect = (sample) => {
    setCode(sample.code);
    setLanguage(sample.language);
    setInstructions('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || isRectifying) return;
    onSubmit({ code, language, instructions });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Hero */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-800/60 text-violet-400 text-xs font-mono mb-2">
          <Wrench className="h-3.5 w-3.5" />
          <span>AI Code Rectification Engine</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
          Paste Buggy Code &amp; Get Instant Fixes
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto font-sans">
          PanicZero analyzes your code for bugs, security vulnerabilities, performance issues, and anti-patterns — then generates a corrected version with a unified git patch.
        </p>
      </div>

      {/* Sample Code Buttons */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
          <Sparkles className="h-3.5 w-3.5 text-violet-500" />
          <span>Sample Buggy Code Snippets</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CODE_SAMPLES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleSelect(sample)}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-900/80 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-violet-400 font-mono truncate">
                {sample.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {sample.language}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Input Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Toolbar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="h-3 w-3 rounded-full bg-violet-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <Code2 className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              code_snippet.src
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-violet-400" />
              <span>Language:</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-mono px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Code textarea */}
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your buggy code snippet here..."
            rows={14}
            className="w-full bg-slate-950/90 text-slate-200 font-mono text-xs p-4 focus:outline-none resize-y leading-relaxed border-b border-slate-800 placeholder-slate-600"
            spellCheck={false}
          />
        </div>

        {/* Optional instructions */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/40">
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Optional: Describe the bug or what you want fixed (e.g., 'Fix the null pointer issue on line 6')..."
            className="w-full bg-slate-950/80 text-slate-200 font-mono text-xs px-3 py-2 rounded-md border border-slate-800 focus:outline-none focus:border-violet-500/50 placeholder-slate-600"
          />
        </div>

        {/* Submit */}
        <div className="bg-slate-900/60 px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span>Bug Detection &amp; Auto-Patch Engine</span>
          </div>

          <button
            type="submit"
            disabled={!code.trim() || isRectifying}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-violet-950/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isRectifying ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing with Gemini...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Rectify Code with AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
