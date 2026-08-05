import { useEffect, useState } from 'react';
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

  useEffect(() => {
    fetchAllFilms().then(d => setFilms(d.results)).catch(() => {});
    fetchAllSpecies().then(d => setSpecies(d.results)).catch(() => {});
    fetchAllPlanets().then(d => setPlanets(d.results)).catch(() => {});
  }, []);

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasFilters = filters.search || filters.homeworld || filters.film || filters.species;

  return (
    <div className="search-filter">
      <div className="search-row">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search characters..."
            value={filters.search}
            onChange={e => update('search', e.target.value)}
            aria-label="Search characters"
          />
          {filters.search && (
            <button className="clear-search" onClick={() => update('search', '')} aria-label="Clear search">
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
          {films.sort((a, b) => a.episode_id - b.episode_id).map(f => (
            <option key={f.url} value={f.url}>Episode {f.episode_id}: {f.title}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            className="clear-filters-btn"
            onClick={() => onChange({ search: '', homeworld: '', film: '', species: '' })}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
