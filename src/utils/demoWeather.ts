import { WeatherSummary } from '../types';

/**
 * Generates random weather conditions for demo mode
 */
export function generateDemoWeather(durationHours: number = 2): WeatherSummary {
  // Generate random temperature between -10°C and 35°C
  const baseTemp = Math.random() * 45 - 10;
  
  // Temperature variation (2-5 degrees)
  const tempVariation = 2 + Math.random() * 3;
  const minTemp = baseTemp;
  const maxTemp = baseTemp + tempVariation;
  
  // Feels like is usually 1-5 degrees colder, especially with wind
  const feelsLikeOffset = -1 - Math.random() * 4;
  const minFeelsLike = baseTemp + feelsLikeOffset;
  const maxFeelsLike = maxTemp + feelsLikeOffset;
  
  // Wind speed between 5-40 km/h
  const maxWindSpeed = 5 + Math.random() * 35;
  
  // Rain probability between 0-100%
  const maxRainProbability = Math.random();
  
  // Precipitation intensity (0-5mm/h) if raining
  const maxPrecipitationIntensity = maxRainProbability > 0.3 
    ? Math.random() * 5 
    : 0;

  // Generate hourly data for the chart
  const now = Math.floor(Date.now() / 1000);
  const hourly = [];
  const numHours = Math.ceil(durationHours);
  
  for (let i = 0; i <= numHours; i++) {
    const hourTime = now + i * 3600;
    // Vary temperature slightly over time
    const tempProgress = i / numHours;
    const temp = minTemp + (maxTemp - minTemp) * tempProgress + (Math.random() - 0.5) * 2;
    const feelsLike = temp + feelsLikeOffset + (Math.random() - 0.5) * 2;
    const windSpeed = 5 + Math.random() * (maxWindSpeed - 5);
    const pop = Math.random() * maxRainProbability;
    const rain = pop > 0.3 ? { '1h': Math.random() * maxPrecipitationIntensity } : undefined;
    
    hourly.push({
      dt: hourTime,
      temp: Math.round(temp * 10) / 10,
      feels_like: Math.round(feelsLike * 10) / 10,
      wind_speed: Math.round(windSpeed * 10) / 10,
      pop,
      rain,
    });
  }

  return {
    minTemp: Math.round(minTemp * 10) / 10,
    maxTemp: Math.round(maxTemp * 10) / 10,
    minFeelsLike: Math.round(minFeelsLike * 10) / 10,
    maxFeelsLike: Math.round(maxFeelsLike * 10) / 10,
    maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
    maxRainProbability,
    maxPrecipitationIntensity: Math.round(maxPrecipitationIntensity * 10) / 10,
    hourly,
  };
}

