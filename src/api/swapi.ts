import axios from 'axios';
import type { Character, Homeworld, Species, Film, SwapiResponse } from '../types';

const BASE_URL = 'https://swapi.dev/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchCharacters = async (page: number = 1): Promise<SwapiResponse<Character>> => {
  const response = await api.get<SwapiResponse<Character>>(`/people/?page=${page}`);
  return response.data;
};

export const fetchCharactersBySearch = async (search: string): Promise<SwapiResponse<Character>> => {
  const response = await api.get<SwapiResponse<Character>>(`/people/?search=${encodeURIComponent(search)}`);
  return response.data;
};

export const fetchHomeworld = async (url: string): Promise<Homeworld> => {
  const response = await axios.get<Homeworld>(url, { timeout: 10000 });
  return response.data;
};

export const fetchSpecies = async (url: string): Promise<Species> => {
  const response = await axios.get<Species>(url, { timeout: 10000 });
  return response.data;
};

export const fetchFilm = async (url: string): Promise<Film> => {
  const response = await axios.get<Film>(url, { timeout: 10000 });
  return response.data;
};

export const fetchAllFilms = async (): Promise<SwapiResponse<Film>> => {
  const response = await api.get<SwapiResponse<Film>>('/films/');
  return response.data;
};

export const fetchAllSpecies = async (): Promise<SwapiResponse<Species>> => {
  const response = await api.get<SwapiResponse<Species>>('/species/');
  return response.data;
};

export const fetchAllPlanets = async (): Promise<{ count: number; results: Homeworld[] }> => {
  const response = await api.get<{ count: number; next: string | null; previous: string | null; results: Homeworld[] }>('/planets/');
  return response.data;
};
