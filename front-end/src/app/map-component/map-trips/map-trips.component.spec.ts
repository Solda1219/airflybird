import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTripsComponent } from './map-trips.component';

describe('MapTripsComponent', () => {
  let component: MapTripsComponent;
  let fixture: ComponentFixture<MapTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapTripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
