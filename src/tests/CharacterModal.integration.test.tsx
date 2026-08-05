import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterModal } from '../components/CharacterModal';
import type { Character, Homeworld } from '../types';

// Mock fetchHomeworld
vi.mock('../api/swapi', () => ({
  fetchHomeworld: vi.fn(),
}));

import { fetchHomeworld } from '../api/swapi';

const mockCharacter: Character = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: [
    'https://swapi.dev/api/films/1/',
    'https://swapi.dev/api/films/2/',
    'https://swapi.dev/api/films/3/',
  ],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/',
};

const mockHomeworld: Homeworld = {
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10'],
  films: [],
  created: '2014-12-09T13:50:49.641000Z',
  edited: '2014-12-21T20:48:04.175778Z',
  url: 'https://swapi.dev/api/planets/1/',
};

describe('CharacterModal integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchHomeworld as ReturnType<typeof vi.fn>).mockResolvedValue(mockHomeworld);
  });

  it('opens with correct character name', () => {
    const onClose = vi.fn();
    render(<CharacterModal character={mockCharacter} onClose={onClose} />);
    expect(screen.getByTestId('modal-character-name')).toHaveTextContent('Luke Skywalker');
  });

  it('displays height in meters', () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal-height')).toHaveTextContent('1.72m');
  });

  it('displays mass in kg', () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal-mass')).toHaveTextContent('77 kg');
  });

  it('displays birth year', () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal-birth-year')).toHaveTextContent('19BBY');
  });

  it('displays number of films', () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal-films')).toHaveTextContent('3');
  });

  it('displays created date in dd-MM-yyyy format', () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);
    expect(screen.getByTestId('modal-created')).toHaveTextContent('09-12-2014');
  });

  it('fetches and displays homeworld information', async () => {
    render(<CharacterModal character={mockCharacter} onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('modal-homeworld')).toBeInTheDocument();
    });

    const homeworld = screen.getByTestId('modal-homeworld');
    expect(homeworld).toHaveTextContent('Tatooine');
    expect(homeworld).toHaveTextContent('desert');
    expect(homeworld).toHaveTextContent('arid');
    expect(homeworld).toHaveTextContent('10');
  });

  it('renders nothing when character is null', () => {
    const { container } = render(<CharacterModal character={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<CharacterModal character={mockCharacter} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<CharacterModal character={mockCharacter} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
