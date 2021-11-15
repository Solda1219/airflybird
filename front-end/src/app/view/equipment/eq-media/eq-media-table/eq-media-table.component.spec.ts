import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqMediaTableComponent } from './eq-media-table.component';

describe('EqMediaTableComponent', () => {
  let component: EqMediaTableComponent;
  let fixture: ComponentFixture<EqMediaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqMediaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqMediaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
