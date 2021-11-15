import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorPlaybackComponent } from './monitor-playback.component';

describe('MonitorPlaybackComponent', () => {
  let component: MonitorPlaybackComponent;
  let fixture: ComponentFixture<MonitorPlaybackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorPlaybackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorPlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
