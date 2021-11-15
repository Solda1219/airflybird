import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAllComponent } from './device-all.component';

describe('DeviceAllComponent', () => {
  let component: DeviceAllComponent;
  let fixture: ComponentFixture<DeviceAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
