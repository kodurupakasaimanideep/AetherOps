import React, { useState, useEffect } from 'react';
import { Incident } from '../types/incident';
import { MemoryCard } from '../components/MemoryCard';
import { apiService } from '../services/api';
import { Search, Database } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Database className="w-6 h-6 text-indigo-400" />
            <span>Hindsight Incident Memory Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search 12-vector similarity fingerprints of past production failures and solutions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords, errors, or service names (e.g. postgresql connection timeout)..."
            className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          {loading ? 'Searching...' : 'Search Engine'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {memories.map((mem) => (
          <MemoryCard key={mem.id} memory={mem} />
        ))}
      </div>
    </div>
  );
};
