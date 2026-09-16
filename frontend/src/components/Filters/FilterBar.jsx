import React, { useEffect, useState } from 'react';
import { fetchGenres } from '../../api/tmdbAPI';

const FilterBar = ({ filters, onFilterChange, onReset }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchGenres()
      .then((data) => setGenres(data))
      .catch((err) => console.error('Failed to load genres in FilterBar:', err));
  }, []);

  const languages = [
    { code: '', label: 'All Languages' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'de', label: 'German' },
    { code: 'zh', label: 'Chinese' }
  ];

  const yearRanges = [
    { label: 'All Years', gte: '', lte: '' },
    { label: '2020 - Present', gte: '2020', lte: '2026' },
    { label: '2010 - 2019', gte: '2010', lte: '2019' },
    { label: '2000 - 2009', gte: '2000', lte: '2009' },
    { label: '1990 - 1999', gte: '1990', lte: '1999' },
    { label: 'Pre-1990', gte: '1950', lte: '1989' }
  ];

  const countries = [
    { code: '', label: 'All Countries' },
    { code: 'US', label: 'United States' },
    { code: 'IN', label: 'India' },
    { code: 'GB', label: 'United Kingdom' },
    { code: 'JP', label: 'Japan' },
    { code: 'KR', label: 'South Korea' },
    { code: 'FR', label: 'France' },
    { code: 'ES', label: 'Spain' },
    { code: 'DE', label: 'Germany' }
  ];

  return (
    <div className="bg-[#181818] border border-zinc-800 rounded-lg p-4 mb-6 text-sm text-gray-200 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
            </svg>
            Filter Movies:
          </span>

          {/* Genre Dropdown */}
          <select
            value={filters.genre || ''}
            onChange={(e) => onFilterChange('genre', e.target.value)}
            className="bg-black/60 border border-zinc-700 rounded px-3 py-1.5 focus:outline-none focus:border-red-600 transition"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          {/* Language Dropdown */}
          <select
            value={filters.language || ''}
            onChange={(e) => onFilterChange('language', e.target.value)}
            className="bg-black/60 border border-zinc-700 rounded px-3 py-1.5 focus:outline-none focus:border-red-600 transition"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {/* Year Range Dropdown */}
          <select
            value={`${filters.yearGte || ''}-${filters.yearLte || ''}`}
            onChange={(e) => {
              const [gte, lte] = e.target.value.split('-');
              onFilterChange('yearRange', { gte, lte });
            }}
            className="bg-black/60 border border-zinc-700 rounded px-3 py-1.5 focus:outline-none focus:border-red-600 transition"
          >
            {yearRanges.map((y, idx) => (
              <option key={idx} value={`${y.gte}-${y.lte}`}>
                {y.label}
              </option>
            ))}
          </select>

          {/* Country Dropdown */}
          <select
            value={filters.country || ''}
            onChange={(e) => onFilterChange('country', e.target.value)}
            className="bg-black/60 border border-zinc-700 rounded px-3 py-1.5 focus:outline-none focus:border-red-600 transition"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-white underline transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
