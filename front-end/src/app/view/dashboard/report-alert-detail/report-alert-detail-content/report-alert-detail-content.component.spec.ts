import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAlertDetailContentComponent } from './report-alert-detail-content.component';

describe('ReportAlertDetailContentComponent', () => {
  let component: ReportAlertDetailContentComponent;
  let fixture: ComponentFixture<ReportAlertDetailContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAlertDetailContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAlertDetailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
