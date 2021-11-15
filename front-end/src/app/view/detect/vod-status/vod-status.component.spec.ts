import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodStatusComponent } from './vod-status.component';

describe('VodStatusComponent', () => {
  let component: VodStatusComponent;
  let fixture: ComponentFixture<VodStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
