import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalleditComponent } from './halledit.component';

describe('HalleditComponent', () => {
  let component: HalleditComponent;
  let fixture: ComponentFixture<HalleditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalleditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalleditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
