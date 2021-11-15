import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAlertComponent } from './report-alert.component';

describe('ReportAlertComponent', () => {
  let component: ReportAlertComponent;
  let fixture: ComponentFixture<ReportAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
