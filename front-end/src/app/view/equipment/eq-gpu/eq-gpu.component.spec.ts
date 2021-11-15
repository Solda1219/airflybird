import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqGpuComponent } from './eq-gpu.component';

describe('EqGpuComponent', () => {
  let component: EqGpuComponent;
  let fixture: ComponentFixture<EqGpuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqGpuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqGpuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
