import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultWeatherComponent } from './default-weather.component';

describe('DefaultWeatherComponent', () => {
  let component: DefaultWeatherComponent;
  let fixture: ComponentFixture<DefaultWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultWeatherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
