import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastphotoDialogComponent } from './lastphoto-dialog.component';

describe('LastphotoDialogComponent', () => {
  let component: LastphotoDialogComponent;
  let fixture: ComponentFixture<LastphotoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastphotoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastphotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
