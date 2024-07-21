import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  baseUrl = 'http://localhost:8000/routes.php?request=';
  currentWeather= 'http://localhost/weatherapi/current-weather';
  currentWeatherByCoordinates = 'http://localhost/weatherapi/coordinates';

  constructor(private http: HttpClient) {}

  getCurrentWeather(location: any): Observable<any> {
    return this.http.post(this.baseUrl+"current-weather/"+location, "");
  }

  getCurrentWeatherByCoordinates(lat: any, lon: any): Observable<any> {
    return this.http.post(this.baseUrl+"current-weather/"+lat+"/"+lon, "");
  }

  get5DayForecast(location: string): Observable<any> {
    return this.http.post(`${this.baseUrl}5-day-forecast/${location}`, "");
  }

  get5DayForecastByCoordinates(location:any , data :any) : Observable<any> {
    return this.http.post(`${this.baseUrl}current-weather/${location}`, "");
  }
}
