import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqFtpTableComponent } from './eq-ftp-table.component';

describe('EqFtpTableComponent', () => {
  let component: EqFtpTableComponent;
  let fixture: ComponentFixture<EqFtpTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EqFtpTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EqFtpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
