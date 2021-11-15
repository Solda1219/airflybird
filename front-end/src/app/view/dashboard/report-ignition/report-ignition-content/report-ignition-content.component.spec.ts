import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportIgnitionContentComponent } from './report-ignition-content.component';

describe('ReportIgnitionContentComponent', () => {
  let component: ReportIgnitionContentComponent;
  let fixture: ComponentFixture<ReportIgnitionContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportIgnitionContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportIgnitionContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
