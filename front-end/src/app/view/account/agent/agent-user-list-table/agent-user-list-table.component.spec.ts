import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentUserListTableComponent } from './agent-user-list-table.component';

describe('AgentUserListTableComponent', () => {
  let component: AgentUserListTableComponent;
  let fixture: ComponentFixture<AgentUserListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentUserListTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentUserListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
