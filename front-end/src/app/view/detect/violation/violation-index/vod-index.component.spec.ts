import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VodIndexComponent } from './vod-index.component';

describe('VodIndexComponent', () => {
  let component: VodIndexComponent;
  let fixture: ComponentFixture<VodIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VodIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VodIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
