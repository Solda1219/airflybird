import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorIndexComponent } from './monitor-index.component';

describe('MonitorIndexComponent', () => {
  let component: MonitorIndexComponent;
  let fixture: ComponentFixture<MonitorIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
