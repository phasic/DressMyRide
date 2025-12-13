import { useState } from 'react';
import { RideConfig, Location } from '../types';
import { storage } from '../utils/storage';
import { geocodeCity } from '../services/weatherService';
import { MapPicker } from '../components/MapPicker';

interface RideSetupProps {
  onContinue: (location: Location, config: RideConfig) => void;
}

export function RideSetup({ onContinue }: RideSetupProps) {
  const [locationType, setLocationType] = useState<'current' | 'city'>('current');
  const [cityInputType, setCityInputType] = useState<'search' | 'map'>('search');
  const [city, setCity] = useState('');
  const [mapLocation, setMapLocation] = useState<Location | null>(null);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, 16);
  });
  const [durationHours, setDurationHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let location: Location;

      if (locationType === 'current') {
        // Get current location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // Use precise coordinates (rounding happens in fetchWeatherForecast for cache key)
        location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
      } else {
        // City input - either search or map
        if (cityInputType === 'map') {
          if (!mapLocation) {
            throw new Error('Please select a location on the map');
          }
          location = mapLocation;
        } else {
          // Search by name
          if (!city.trim()) {
            throw new Error('Please enter a city name');
          }
          location = await geocodeCity(city);
        }
      }

      const start = new Date(startTime);
      const config: RideConfig = {
        startTime: start,
        durationHours,
        units: storage.getUnits(), // Use units from settings
      };

      onContinue(location, config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      setLoading(false);
    }
  };

  return (
    <div className="page setup">
      <h2>Ride Setup</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Location</label>
          <div className="location-selector">
            <button
              type="button"
              className={`location-option ${locationType === 'current' ? 'active' : ''}`}
              onClick={() => setLocationType('current')}
            >
              <div className="location-option-icon">📍</div>
              <div className="location-option-content">
                <div className="location-option-title">Use current location</div>
                <div className="location-option-subtitle">GPS coordinates</div>
              </div>
              <div className="location-option-check">
                {locationType === 'current' && '✓'}
              </div>
            </button>
            <button
              type="button"
              className={`location-option ${locationType === 'city' ? 'active' : ''}`}
              onClick={() => setLocationType('city')}
            >
              <div className="location-option-icon">🏙️</div>
              <div className="location-option-content">
                <div className="location-option-title">Enter city</div>
                <div className="location-option-subtitle">Search by name</div>
              </div>
              <div className="location-option-check">
                {locationType === 'city' && '✓'}
              </div>
            </button>
          </div>
          {locationType === 'city' && (
            <div className="city-input-options" style={{ marginTop: '12px' }}>
              <div className="city-input-tabs">
                <button
                  type="button"
                  className={`city-input-tab ${cityInputType === 'search' ? 'active' : ''}`}
                  onClick={() => setCityInputType('search')}
                >
                  Search by name
                </button>
                <button
                  type="button"
                  className={`city-input-tab ${cityInputType === 'map' ? 'active' : ''}`}
                  onClick={() => setCityInputType('map')}
                >
                  Select on map
                </button>
              </div>
              {cityInputType === 'search' ? (
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., London, New York"
                  required={locationType === 'city' && cityInputType === 'search'}
                  style={{ marginTop: '12px' }}
                />
              ) : (
                <div style={{ marginTop: '12px' }}>
                  <MapPicker
                    onLocationSelect={(location) => {
                      setMapLocation(location);
                      setError(null); // Clear any previous errors when location is selected
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start time</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (hours)</label>
          <input
            id="duration"
            type="number"
            min="0.5"
            max="24"
            step="0.5"
            value={durationHours}
            onChange={(e) => setDurationHours(parseFloat(e.target.value))}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendation'}
          </button>
        </div>
      </form>
    </div>
  );
}

