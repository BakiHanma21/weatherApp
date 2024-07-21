import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherUtilsService {

  constructor() { }

  convertTemperature(temp: number, unit: string): number {
    if (unit === 'C') {
      return Math.round((temp - 273.15)); // Convert Kelvin to Celsius and round to whole number
    } else if (unit === 'F') {
      return Math.round((temp - 273.15) * 9/5 + 32); // Convert Kelvin to Fahrenheit and round to whole number
    }
    return temp; // If the unit is Kelvin, return the temperature as it is
  }
}