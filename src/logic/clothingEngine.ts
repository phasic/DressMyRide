import { WeatherSummary, ClothingRecommendation, RideConfig } from '../types';

export function recommendClothing(
  weather: WeatherSummary,
  config: RideConfig
): ClothingRecommendation {
  const { minFeelsLike, maxWindSpeed, maxRainProbability, minTemp } = weather;
  const isMetric = config.units === 'metric';
  
  // Convert to metric if needed for calculations
  const temp = isMetric ? minFeelsLike : (minFeelsLike - 32) * 5/9;
  const wind = isMetric ? maxWindSpeed : maxWindSpeed * 1.60934; // mph to km/h
  const startTemp = isMetric ? minTemp : (minTemp - 32) * 5/9;

  const mainKit: string[] = [];
  const accessories: string[] = [];
  const explanation: string[] = [];

  // Base logic based on minimum "feels like" temperature
  if (temp > 22) {
    mainKit.push('Short bib');
    mainKit.push('Summer jersey');
    explanation.push('Warm conditions - lightweight kit');
  } else if (temp >= 18) {
    mainKit.push('Short bib');
    mainKit.push('Jersey');
    accessories.push('Optional arm warmers');
    explanation.push('Moderate warmth - arm warmers optional');
  } else if (temp >= 14) {
    mainKit.push('Short bib');
    mainKit.push('Jersey');
    accessories.push('Arm warmers');
    explanation.push('Cool conditions - arm warmers recommended');
  } else if (temp >= 10) {
    mainKit.push('Short bib');
    mainKit.push('Long sleeve jersey OR arm warmers');
    accessories.push('Light vest');
    explanation.push('Cool conditions - long sleeves or arm warmers with vest');
  } else if (temp >= 6) {
    mainKit.push('Short bib');
    mainKit.push('Thermal jersey');
    accessories.push('Jacket');
    explanation.push('Cold conditions - thermal layers and jacket');
  } else {
    mainKit.push('Winter jacket');
    mainKit.push('Full protection');
    explanation.push('Very cold conditions - full winter protection');
  }

  // Wind modifier
  if (wind > 20) {
    accessories.push('Wind vest');
    explanation.push('High wind conditions - wind protection needed');
  }

  // Rain modifiers
  const rainProbPercent = maxRainProbability * 100;
  if (rainProbPercent > 70 && temp < 15) {
    accessories.push('Waterproof jacket');
    explanation.push('Heavy rain expected - waterproof protection essential');
  } else if (rainProbPercent > 40) {
    accessories.push('Rain jacket');
    explanation.push('Rain likely - rain protection recommended');
  }

  // Removable layers suggestion
  if (startTemp < 10) {
    explanation.push('Start temperature is cold - consider removable layers for warming up');
  }

  return {
    mainKit,
    accessories,
    explanation,
  };
}

