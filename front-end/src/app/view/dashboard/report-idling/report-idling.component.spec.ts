import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIdlingComponent } from './report-idling.component';

describe('ReportIdlingComponent', () => {
  let component: ReportIdlingComponent;
  let fixture: ComponentFixture<ReportIdlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIdlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIdlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
