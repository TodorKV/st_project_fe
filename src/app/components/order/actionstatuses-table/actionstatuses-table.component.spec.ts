import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionstatusesTableComponent } from './actionstatuses-table.component';

describe('ActionstatusesTableComponent', () => {
  let component: ActionstatusesTableComponent;
  let fixture: ComponentFixture<ActionstatusesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionstatusesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionstatusesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
