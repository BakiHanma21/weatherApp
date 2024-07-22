import { Component, inject, Input, OnInit } from '@angular/core';
import { WeatherUtilsService } from '../location-service/weather-utils.service';
import { WeatherService } from '../location-service/weather.service';

@Component({
  selector: 'app-default-weather',
  templateUrl: './default-weather.component.html',
  styleUrls: ['./default-weather.component.scss']
})
export class DefaultWeatherComponent implements OnInit {
  @Input() unit: string = 'C';
  defaultLocation: string = 'Olongapo';
  displayedLocation: string = 'Olongapo';

  ngOnInit(): void {
    this.promptLocationPermission();
    // this.fetchDefaultWeatherData();
  }

  weatherUtils = inject(WeatherUtilsService);
  weatherService = inject(WeatherService);
  defaultWeather: any = null;
  fetchDefault(){
    this.weatherService.getCurrentWeather(this.defaultLocation).subscribe((data: any) => {
      console.log('Default weather data received:', data);
      this.defaultWeather = {
        ...data,
        main: {
          ...data.main,
          temp: this.weatherUtils.convertTemperature(data.main.temp, this.unit)
        }
      };
      this.displayedLocation = this.defaultLocation;
      console.log('Default weather:', this.defaultWeather);
    },
    (error) => {
      console.error('There was an error fetching default weather!', error);
    })
  }
  fetchDefaultWeatherData(lat: any, lon: any) {
    // const encodedDefaultLocation = encodeURIComponent(this.defaultLocation);
    this.weatherService.getCurrentWeatherByCoordinates(lat, lon).subscribe(
      (data: any) => {
        console.log('Default weather data received:', data);
        this.defaultWeather = {
          ...data,
          main: {
            ...data.main,
            temp: this.weatherUtils.convertTemperature(data.main.temp, this.unit)
          }
        };
        this.displayedLocation = this.defaultLocation;
        console.log('Default weather:', this.defaultWeather);
      },
      (error) => {
        console.error('There was an error fetching default weather!', error);
      }
    );
  }

  currentWeather: any = null;
  locationPromptInteracted: boolean = false;
  userLocation: string | null = null;
  errorMessage: string = '';

  promptLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location:', position.coords);
          this.locationPromptInteracted = true;
          this.userLocation = 'userLocation';
          let latitue: string = position.coords.latitude.toString();
          let longitude: string = position.coords.longitude.toString();
          this.fetchDefaultWeatherData(latitue, longitude);
        },
        (error) => {
          this.locationPromptInteracted = true;
          this.userLocation = error.code === error.PERMISSION_DENIED ? 'denied' : null;
          if (error.code === error.PERMISSION_DENIED) {
            this.fetchDefault();
            console.log('Location access denied by user.');
          } else {
            console.error('Error getting location', error);
            this.errorMessage = 'Unable to retrieve your location.';
          }
          if (!this.currentWeather) {
            this.displayedLocation = this.defaultLocation;
          }
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      this.displayedLocation = this.defaultLocation;
    }
  }

  forecastWeather: any = null;

  fetchWeatherByCoordinates(lat: any, lon: any) {
    this.weatherService.getCurrentWeatherByCoordinates(lat, lon).subscribe(
      (data: any) => {
        console.log('Current weather data by coordinates received:', data);
        this.defaultWeather = {
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

    this.weatherService.get5DayForecastByCoordinates(this.userLocation, 'sadas').subscribe(
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
}
