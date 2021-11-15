import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIgnitionComponent } from './report-ignition.component';

describe('ReportIgnitionComponent', () => {
  let component: ReportIgnitionComponent;
  let fixture: ComponentFixture<ReportIgnitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIgnitionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIgnitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
