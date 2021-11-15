import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLiveSixteenModeComponent } from './video-live-sixteen-mode.component';

describe('VideoLiveSixteenModeComponent', () => {
  let component: VideoLiveSixteenModeComponent;
  let fixture: ComponentFixture<VideoLiveSixteenModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLiveSixteenModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLiveSixteenModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
