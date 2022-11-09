import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  Roles: any = [
    'Admin',
    'User'
  ];
  realname: string = "";
  hide = true;
  email: string = "";
  password: string = "";
  role: string = "";

  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService) { }
  ngOnInit() {
    if (localStorage.getItem("token") == null || localStorage.getItem("token") == "" || !this.userService.isAdmin) {
      localStorage.setItem("token", "");
      this.router.navigate(["login"]);
    }
  }

  changeRole(value: any) {

    this.role = String(value).toUpperCase();
  }

  register() {
    // this.router.navigate(["home"])


    this.userService.registerUser(this.password, this.role, this.role + "_" + this.email, this.email, this.realname).subscribe(
      data => {

        if (data != null)
          this.router.navigate(["home"])
      }
    );

  }
}
