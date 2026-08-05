import { useEffect, useState, useCallback } from 'react';
import { fetchHomeworld } from '../api/swapi';
import { formatDate, heightToMeters, massToKg } from '../utils/dateFormat';
import type { Character, Homeworld } from '../types';

interface CharacterModalProps {
  character: Character | null;
  onClose: () => void;
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
  const [homeworld, setHomeworld] = useState<Homeworld | null>(null);
  const [hwLoading, setHwLoading] = useState(false);
  const [hwError, setHwError] = useState(false);

  useEffect(() => {
    if (!character) return;
    setHomeworld(null);
    setHwError(false);
    setHwLoading(true);

    fetchHomeworld(character.homeworld)
      .then(data => {
        setHomeworld(data);
      })
      .catch(() => setHwError(true))
      .finally(() => setHwLoading(false));
  }, [character]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (character) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [character]);

  if (!character) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid="character-modal"
    >
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <h2 id="modal-title" className="modal-title" data-testid="modal-character-name">
          {character.name}
        </h2>

        <div className="modal-section">
          <h3 className="modal-section-title">Character Info</h3>
          <dl className="modal-details">
            <div className="detail-row">
              <dt>Height</dt>
              <dd data-testid="modal-height">{heightToMeters(character.height)}</dd>
            </div>
            <div className="detail-row">
              <dt>Mass</dt>
              <dd data-testid="modal-mass">{massToKg(character.mass)}</dd>
            </div>
            <div className="detail-row">
              <dt>Birth Year</dt>
              <dd data-testid="modal-birth-year">{character.birth_year}</dd>
            </div>
            <div className="detail-row">
              <dt>Added to API</dt>
              <dd data-testid="modal-created">{formatDate(character.created)}</dd>
            </div>
            <div className="detail-row">
              <dt>Films</dt>
              <dd data-testid="modal-films">{character.films.length}</dd>
            </div>
          </dl>
        </div>

        <div className="modal-section">
          <h3 className="modal-section-title">Homeworld</h3>
          {hwLoading && <p className="modal-loading">Loading homeworld data...</p>}
          {hwError && <p className="modal-error">Could not load homeworld information.</p>}
          {homeworld && (
            <dl className="modal-details" data-testid="modal-homeworld">
              <div className="detail-row">
                <dt>Name</dt>
                <dd>{homeworld.name}</dd>
              </div>
              <div className="detail-row">
                <dt>Terrain</dt>
                <dd>{homeworld.terrain}</dd>
              </div>
              <div className="detail-row">
                <dt>Climate</dt>
                <dd>{homeworld.climate}</dd>
              </div>
              <div className="detail-row">
                <dt>Residents</dt>
                <dd>{homeworld.residents.length}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
