import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { GetUserResponse } from 'src/app/services/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input()
  data: GetUserResponse | undefined;

  @Input()
  isHome: boolean = false;

  constructor(private router: Router,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public getRouter(): Router {
    return this.router;
  }

  logOut() {
    localStorage.setItem("token", "");
    this.router.navigate(["login"]).then(value => window.location.reload())
  }

  edit() {
    this.dialog.open(UserEditComponent, {
      data: { user: this.data, showOldPassword: true }
    });
  }

  addPerson() {
    this.router.navigate(["register"])
  }

}
