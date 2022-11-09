import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PasswordChange, UserService } from 'src/app/services/user.service';
import { User } from 'src/app/common/user';
import { environment } from 'src/environments/environment';
import { Jwtobj } from 'src/app/common/jwtobj';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  Roles: any = [
    'Admin',
    'User'
  ];
  role: string = "";
  hide = true;
  passwordChange: PasswordChange = new PasswordChange;
  isAdmin = false;
  // oldPassword: string = "";
  // newPassword: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User, showOldPassword: boolean },
    private _snackBar: MatSnackBar,
    private userService: UserService) {

  }
  async ngOnInit() {
    try {
      let decoded: Jwtobj = (jwt_decode(localStorage.getItem("token")!));
      this.isAdmin = decoded.authorities[0].authority == "ADMIN";
    }
    catch (Error) {
      console.log(Error)
    }
  }

  update() {
    if (this.role != "") {
      this.userService.promoteUser(this.data.user.id!, this.role).subscribe(
        data => {
          if (data)
            this._snackBar.open("Успешно сменена роля!", "Затвори!").afterDismissed();
          // .subscribe(data => { window.location.reload(); });
        }
      )
    }
    var passUrl: string = `${environment.baseUrl}user/my/newpass`
    this.passwordChange.id = this.data.user.id!;
    if (this.data.showOldPassword == false)
      passUrl = `${environment.baseUrl}user/newpass`

    this.userService.updatePassword(passUrl, this.passwordChange).subscribe(
      data => {
        if (data)
          this._snackBar.open("Успешно сменена парола!", "Затвори!").afterDismissed();
      }
    )
  }

  changeRole(value: any) {

    this.role = String(value).toUpperCase();
  }
}
