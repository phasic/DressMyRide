import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [apiKey, setApiKey] = useState(() => storage.getApiKey() || '');
  const [units, setUnits] = useState<'metric' | 'imperial'>(() => storage.getUnits());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    storage.setUnits(units);
  }, [units]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.setApiKey(apiKey);
    storage.setUnits(units);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page settings">
      <h2>Settings</h2>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="apiKey">OpenWeather API Key</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            required
          />
          <small>
            Get your API key at{' '}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              openweathermap.org
            </a>
            . <strong>Note:</strong> This app requires One Call API 3.0, which needs a subscription (free tier available). Subscribe at{' '}
            <a
              href="https://openweathermap.org/api/one-call-3"
              target="_blank"
              rel="noopener noreferrer"
            >
              openweathermap.org/api/one-call-3
            </a>
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="units">Units</label>
          <select
            id="units"
            value={units}
            onChange={(e) => setUnits(e.target.value as 'metric' | 'imperial')}
          >
            <option value="metric">°C / km/h</option>
            <option value="imperial">°F / mph</option>
          </select>
        </div>

        {saved && <div className="success">Settings saved!</div>}

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

