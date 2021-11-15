import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportParkingComponent } from './report-parking.component';

describe('ReportParkingComponent', () => {
  let component: ReportParkingComponent;
  let fixture: ComponentFixture<ReportParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportParkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
