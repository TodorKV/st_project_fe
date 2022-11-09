import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallgridComponent } from './hallgrid.component';

describe('BoxgridComponent', () => {
  let component: HallgridComponent;
  let fixture: ComponentFixture<HallgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HallgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HallgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
