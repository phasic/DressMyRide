import { useState, useEffect } from 'react';
import { RideConfig } from '../types';
import { storage } from '../utils/storage';

interface RideSetupProps {
  onContinue: (config: RideConfig) => void;
  onBack: () => void;
}

export function RideSetup({ onContinue, onBack }: RideSetupProps) {
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, 16);
  });
  const [durationHours, setDurationHours] = useState(2);
  const [units, setUnits] = useState<'metric' | 'imperial'>(() => storage.getUnits());

  useEffect(() => {
    storage.setUnits(units);
  }, [units]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startTime);
    onContinue({
      startTime: start,
      durationHours,
      units,
    });
  };

  return (
    <div className="page setup">
      <h2>Ride Setup</h2>
      
      <form onSubmit={handleSubmit}>
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

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="btn btn-primary">
            Get Recommendation
          </button>
        </div>
      </form>
    </div>
  );
}

