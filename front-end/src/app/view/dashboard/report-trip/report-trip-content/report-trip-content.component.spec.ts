import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTripContentComponent } from './report-trip-content.component';

describe('ReportTripContentComponent', () => {
  let component: ReportTripContentComponent;
  let fixture: ComponentFixture<ReportTripContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTripContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTripContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
