import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportParkingContentComponent } from './report-parking-content.component';

describe('ReportParkingContentComponent', () => {
  let component: ReportParkingContentComponent;
  let fixture: ComponentFixture<ReportParkingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportParkingContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportParkingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
