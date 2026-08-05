import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CharacterCard } from './components/CharacterCard';
import { CharacterModal } from './components/CharacterModal';
import { Pagination } from './components/Pagination';
import { Loader } from './components/Loader';
import { ErrorState } from './components/ErrorState';
import { SearchFilter } from './components/SearchFilter';
import { useCharacters } from './hooks/useCharacters';
import type { Character, FilterState } from './types';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: '', homeworld: '', film: '', species: '' });

  const { characters, loading, error, totalPages, currentPage, setPage, refetch } = useCharacters(filters.search);

  const filtered = useMemo(() => {
    return characters.filter(c => {
      if (filters.homeworld && c.homeworld !== filters.homeworld) return false;
      if (filters.film && !c.films.includes(filters.film)) return false;
      if (filters.species && !c.species.includes(filters.species)) return false;
      return true;
    });
  }, [characters, filters.homeworld, filters.film, filters.species]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const isFiltering = filters.homeworld || filters.film || filters.species || filters.search;

  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <div className="hero">
          <h1 className="hero-title">Star Wars Universe</h1>
          <p className="hero-subtitle">A long time ago in a galaxy far, far away</p>
        </div>

        <SearchFilter filters={filters} onChange={handleFilterChange} />

        {loading && <Loader />}
        {error && !loading && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && (
          <>
            <div className="results-info">
              <span>{filtered.length} character{filtered.length !== 1 ? 's' : ''} found</span>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔭</span>
                <p>No characters found. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="characters-grid">
                {filtered.map(character => (
                  <CharacterCard
                    key={character.url}
                    character={character}
                    onClick={setSelectedCharacter}
                  />
                ))}
              </div>
            )}

            {!isFiltering && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </main>

      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />

      <footer className="footer">
        <p>
          Data from{' '}
          <a href="https://swapi.dev" target="_blank" rel="noopener noreferrer">SWAPI</a>
          {' · '}
          Images from{' '}
          <a href="https://picsum.photos" target="_blank" rel="noopener noreferrer">Picsum</a>
        </p>
      </footer>
    </div>
  );
}
