import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIdlingContentComponent } from './report-idling-content.component';

describe('ReportIdlingContentComponent', () => {
  let component: ReportIdlingContentComponent;
  let fixture: ComponentFixture<ReportIdlingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIdlingContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIdlingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
