import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectStatusContentComponent } from './detect-status-content.component';

describe('DetectStatusContentComponent', () => {
  let component: DetectStatusContentComponent;
  let fixture: ComponentFixture<DetectStatusContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetectStatusContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectStatusContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
