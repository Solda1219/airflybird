import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSearchListComponent } from './vehicle-search-list.component';

describe('VehicleSearchListComponent', () => {
  let component: VehicleSearchListComponent;
  let fixture: ComponentFixture<VehicleSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
