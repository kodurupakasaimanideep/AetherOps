import React, { useState, useEffect } from 'react';
import { Incident } from '../types/incident';
import { MemoryCard } from '../components/MemoryCard';
import { apiService } from '../services/api';
import { Search, Database, BrainCircuit, CheckCircle, Clock, Filter, BookOpen } from 'lucide-react';

export const Memory: React.FC = () => {
  const [memories, setMemories] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiService.fetchMemories().then(setMemories).catch(console.error);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      const data = await apiService.fetchMemories();
      setMemories(data);
      return;
    }
    setLoading(true);
    try {
      const res = await apiService.searchMemories(searchQuery);
      setMemories(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
            <span>ORGANIZATIONAL MEMORY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search 2,481 historical incident vector fingerprints, root cause patterns, and verified solutions.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔎 Search organizational memory by keywords, root causes, or error traces..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 shadow-inner"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
        >
          {loading ? 'Searching...' : 'Search Memory'}
        </button>
      </form>

      {/* Memory Categories Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>MEMORY CATEGORIES</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-semibold">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300">Incidents</span>
            <span className="text-indigo-400 font-mono font-bold">2,481</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300">Root Causes</span>
            <span className="text-emerald-400 font-mono font-bold">736</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300">Resolutions</span>
            <span className="text-amber-400 font-mono font-bold">914</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300">Runbooks</span>
            <span className="text-cyan-400 font-mono font-bold">182</span>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between">
            <span className="text-slate-300">Deployment Patterns</span>
            <span className="text-purple-400 font-mono font-bold">421</span>
          </div>
        </div>
      </div>

      {/* Recently Learned Section */}
      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          <span>RECENTLY LEARNED PATTERNS</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400" />
                <span>Database Connection Exhaustion</span>
              </span>
              <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Last updated: 2 minutes ago</span>
              </span>
            </div>

            <div className="flex items-center space-x-4 text-slate-400 text-[11px] font-mono">
              <span>Learned from: <strong className="text-indigo-300">INC-004</strong></span>
              <span>•</span>
              <span>Related incidents: <strong className="text-emerald-400">7</strong></span>
            </div>

            <div className="space-y-1 text-slate-300 pt-1">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Increasing connection pool size resolved 4 incidents</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deployment hotfix patch resolved 3 incidents</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indexed Memory List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
          <Database className="w-4 h-4 text-indigo-400" />
          <span>Indexed Incident Memories</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} />
          ))}
        </div>
      </div>
    </div>
  );
};
