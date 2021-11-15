import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodDetailComponent } from './vod-detail.component';

describe('VodDetailComponent', () => {
  let component: VodDetailComponent;
  let fixture: ComponentFixture<VodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
