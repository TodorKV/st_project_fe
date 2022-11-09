import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionstatusesDialogComponent } from './actionstatuses-dialog.component';

describe('ActionstatusesDialogComponent', () => {
  let component: ActionstatusesDialogComponent;
  let fixture: ComponentFixture<ActionstatusesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionstatusesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionstatusesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
