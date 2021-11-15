import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTripComponent } from './report-trip.component';

describe('ReportTripComponent', () => {
  let component: ReportTripComponent;
  let fixture: ComponentFixture<ReportTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportTripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
