import React, { useState } from 'react';
import { searchCast } from '../../api/tmdbAPI';

const CastSearch = ({ onCastResults, onClearCast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const data = await searchCast(searchTerm.trim());
      onCastResults(data);
    } catch (err) {
      console.error('Error searching cast:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onClearCast();
  };

  return (
    <div className="bg-[#181818] border border-zinc-800 rounded-lg p-4 mb-6 text-sm text-gray-200">
      <form onSubmit={handleSearch} className="flex items-center gap-3">
        <span className="font-semibold text-red-600 flex items-center gap-1 shrink-0">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
          Search by Actor/Cast:
        </span>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. Leonardo DiCaprio, Shah Rukh Khan, Zendaya..."
          className="flex-1 bg-black/60 border border-zinc-700 rounded px-3 py-1.5 focus:outline-none focus:border-red-600 transition text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1.5 rounded transition"
        >
          {loading ? 'Searching...' : 'Search Actor'}
        </button>

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-white underline shrink-0"
          >
            Clear Cast Filter
          </button>
        )}
      </form>
    </div>
  );
};

export default CastSearch;
