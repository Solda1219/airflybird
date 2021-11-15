import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlaybackComponent } from './map-playback.component';

describe('MapPlaybackComponent', () => {
  let component: MapPlaybackComponent;
  let fixture: ComponentFixture<MapPlaybackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPlaybackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
