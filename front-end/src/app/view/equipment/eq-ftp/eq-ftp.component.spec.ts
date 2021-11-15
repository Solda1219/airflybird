import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqFtpComponent } from './eq-ftp.component';

describe('EqFtpComponent', () => {
  let component: EqFtpComponent;
  let fixture: ComponentFixture<EqFtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqFtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqFtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
