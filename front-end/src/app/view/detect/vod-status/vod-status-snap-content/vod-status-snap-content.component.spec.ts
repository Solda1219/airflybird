import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodStatusSnapContentComponent } from './vod-status-snap-content.component';

describe('VodStatusSnapContentComponent', () => {
  let component: VodStatusSnapContentComponent;
  let fixture: ComponentFixture<VodStatusSnapContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodStatusSnapContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodStatusSnapContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
