import { useState } from 'react';
import { Location } from '../types';
import { geocodeCity } from '../services/weatherService';

interface ManualLocationProps {
  onLocationFound: (location: Location) => void;
  onBack: () => void;
}

export function ManualLocation({ onLocationFound, onBack }: ManualLocationProps) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const location = await geocodeCity(city);
      onLocationFound(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find city');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page manual-location">
      <h2>Enter City</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="city">City name</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., London, New York"
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
}

