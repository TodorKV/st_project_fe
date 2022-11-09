import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  hide = true;
  email: string = "";
  password: string = "";
  // get passwordInput() { return this.signin.get('password'); }
  constructor(private http: HttpClient,
    private router: Router,
    private userService: UserService,
    public loaderService: LoaderService) { }

  ngOnInit() {

    // if (localStorage.getItem("token") != "") {
    // TODO : Не съм сигурен дали е проблем, 
    // препращането към /home е останалото от времето когато 
    // всеки да се регистрира.

    // this.router.navigate(["home"])
    // }
  }


  login() {
    this.userService.login(this.email, this.password).subscribe(resp => {
      let token = resp.headers.get('Authorization');

      if (token) {
        localStorage.setItem("token", token.replace("Bearer ", ""));
        try {
          let decoded = JSON.stringify(jwt_decode(token));

          this.router.navigate(["home"])
        }
        catch (Error) {
          console.log(Error)
        }
      }
    });

  }

}
