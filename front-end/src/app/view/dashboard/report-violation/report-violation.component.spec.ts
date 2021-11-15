import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViolationComponent } from './report-violation.component';

describe('ReportViolationComponent', () => {
  let component: ReportViolationComponent;
  let fixture: ComponentFixture<ReportViolationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportViolationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
