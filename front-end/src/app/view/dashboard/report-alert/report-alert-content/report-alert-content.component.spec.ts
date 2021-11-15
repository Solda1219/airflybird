import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAlertContentComponent } from './report-alert-content.component';

describe('ReportAlertContentComponent', () => {
  let component: ReportAlertContentComponent;
  let fixture: ComponentFixture<ReportAlertContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAlertContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAlertContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
