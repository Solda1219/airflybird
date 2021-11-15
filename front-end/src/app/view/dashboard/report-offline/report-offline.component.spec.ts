import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfflineComponent } from './report-offline.component';

describe('ReportOfflineComponent', () => {
  let component: ReportOfflineComponent;
  let fixture: ComponentFixture<ReportOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
