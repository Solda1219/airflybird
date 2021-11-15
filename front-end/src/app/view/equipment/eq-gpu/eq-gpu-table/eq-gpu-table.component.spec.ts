import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqGpuTableComponent } from './eq-gpu-table.component';

describe('EqGpuTableComponent', () => {
  let component: EqGpuTableComponent;
  let fixture: ComponentFixture<EqGpuTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqGpuTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqGpuTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
