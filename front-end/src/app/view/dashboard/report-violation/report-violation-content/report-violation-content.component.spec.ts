import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViolationContentComponent } from './report-violation-content.component';

describe('ReportViolationContentComponent', () => {
  let component: ReportViolationContentComponent;
  let fixture: ComponentFixture<ReportViolationContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportViolationContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViolationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
