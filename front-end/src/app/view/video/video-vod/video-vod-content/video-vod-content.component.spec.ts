import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoVodContentComponent } from './video-vod-content.component';

describe('VideoVodContentComponent', () => {
  let component: VideoVodContentComponent;
  let fixture: ComponentFixture<VideoVodContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoVodContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoVodContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
