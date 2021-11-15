import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmAlertComponent } from './alarm-alert.component';

describe('AlarmAlertComponent', () => {
  let component: AlarmAlertComponent;
  let fixture: ComponentFixture<AlarmAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
