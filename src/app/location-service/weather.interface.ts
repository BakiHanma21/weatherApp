export interface CurrentWeather {
  temperature: number;
  temperature_unit: string;
  condition: string;
  humidity: number;
  wind_speed: number;
}

export interface ForecastWeather {
  date: string;
  max_temp: number;
  min_temp: number;
  condition: string;
  wind_speed: number;
  temperature_unit: string;
}

export interface WeatherResponse {
  current: CurrentWeather;
  forecast: ForecastWeather[];
}
