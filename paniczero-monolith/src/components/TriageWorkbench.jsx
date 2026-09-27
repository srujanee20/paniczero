import React, { useState } from 'react';
import { Terminal, Play, Sparkles, FileText, Code2, AlertTriangle, Layers } from 'lucide-react';

const PRESETS = [
  {
    name: 'Java Spring NullPointer',
    ecosystem: 'JAVA',
    log: `2026-09-27 10:14:22.411 ERROR 14022 --- [nio-8080-exec-4] c.v.p.controller.OrderController         : Internal Server Error processing payment
java.lang.NullPointerException: Cannot invoke "com.example.service.PaymentGateway.charge(com.example.model.Order)" because "this.paymentGateway" is null
	at com.example.service.OrderService.processOrder(OrderService.java:58) ~[classes/:na]
	at com.example.controller.OrderController.checkout(OrderController.java:34) ~[classes/:na]
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103) ~[na:na]
	at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:118)`
  },
  {
    name: 'Python FastAPI Traceback',
    ecosystem: 'PYTHON',
    log: `ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "/usr/local/lib/python3.11/site-packages/uvicorn/protocols/http/h11_impl.py", line 408, in run_asgi
    result = await app(self.scope, self.receive, self.send)
  File "/app/services/analytics.py", line 42, in calculate_conversion_rate
    conversion_rate = total_conversions / total_visitors
ZeroDivisionError: division by zero
  File "/app/routers/metrics.py", line 19, in get_metrics
    rate = calculate_conversion_rate(0, 0)`
  },
  {
    name: 'Docker OOMKilled',
    ecosystem: 'DOCKER',
    log: `2026-09-27T10:20:15.118942Z worker-node-02 kernel: Out of memory: Kill process 8912 (java) score 950 or sacrifice child
2026-09-27T10:20:15.120011Z worker-node-02 dockerd[1204]: Container c8f4b1a93e82 exited with status 137 (OOMKilled)
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`
  },
  {
    name: 'Node.js ECONNREFUSED',
    ecosystem: 'NODE',
    log: `[ERROR] 10:22:01 UnhandledPromiseRejection: Error: connect ECONNREFUSED 127.0.0.1:5432
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1159:16)
    at Pool.connect (/app/node_modules/pg/lib/pool.js:56:21)
    at DatabaseService.executeQuery (/app/dist/db.js:14:18)
    at async UserAuth.findUserById (/app/dist/auth.js:88:25)`
  }
];

export default function TriageWorkbench({ onSubmit, isTriaging }) {
  const [logText, setLogText] = useState('');
  const [ecosystem, setEcosystem] = useState('JAVA');

  const handlePresetSelect = (preset) => {
    setLogText(preset.log);
    setEcosystem(preset.ecosystem);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!logText.trim() || isTriaging) return;
    onSubmit({ rawLog: logText, ecosystem });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-400 text-xs font-mono mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Principal SRE Intelligence Console</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
          Paste Raw Stack Trace & Crash Logs
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto font-sans">
          PanicZero sanitizes sensitive tokens, invokes Gemini 2.5 Flash in strict JSON mode, and generates root-cause analysis with unified red/green git patches.
        </p>
      </div>

      {/* Preset Quick Load Buttons */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
          <Layers className="h-3.5 w-3.5 text-rose-500" />
          <span>Quick Sample Crash Logs</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-rose-400 font-mono truncate">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {preset.ecosystem}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Log Entry Console Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Terminal Header Toolbar */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
              <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <Terminal className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-mono font-medium text-slate-300">
              crash_log_input.log
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Target Ecosystem:</span>
            </label>
            <select
              value={ecosystem}
              onChange={(e) => setEcosystem(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-mono px-3 py-1.5 rounded-md border border-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="JAVA">Java Spring Boot</option>
              <option value="PYTHON">Python FastAPI / Django</option>
              <option value="DOCKER">Docker / Kubernetes</option>
              <option value="NODE">Node.js / Express</option>
              <option value="AUTO">Auto-Detect</option>
            </select>
          </div>
        </div>

        {/* Textarea Console Input */}
        <div className="relative">
          <textarea
            value={logText}
            onChange={(e) => setLogText(e.target.value)}
            placeholder="Paste multi-line stack trace or error log here..."
            rows={12}
            className="w-full bg-slate-950/90 text-slate-200 font-mono text-xs p-4 focus:outline-none resize-y leading-relaxed border-b border-slate-800 placeholder-slate-600"
          />
        </div>

        {/* Action Footer */}
        <div className="bg-slate-900/60 px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sanitizer & JSON Mode Active</span>
          </div>

          <button
            type="submit"
            disabled={!logText.trim() || isTriaging}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-rose-950/50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isTriaging ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Triaging Log with Gemini...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Execute SRE Triage Workbench</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
