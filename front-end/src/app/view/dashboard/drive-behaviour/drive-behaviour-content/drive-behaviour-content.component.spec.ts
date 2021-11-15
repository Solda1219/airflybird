import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveBehaviourContentComponent } from './drive-behaviour-content.component';

describe('DriveBehaviourContentComponent', () => {
  let component: DriveBehaviourContentComponent;
  let fixture: ComponentFixture<DriveBehaviourContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriveBehaviourContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveBehaviourContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
