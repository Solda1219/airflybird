import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMessageComponent } from './dashboard-message.component';

describe('DashboardMessageComponent', () => {
  let component: DashboardMessageComponent;
  let fixture: ComponentFixture<DashboardMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
