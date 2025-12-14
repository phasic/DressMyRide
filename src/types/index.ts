export interface WeatherData {
  temp: number;
  feelsLike: number;
  windSpeed: number;
  pop: number; // probability of precipitation (0-1)
  rain?: {
    '1h': number; // precipitation intensity in mm
  };
}

export interface WeatherForecast {
  hourly: Array<{
    dt: number;
    temp: number;
    feels_like: number;
    wind_speed: number;
    pop: number;
    rain?: {
      '1h': number;
    };
  }>;
}

export interface WeatherHourlyData {
  dt: number; // timestamp in seconds
  temp: number;
  feels_like: number;
  wind_speed: number;
  pop: number; // probability of precipitation (0-1)
  rain?: {
    '1h': number; // precipitation intensity in mm
  };
}

export interface WeatherSummary {
  minTemp: number;
  maxTemp: number;
  minFeelsLike: number;
  maxFeelsLike: number;
  maxWindSpeed: number;
  maxRainProbability: number;
  maxPrecipitationIntensity: number;
  hourly?: WeatherHourlyData[]; // Optional hourly data for charts
}

export type ClothingItem = string | { options: string[][] };

export interface ClothingRecommendation {
  head: ClothingItem[];
  neckFace: ClothingItem[];
  chest: ClothingItem[];
  legs: ClothingItem[];
  hands: ClothingItem[];
  feet: ClothingItem[];
  explanation: string[];
}

export interface RideConfig {
  startTime: Date;
  durationHours: number;
  units: 'metric' | 'imperial';
}

export interface Location {
  lat: number;
  lon: number;
  city?: string;
}

export type Page = 'welcome' | 'home' | 'setup' | 'recommendation' | 'settings' | 'manual' | 'guide' | 'about';

