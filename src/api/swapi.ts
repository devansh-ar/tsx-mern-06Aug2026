import axios from 'axios';
import type { Character, Homeworld, Species, Film, SwapiResponse } from '../types';

const BASE_URL = 'https://swapi.info/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// swapi.info returns plain arrays, not paginated wrappers.
// This helper normalises to the SwapiResponse shape.
function toResponse<T>(data: T[] | SwapiResponse<T>): SwapiResponse<T> {
  if (Array.isArray(data)) {
    return { count: data.length, next: null, previous: null, results: data };
  }
  return data;
}

function normaliseUrl(url: string): string {
  return url.replace('https://swapi.dev/api', BASE_URL);
}

export const fetchAllCharacters = async (): Promise<Character[]> => {
  const response = await api.get<Character[] | SwapiResponse<Character>>('/people/');
  return toResponse(response.data).results;
};

// Kept for compatibility; returns a paginated slice from the full list
export const fetchCharacters = async (page: number = 1): Promise<SwapiResponse<Character>> => {
  const all = await fetchAllCharacters();
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  return {
    count: all.length,
    next: start + pageSize < all.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results: all.slice(start, start + pageSize),
  };
};

export const fetchCharactersBySearch = async (search: string): Promise<SwapiResponse<Character>> => {
  const all = await fetchAllCharacters();
  const q = search.toLowerCase();
  const results = all.filter(c => c.name.toLowerCase().includes(q));
  return { count: results.length, next: null, previous: null, results };
};

export const fetchHomeworld = async (url: string): Promise<Homeworld> => {
  const response = await axios.get<Homeworld>(normaliseUrl(url), { timeout: 15000 });
  return response.data;
};

export const fetchSpecies = async (url: string): Promise<Species> => {
  const response = await axios.get<Species>(normaliseUrl(url), { timeout: 15000 });
  return response.data;
};

export const fetchFilm = async (url: string): Promise<Film> => {
  const response = await axios.get<Film>(normaliseUrl(url), { timeout: 15000 });
  return response.data;
};

export const fetchAllFilms = async (): Promise<SwapiResponse<Film>> => {
  const response = await api.get<Film[] | SwapiResponse<Film>>('/films/');
  return toResponse(response.data);
};

export const fetchAllSpecies = async (): Promise<SwapiResponse<Species>> => {
  const response = await api.get<Species[] | SwapiResponse<Species>>('/species/');
  return toResponse(response.data);
};

export const fetchAllPlanets = async (): Promise<{ count: number; results: Homeworld[] }> => {
  const response = await api.get<Homeworld[] | { count: number; next: string | null; previous: string | null; results: Homeworld[] }>('/planets/');
  return toResponse(response.data);
};
