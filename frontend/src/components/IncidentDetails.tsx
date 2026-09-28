import React, { useState } from 'react';
import { Incident, InvestigationResult } from '../types/incident';
import { SeverityBadge } from './SeverityBadge';
import { apiService } from '../services/api';
import { Play, Activity, Cpu, Server, AlertCircle, BookOpen, Layers, Save, ThumbsUp, ThumbsDown, CheckSquare, X } from 'lucide-react';

interface IncidentDetailsProps {
  incident: Incident;
  onInvestigate: () => void;
  investigating: boolean;
  onRefresh?: () => void;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
  incident,
  onInvestigate,
  investigating,
  onRefresh,
}) => {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [actualRootCause, setActualRootCause] = useState(incident.root_cause || '');
  const [fixDescription, setFixDescription] = useState(incident.resolution || '');
  const [recommendationUseful, setRecommendationUseful] = useState(true);
  const [savingMemory, setSavingMemory] = useState(false);
  const [memorySavedSuccess, setMemorySavedSuccess] = useState(false);

  const signals = incident.live_signals || {
    cpu: '88%',
    memory: '92%',
    errors: '2,481',
    latency: '3.8 sec',
  };

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMemory(true);
    try {
      await apiService.teachAI(incident.id, {
        actual_root_cause: actualRootCause,
        fix_description: fixDescription,
        ai_recommendation_useful: recommendationUseful,
      });
      setMemorySavedSuccess(true);
      if (onRefresh) onRefresh();
      setTimeout(() => {
        setMemorySavedSuccess(false);
        setShowTeachModal(false);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingMemory(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
      {/* Incident Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-sm font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {incident.id}
            </span>
            <SeverityBadge severity={incident.severity} />
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                incident.status === 'RESOLVED'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}
            >
              STATUS: {incident.status}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{incident.title}</h2>
          <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
            <span>Started: {new Date(incident.created_at).toLocaleTimeString()}</span>
            <span>•</span>
            <span>Duration: 14 min</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onInvestigate}
            disabled={investigating}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{investigating ? 'Investigating...' : 'AI Root-Cause Analysis'}</span>
          </button>
        </div>
      </div>

      {/* WHAT HAPPENED */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          WHAT HAPPENED
        </h4>
        <p className="text-xs text-slate-200 bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60 leading-relaxed">
          {incident.summary}
        </p>
      </div>

      {/* LIVE SIGNALS & AI INVESTIGATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LIVE SIGNALS */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>LIVE TELEMETRY SIGNALS</span>
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CPU</span>
              <span className="text-slate-200 font-bold text-sm">{signals.cpu}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Memory</span>
              <span className="text-slate-200 font-bold text-sm">{signals.memory}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Errors</span>
              <span className="text-red-400 font-bold text-sm">{signals.errors}</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Latency</span>
              <span className="text-amber-400 font-bold text-sm">{signals.latency}</span>
            </div>
          </div>
        </div>

        {/* AI INVESTIGATION / MEMORY MATCH */}
        <div className="bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/30 space-y-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>HINDSIGHT MEMORY MATCH</span>
          </h4>

          <div className="space-y-2 text-xs">
            <p className="text-slate-300 font-medium">4 similar historical incidents matched:</p>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="text-slate-200">INC-001 Connection Leak</span>
                <span className="text-emerald-400 font-bold">92% similar</span>
              </div>
              <div className="flex justify-between bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="text-slate-200">INC-002 Gateway Timeout</span>
                <span className="text-emerald-400 font-bold">87% similar</span>
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-500/20">
              <span className="text-indigo-300 font-bold block text-[11px]">Likely Root Cause:</span>
              <p className="text-slate-200 font-medium text-xs mt-0.5">
                {incident.root_cause || 'Database connection pool exhaustion & unindexed query scans'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED INVESTIGATION CHECKLIST */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <span>RECOMMENDED INVESTIGATION CHECKLIST</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800 flex items-center space-x-2 text-slate-200">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Check database connection pool limits</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800 flex items-center space-x-2 text-slate-200">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Compare deployment {incident.deployment || 'v2.5.0'} changes</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800 flex items-center space-x-2 text-slate-200">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Check DB connection timeout</span>
          </div>
          <div className="bg-slate-800/40 p-2.5 rounded border border-slate-800 flex items-center space-x-2 text-slate-200">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>Review INC-001 resolution history</span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => setShowEvidenceModal(true)}
          className="flex items-center space-x-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>[ View Memory Evidence ]</span>
        </button>

        <a
          href="#runbook"
          className="flex items-center space-x-2 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>[ Open Runbook ]</span>
        </a>

        <button
          onClick={() => setShowTeachModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all ml-auto shadow-md shadow-emerald-600/20"
        >
          <Save className="w-4 h-4" />
          <span>[ Resolve & Teach AI ]</span>
        </button>
      </div>

      {/* MEMORY EVIDENCE MODAL */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in">
            <button
              onClick={() => setShowEvidenceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Hindsight Memory Evidence Chain</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Traceability matrix explaining AI root cause recommendation</p>
            </div>

            {/* Visual Diagram */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs space-y-3 font-mono">
              <div className="inline-block bg-red-500/20 text-red-400 px-3 py-1 rounded border border-red-500/30 font-bold">
                CURRENT INCIDENT: {incident.id} (HTTP 503 / High CPU)
              </div>
              <div className="text-slate-500">↓ Hindsight Vector Search</div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold block">INC-001</span>
                  <span className="text-slate-400">92% Match</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold block">INC-002</span>
                  <span className="text-slate-400">87% Match</span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold block">INC-003</span>
                  <span className="text-slate-400">81% Match</span>
                </div>
              </div>
              <div className="text-slate-500">↓ Common Root Cause Pattern</div>
              <div className="inline-block bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded border border-indigo-500/30 font-bold">
                Database Connection Exhaustion
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <span className="text-indigo-400 font-bold block mb-1">Evidence 1: INC-001</span>
                <p className="text-slate-300">Same DB error + user service domain. Resolution: Increased connection pool + unclosed connection patch.</p>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <span className="text-indigo-400 font-bold block mb-1">Evidence 2: INC-002</span>
                <p className="text-slate-300">Similar deployment release timeout. Resolution: Added client socket timeout guards.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEACH THE AI MODAL */}
      {showTeachModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowTeachModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Save className="w-5 h-5 text-emerald-400" />
                <span>Incident Resolution — Teach OpsMemory AI</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Index verified resolution into Hindsight organizational memory</p>
            </div>

            <form onSubmit={handleSaveMemory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">What was the actual root cause?</label>
                <textarea
                  value={actualRootCause}
                  onChange={(e) => setActualRootCause(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Missing composite index on inventory_items table"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">What fixed the problem?</label>
                <textarea
                  value={fixDescription}
                  onChange={(e) => setFixDescription(e.target.value)}
                  required
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Executed CONCURRENTLY index creation and scaled DB pool"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Was the AI recommendation useful?</label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setRecommendationUseful(true)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border font-bold transition-all ${
                      recommendationUseful
                        ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>YES</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendationUseful(false)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border font-bold transition-all ${
                      !recommendationUseful
                        ? 'bg-red-600/20 text-red-400 border-red-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>NO</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingMemory}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-600/20"
              >
                {savingMemory ? 'Saving...' : '[ SAVE TO ORGANIZATIONAL MEMORY ]'}
              </button>

              {memorySavedSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-emerald-400 text-center font-bold">
                  ✓ Organizational Memory Updated Successfully!
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
