import { useSpecies } from '../hooks/useSpeciesCache';
import { getSpeciesColor, getCharacterImageUrl } from '../utils/speciesColors';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  const speciesUrl = character.species[0];
  const species = useSpecies(speciesUrl);
  const bgColor = getSpeciesColor(species?.name ?? null);
  const imageUrl = getCharacterImageUrl(character.url);

  return (
    <article
      className="character-card"
      style={{ '--card-color': bgColor } as React.CSSProperties}
      onClick={() => onClick(character)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${character.name}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(character); }}
      data-testid="character-card"
    >
      <div className="card-image-wrapper">
        <img
          src={imageUrl}
          alt={character.name}
          className="card-image"
          loading="lazy"
          onError={e => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = `https://picsum.photos/seed/sw-err-${character.name.length}/300/200`;
          }}
        />
        <div className="card-overlay">
          <span className="card-overlay-text">View Details</span>
        </div>
      </div>
      <div className="card-body">
        <h3 className="card-name">{character.name}</h3>
        {species && (
          <span className="card-species">{species.name}</span>
        )}
        {!species && character.species.length === 0 && (
          <span className="card-species">Human</span>
        )}
        <div className="card-meta">
          <span>{character.gender !== 'n/a' ? character.gender : '—'}</span>
          <span>{character.birth_year}</span>
        </div>
      </div>
    </article>
  );
}
