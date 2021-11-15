import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveBehaviourComponent } from './drive-behaviour.component';

describe('DriveBehaviourComponent', () => {
  let component: DriveBehaviourComponent;
  let fixture: ComponentFixture<DriveBehaviourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriveBehaviourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveBehaviourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
