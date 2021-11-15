import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOnlineContentComponent } from './report-online-content.component';

describe('ReportOnlineContentComponent', () => {
  let component: ReportOnlineContentComponent;
  let fixture: ComponentFixture<ReportOnlineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOnlineContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOnlineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
