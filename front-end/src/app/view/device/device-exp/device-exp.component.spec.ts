import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceExpComponent } from './device-exp.component';

describe('DeviceExpComponent', () => {
  let component: DeviceExpComponent;
  let fixture: ComponentFixture<DeviceExpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceExpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
