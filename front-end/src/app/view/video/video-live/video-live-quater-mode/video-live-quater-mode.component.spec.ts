import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLiveQuaterModeComponent } from './video-live-quater-mode.component';

describe('VideoLiveQuaterModeComponent', () => {
  let component: VideoLiveQuaterModeComponent;
  let fixture: ComponentFixture<VideoLiveQuaterModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLiveQuaterModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLiveQuaterModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
