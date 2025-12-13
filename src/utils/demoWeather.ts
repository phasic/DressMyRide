import { WeatherSummary } from '../types';

/**
 * Generates random weather conditions for demo mode
 */
export function generateDemoWeather(): WeatherSummary {
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

  return {
    minTemp: Math.round(minTemp * 10) / 10,
    maxTemp: Math.round(maxTemp * 10) / 10,
    minFeelsLike: Math.round(minFeelsLike * 10) / 10,
    maxFeelsLike: Math.round(maxFeelsLike * 10) / 10,
    maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
    maxRainProbability,
    maxPrecipitationIntensity: Math.round(maxPrecipitationIntensity * 10) / 10,
  };
}

