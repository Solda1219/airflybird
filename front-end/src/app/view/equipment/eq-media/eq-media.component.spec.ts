import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqMediaComponent } from './eq-media.component';

describe('EqMediaComponent', () => {
  let component: EqMediaComponent;
  let fixture: ComponentFixture<EqMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
