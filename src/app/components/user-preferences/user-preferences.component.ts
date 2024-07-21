import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent {
  selectedUnit: string = 'C';

  @Output() unitChange = new EventEmitter<string>();

  onUnitChange() {
    this.unitChange.emit(this.selectedUnit);
  }
}