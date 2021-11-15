import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOverspeedComponent } from './report-overspeed.component';

describe('ReportOverspeedComponent', () => {
  let component: ReportOverspeedComponent;
  let fixture: ComponentFixture<ReportOverspeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOverspeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOverspeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
