import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../../location-service/weather.service';
import { WeatherUtilsService } from '../../location-service/weather-utils.service';

@Component({
  selector: 'app-weather-display',
  templateUrl: './weather-display.component.html',
  styleUrls: ['./weather-display.component.scss']
})
export class WeatherDisplayComponent implements OnChanges {
  @Input() location: string = '';
  @Input() unit: string = 'C';
  currentWeather: any = null;
  forecastWeather: any[] = [];
  defaultWeather: any = null;
  errorMessage: string = '';
  displayedLocation: string = 'Olongapo';
  defaultLocation: string = 'Olongapo';
  locationPromptInteracted: boolean = false;
  userLocation: string | null = null;

  validCities: string[] = ['Olongapo', 'Subic', 'Chicago', 'Manila', 'Pasay', 'Davao', 'Pampanga', 'Japan', 'Tokyo', 'London', 'China', 'Korea', 'USA'];
  weatherService = inject(WeatherService);
  constructor(
    private weatherUtils: WeatherUtilsService
  ) {}

  ngOnInit() {
    // this.fetchDefaultWeatherData();
    // this.promptLocationPermission();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] && this.location) {
      this.currentWeather = null;
      this.forecastWeather = [];
    }
  }

  fetchWeatherData() {
    this.errorMessage = '';

    if (!this.isValidCityName(this.location)) {
      this.errorMessage = 'That is not a city name. Please enter a valid city name.';
      this.currentWeather = null;
      this.forecastWeather = [];
      this.displayedLocation = this.defaultLocation;
    } else {
      const encodedLocation = encodeURIComponent(this.location);
      console.log(`Fetching data for location: ${encodedLocation}, unit: ${this.unit}`);

      this.weatherService.getCurrentWeather(encodedLocation).subscribe(
        (data: any) => {
          console.log('Current weather data received:', data);
          this.currentWeather = {
            ...data,
            main: {
              ...data.main,
              temp: this.weatherUtils.convertTemperature(data.main.temp, this.unit)
            }
          };
          this.displayedLocation = this.location; // Update displayed location if valid

          // Fetch forecast weather data only after current weather is successfully fetched
          this.weatherService.get5DayForecast(encodedLocation).subscribe(
            (forecastData: any) => {
              console.log('Full forecast weather response:', forecastData);
              this.forecastWeather = forecastData?.list?.filter((entry: any) => entry.dt_txt.includes('12:00:00')).map((entry: any) => ({
                ...entry,
                main: {
                  ...entry.main,
                  temp: this.weatherUtils.convertTemperature(entry.main.temp, this.unit)
                }
              })) || [];
            },
            (error) => {
              this.errorMessage = `Error: ${error.message}`;
              console.error('There was an error fetching forecast weather!', error);
            }
          );
        },
        (error) => {
          this.errorMessage = `Error: ${error.message}`;
          console.error('There was an error fetching current weather!', error);
        }
      );
    }
  }

  fetchDefaultWeatherData() {
    const encodedDefaultLocation = encodeURIComponent(this.defaultLocation);
    this.weatherService.getCurrentWeather(encodedDefaultLocation).subscribe(
      (data: any) => {
        console.log('Default weather data received:', data);
        this.defaultWeather = {
          ...data,
          main: {
            ...data.main,
            temp: this.weatherUtils.convertTemperature(data.main.temp, this.unit)
          }
        };
        this.displayedLocation = this.defaultLocation; // Ensure default location is displayed initially
      },
      (error) => {
        console.error('There was an error fetching default weather!', error);
      }
    );
  }

  promptLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationPromptInteracted = true;
          this.userLocation = 'userLocation'; // Indicates location permission granted
          this.fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          this.locationPromptInteracted = true;
          this.userLocation = error.code === error.PERMISSION_DENIED ? 'denied' : null;
          if (error.code === error.PERMISSION_DENIED) {
            console.log('Location access denied by user.');
          } else {
            console.error('Error getting location', error);
            this.errorMessage = 'Unable to retrieve your location.';
          }
          // Keep the default location displayed if location access is denied or blocked
          if (!this.currentWeather) {
            this.displayedLocation = this.defaultLocation;
          }
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      this.displayedLocation = this.defaultLocation;
      this.fetchDefaultWeatherData();
    }
  }

  fetchWeatherByCoordinates(lat: number, lon: number) {
    let latString = lat.toString()
    let lonString = lon.toString()
    this.weatherService.getCurrentWeatherByCoordinates(latString, lonString).subscribe(
      (data: any) => {
        console.log('Current weather data by coordinates received:', data);
        this.currentWeather = {
          ...data,
          main: {
            ...data.main,
            temp: this.weatherUtils.convertTemperature(data.main.temp, this.unit)
          }
        };
        this.displayedLocation = data.name !== this.defaultLocation ? data.name : this.defaultLocation;
      },
      (error) => {
        this.errorMessage = `Error: ${error.message}`;
        console.error('There was an error fetching current weather by coordinates!', error);
      }
    );

    this.weatherService.get5DayForecastByCoordinates(latString, lonString).subscribe(
      (data: any) => {
        console.log('Full forecast weather response by coordinates:', data);
        this.forecastWeather = data?.list?.filter((entry: any) => entry.dt_txt.includes('12:00:00')).map((entry: any) => ({
          ...entry,
          main: {
            ...entry.main,
            temp: this.weatherUtils.convertTemperature(entry.main.temp, this.unit)
          }
        })) || [];
      },
      (error) => {
        this.errorMessage = `Error: ${error.message}`;
        console.error('There was an error fetching forecast weather by coordinates!', error);
      }
    );
  }

  isValidCityName(name: string): boolean {
    return this.validCities.includes(name);
  }

  @Output() locationChange = new EventEmitter<string>();

  getWeather() {
    console.log('Emitting location:', this.location);
    this.locationChange.emit(this.location);
  }
}
