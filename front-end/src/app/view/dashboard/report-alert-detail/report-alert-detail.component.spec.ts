import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAlertDetailComponent } from './report-alert-detail.component';

describe('ReportAlertDetailComponent', () => {
  let component: ReportAlertDetailComponent;
  let fixture: ComponentFixture<ReportAlertDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAlertDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAlertDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
