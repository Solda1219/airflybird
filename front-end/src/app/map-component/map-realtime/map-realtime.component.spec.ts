import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRealtimeComponent } from './map-realtime.component';

describe('MapRealtimeComponent', () => {
  let component: MapRealtimeComponent;
  let fixture: ComponentFixture<MapRealtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapRealtimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRealtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
