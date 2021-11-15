import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqCameraComponent } from './eq-camera.component';

describe('EqCameraComponent', () => {
  let component: EqCameraComponent;
  let fixture: ComponentFixture<EqCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
