import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOverviewContentComponent } from './report-overview-content.component';

describe('ReportOverviewContentComponent', () => {
  let component: ReportOverviewContentComponent;
  let fixture: ComponentFixture<ReportOverviewContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOverviewContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOverviewContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
