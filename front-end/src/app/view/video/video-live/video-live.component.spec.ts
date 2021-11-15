import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLiveComponent } from './video-live.component';

describe('VideoLiveComponent', () => {
  let component: VideoLiveComponent;
  let fixture: ComponentFixture<VideoLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
