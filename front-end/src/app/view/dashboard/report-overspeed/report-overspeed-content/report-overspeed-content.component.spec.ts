import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOverspeedContentComponent } from './report-overspeed-content.component';

describe('ReportOverspeedContentComponent', () => {
  let component: ReportOverspeedContentComponent;
  let fixture: ComponentFixture<ReportOverspeedContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOverspeedContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOverspeedContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
