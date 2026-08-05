import { useState, useEffect } from 'react';
import { fetchSpecies } from '../api/swapi';
import type { Species } from '../types';

const cache = new Map<string, Species>();

export function useSpecies(url: string | undefined): Species | null {
  const [species, setSpecies] = useState<Species | null>(() => {
    if (!url) return null;
    return cache.get(url) ?? null;
  });

  useEffect(() => {
    if (!url) return;
    if (cache.has(url)) {
      setSpecies(cache.get(url)!);
      return;
    }
    let cancelled = false;
    fetchSpecies(url)
      .then(data => {
        if (!cancelled) {
          cache.set(url, data);
          setSpecies(data);
        }
      })
      .catch(() => {
        // Species fetch failure is non-critical
      });
    return () => { cancelled = true; };
  }, [url]);

  return species;
}
