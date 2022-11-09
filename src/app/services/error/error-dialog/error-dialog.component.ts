import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Jwtobj } from 'src/app/common/jwtobj';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

  logoutFlag: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  ngOnInit(): void {
  }

  public getErorrMsg(): string {
    let errorMsg: string = this.data.errorMsg;
    let token = localStorage.getItem('token');
    if (this.data.errorCode == '403') {
      if (token == '' || token == null) {
        if (errorMsg.includes('login')) {
          // user is getting 403 on login page which means that he is providing bad credentials
          errorMsg = 'Грешен имейл или парола';
        } else {
          errorMsg = 'Акаунтът няма достатъчно права или токенът Ви е изтекъл! Пробвайте да влезете отново!'
          this.logoutFlag = true;
        }
      } else {
        let decoded: Jwtobj = jwt_decode(token!);
        if (errorMsg.includes('login')) {
          localStorage.setItem("token", "");
          errorMsg = 'Грешен имейл или парола';
        }
        else if (Date.now() >= decoded.exp! * 1000) {
          this.logoutFlag = true;
          errorMsg = 'Токенът Ви е изтекъл. Моля влезте отново!'
        }
      }
    }
    else if (this.data.errorCode == '500') {
      if (errorMsg.includes('product/delete')) {
        errorMsg = 'Има съществуващи поръчки за този продукт. Не може да бъде изтрит в момента!'
      }
    }
    return errorMsg;
  }

  logOut() {
    localStorage.setItem("token", "");
    this.router.navigate(["login"]).then(value => window.location.reload())
  }
}

