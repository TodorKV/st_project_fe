import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalltableComponent } from './halltable.component';

describe('HalltableComponent', () => {
  let component: HalltableComponent;
  let fixture: ComponentFixture<HalltableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalltableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalltableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
