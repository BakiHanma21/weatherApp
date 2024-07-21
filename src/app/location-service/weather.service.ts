import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  baseUrl = 'http://localhost/weatherapi/api/5-day-forecast/';

  constructor(private http: HttpClient) {}

  getCurrentWeather(location: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${location}`, "");
  }

  getCurrentWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${location}`, "");
  }

  get5DayForecast(location: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${location}`, "");
  }

  get5DayForecastByCoordinates(lat: number, lon: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${location}`, "");
  }
}