import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { OrderService } from 'src/app/services/order.service';
import { UserService, GetUserResponse } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content-create',
  templateUrl: './content-create.component.html',
  styleUrls: ['./content-create.component.css']
})
export class ContentCreateComponent implements OnInit {
  user: GetUserResponse | undefined;
  name: string = ""
  boxId: string = ""

  description: string = ""

  constructor(private http: HttpClient,
    private orderService: OrderService,
    private userService: UserService,
    private _snackBar: MatSnackBar) { }

  async send() {

    try {
      let token = localStorage.getItem("token");
      let userName = "";
      try {
        let decoded = JSON.stringify(jwt_decode(token!));
        userName = ((decoded.split(",")[0].split(":")[1].replace(/['"]+/g, '')));
      }
      catch (Error) {
      }
      let user = await this.userService.getUserInfo(userName).subscribe(
        data => {
          this.user = data;

          // this.orderService.saveContent(this.description,this.name,this.user.tenant.id, this.boxId).subscribe(
          //   data =>{
          //     if(data)
          //     this._snackBar.open("Success", "Close!")
          //   }
          // )

        }
      )
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit(): void {
  }

}
