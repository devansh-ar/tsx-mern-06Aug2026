import { useState, useEffect, useCallback } from 'react';
import { fetchCharacters, fetchCharactersBySearch } from '../api/swapi';
import type { Character } from '../types';

interface UseCharactersResult {
  characters: Character[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useCharacters(search: string = ''): UseCharactersResult {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger(t => t + 1), []);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const data = search.trim()
          ? await fetchCharactersBySearch(search)
          : await fetchCharacters(currentPage);

        if (!cancelled) {
          setCharacters(data.results);
          setTotalPages(Math.ceil(data.count / 10));
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to fetch characters. The API may be unavailable. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [currentPage, search, trigger]);

  return { characters, loading, error, totalPages, currentPage, setPage: setCurrentPage, refetch };
}
