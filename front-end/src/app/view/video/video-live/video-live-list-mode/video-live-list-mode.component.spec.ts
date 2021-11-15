import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLiveListModeComponent } from './video-live-list-mode.component';

describe('VideoLiveListModeComponent', () => {
  let component: VideoLiveListModeComponent;
  let fixture: ComponentFixture<VideoLiveListModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLiveListModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLiveListModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
