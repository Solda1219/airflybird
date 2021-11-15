import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodStatusVideoContentComponent } from './vod-status-video-content.component';

describe('VodStatusVideoContentComponent', () => {
  let component: VodStatusVideoContentComponent;
  let fixture: ComponentFixture<VodStatusVideoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodStatusVideoContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodStatusVideoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
