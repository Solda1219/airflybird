import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportOnlineComponent } from './report-online.component';

describe('ReportOnlineComponent', () => {
  let component: ReportOnlineComponent;
  let fixture: ComponentFixture<ReportOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
