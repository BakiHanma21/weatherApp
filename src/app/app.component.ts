import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Weather Forecast App';
  location: string = '';  // Default value for location
  unit: string = localStorage.getItem('unit') || 'C';

  updateLocation(location: string) {
    this.location = location;
  }

  updateUnit(unit: string) {
    this.unit = unit;
    localStorage.setItem('unit', unit);
  }
}