// Map species names to card background colors
const SPECIES_COLORS: Record<string, string> = {
  human: '#1a3a5c',
  droid: '#2d2d2d',
  wookiee: '#4a3000',
  rodian: '#0a3d1f',
  hutt: '#4a3500',
  trandoshan: '#1a3d1a',
  'mon calamari': '#0a2a4a',
  ewok: '#3d2a00',
  sullustan: '#1a1a3d',
  neimodian: '#2d1a00',
  gungan: '#003d3d',
  toydarian: '#2d0a3d',
  dug: '#3d1a00',
  "twi'lek": '#2d003d',
  aleena: '#003d1a',
  vulptereen: '#1a0a3d',
  xexto: '#003d2d',
  toong: '#3d2d00',
  cerean: '#001a3d',
  nautolan: '#003d1a',
  zabrak: '#3d0a00',
  tholothian: '#001a2d',
  iktotchi: '#3d1a1a',
  quermian: '#002d3d',
  'kel dor': '#3d0000',
  chagrian: '#002d2d',
  geonosian: '#2d2d00',
  mirialan: '#003d00',
  clawdite: '#2d3d00',
  besalisk: '#3d3d00',
  kaminoan: '#003d3d',
  skakoan: '#1a3d3d',
  muun: '#3d003d',
  togruta: '#3d0a0a',
  kaleesh: '#3d1500',
  "pau'an": '#003d3d',
};

export const DEFAULT_SPECIES_COLOR = '#1a1a2e';

export function getSpeciesColor(speciesName: string | null): string {
  if (!speciesName) return DEFAULT_SPECIES_COLOR;
  const key = speciesName.toLowerCase();
  return SPECIES_COLORS[key] ?? DEFAULT_SPECIES_COLOR;
}

export function getCharacterImageUrl(characterUrl: string, width = 300, height = 200): string {
  const match = characterUrl.match(/\/people\/(\d+)\//);
  const id = match ? parseInt(match[1]) : Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/sw${id}/${width}/${height}`;
}
