import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOfflineContentComponent } from './report-offline-content.component';

describe('ReportOfflineContentComponent', () => {
  let component: ReportOfflineContentComponent;
  let fixture: ComponentFixture<ReportOfflineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOfflineContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOfflineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
