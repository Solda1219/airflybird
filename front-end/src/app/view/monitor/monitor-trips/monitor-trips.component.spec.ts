import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorTripsComponent } from './monitor-trips.component';

describe('MonitorTripsComponent', () => {
  let component: MonitorTripsComponent;
  let fixture: ComponentFixture<MonitorTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorTripsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
