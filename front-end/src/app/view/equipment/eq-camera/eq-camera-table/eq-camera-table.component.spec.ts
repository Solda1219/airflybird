import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqCameraTableComponent } from './eq-camera-table.component';

describe('EqCameraTableComponent', () => {
  let component: EqCameraTableComponent;
  let fixture: ComponentFixture<EqCameraTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqCameraTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqCameraTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
