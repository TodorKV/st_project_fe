import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavDrawerOverviewExampleComponent } from './sidenav-drawer-overview-example.component';

describe('SidenavDrawerOverviewExampleComponent', () => {
  let component: SidenavDrawerOverviewExampleComponent;
  let fixture: ComponentFixture<SidenavDrawerOverviewExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavDrawerOverviewExampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavDrawerOverviewExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
