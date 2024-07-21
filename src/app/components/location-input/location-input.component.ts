import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.scss']
})
export class LocationInputComponent {
  location: string = '';
  @Output() locationChange = new EventEmitter<string>();

  getWeather() {
    console.log('Emitting location:', this.location); // Log to check if location is emitted
    this.locationChange.emit(this.location);
  }
}
