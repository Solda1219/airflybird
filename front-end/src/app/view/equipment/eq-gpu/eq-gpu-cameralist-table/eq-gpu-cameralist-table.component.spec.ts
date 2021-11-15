import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqGpuCameralistTableComponent } from './eq-gpu-cameralist-table.component';

describe('EqGpuCameralistTableComponent', () => {
  let component: EqGpuCameralistTableComponent;
  let fixture: ComponentFixture<EqGpuCameralistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqGpuCameralistTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqGpuCameralistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
