import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoVodComponent } from './video-vod.component';

describe('VideoVodComponent', () => {
  let component: VideoVodComponent;
  let fixture: ComponentFixture<VideoVodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoVodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoVodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
