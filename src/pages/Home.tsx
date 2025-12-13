import { useState } from 'react';
import { Location } from '../types';

interface HomeProps {
  onLocationFound: (location: Location) => void;
  onManualInput: () => void;
}

export function Home({ onLocationFound, onManualInput }: HomeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationFound({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        setError('Location permission denied. Please use manual input.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="page home">
      <h1>DressMyRide</h1>
      <p className="subtitle">Get cycling clothing recommendations based on weather</p>
      
      <div className="actions">
        <button
          className="btn btn-primary"
          onClick={handleUseLocation}
          disabled={loading}
        >
          {loading ? 'Getting location...' : 'Use my location'}
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={onManualInput}
          disabled={loading}
        >
          Enter city manually
        </button>
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

