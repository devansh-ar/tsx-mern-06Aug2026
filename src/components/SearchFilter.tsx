import { useEffect, useState, useRef } from 'react';
import { fetchAllFilms, fetchAllSpecies, fetchAllPlanets } from '../api/swapi';
import type { Film, Species, Homeworld, FilterState } from '../types';

interface SearchFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function SearchFilter({ filters, onChange }: SearchFilterProps) {
  const [films, setFilms] = useState<Film[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [planets, setPlanets] = useState<Homeworld[]>([]);

  // Local input value for immediate UI feedback; debounced before propagating
  const [inputValue, setInputValue] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local input in sync when parent clears search (e.g. "Clear All")
  useEffect(() => {
    setInputValue(filters.search);
  }, [filters.search]);

  useEffect(() => {
    fetchAllFilms().then(d => setFilms(d.results)).catch(() => {});
    fetchAllSpecies().then(d => setSpecies(d.results)).catch(() => {});
    fetchAllPlanets().then(d => setPlanets(d.results)).catch(() => {});
  }, []);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange({ ...filters, search: value });
    }, 400);
  };

  const handleSearchClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setInputValue('');
    onChange({ ...filters, search: '' });
  };

  const update = (key: Exclude<keyof FilterState, 'search'>, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasFilters = inputValue || filters.homeworld || filters.film || filters.species;

  return (
    <div className="search-filter">
      <div className="search-row">
        <div className="search-input-wrapper">
          <svg className="search-icon-svg" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search characters..."
            value={inputValue}
            onChange={e => handleSearchChange(e.target.value)}
            aria-label="Search characters"
          />
          {inputValue && (
            <button className="clear-search" onClick={handleSearchClear} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="filter-row">
        <select
          className="filter-select"
          value={filters.species}
          onChange={e => update('species', e.target.value)}
          aria-label="Filter by species"
        >
          <option value="">All Species</option>
          {species.map(s => (
            <option key={s.url} value={s.url}>{s.name}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.homeworld}
          onChange={e => update('homeworld', e.target.value)}
          aria-label="Filter by homeworld"
        >
          <option value="">All Homeworlds</option>
          {planets.map(p => (
            <option key={p.url} value={p.url}>{p.name}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.film}
          onChange={e => update('film', e.target.value)}
          aria-label="Filter by film"
        >
          <option value="">All Films</option>
          {[...films].sort((a, b) => a.episode_id - b.episode_id).map(f => (
            <option key={f.url} value={f.url}>Episode {f.episode_id}: {f.title}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            className="clear-filters-btn"
            onClick={() => {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              setInputValue('');
              onChange({ search: '', homeworld: '', film: '', species: '' });
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
