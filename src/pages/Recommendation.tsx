import { ClothingRecommendation, WeatherSummary, RideConfig } from '../types';

interface RecommendationProps {
  recommendation: ClothingRecommendation;
  weather: WeatherSummary;
  config: RideConfig;
  onBack: () => void;
}

export function Recommendation({
  recommendation,
  weather,
  config,
  onBack,
}: RecommendationProps) {
  const isMetric = config.units === 'metric';
  const tempUnit = isMetric ? '°C' : '°F';
  const windUnit = isMetric ? 'km/h' : 'mph';

  const formatTemp = (temp: number) => {
    return Math.round(temp) + tempUnit;
  };

  const formatWind = (wind: number) => {
    return Math.round(wind) + ' ' + windUnit;
  };

  return (
    <div className="page recommendation">
      <h2>What to wear</h2>

      <div className="clothing-section">
        <h3>Main kit</h3>
        <ul>
          {recommendation.mainKit.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {recommendation.accessories.length > 0 && (
        <div className="clothing-section">
          <h3>Accessories</h3>
          <ul>
            {recommendation.accessories.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="weather-summary">
        <h3>Weather summary</h3>
        <div className="weather-grid">
          <div className="weather-item">
            <span className="label">Temperature:</span>
            <span className="value">
              {formatTemp(weather.minTemp)} - {formatTemp(weather.maxTemp)}
            </span>
          </div>
          <div className="weather-item">
            <span className="label">Feels like:</span>
            <span className="value">{formatTemp(weather.minFeelsLike)}</span>
          </div>
          <div className="weather-item">
            <span className="label">Wind speed:</span>
            <span className="value">{formatWind(weather.maxWindSpeed)}</span>
          </div>
          <div className="weather-item">
            <span className="label">Rain probability:</span>
            <span className="value">{Math.round(weather.maxRainProbability * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="explanation-section">
        <h3>Why?</h3>
        <ul>
          {recommendation.explanation.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>

      <button className="btn btn-primary" onClick={onBack}>
        New recommendation
      </button>
    </div>
  );
}

