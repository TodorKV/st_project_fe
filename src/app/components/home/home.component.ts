import { Component, Injectable, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, GetUserResponse } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { MatStepperIntl } from '@angular/material/stepper';
import { Jwtutils } from 'src/app/common/jwtutils';
import { MatDialog } from '@angular/material/dialog';
import { Jwtobj } from 'src/app/common/jwtobj';
import { StompService } from 'src/app/services/stomp.service';
import { OrderService } from 'src/app/services/order.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Injectable()
export class StepperIntl extends MatStepperIntl {
  // the default optional label text, if unspecified is "Optional"
  override optionalLabel = 'Optional Label';
}

export enum ToggleEnum {
  NewOrder,
  Stats,
  History,
  Product,
  MyOrders,
  NewTask,
  MyTasks,
  Stock
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [{ provide: MatStepperIntl, useClass: StepperIntl }],
})

export class HomeComponent implements OnInit {
  data: GetUserResponse | undefined;
  toggleEnum = ToggleEnum;
  selectedState = ToggleEnum.Product;
  newOrderCount = 0;
  newTaskCount = 0;
  flag: boolean = false;

  constructor(private orderService: OrderService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private stompService: StompService,
    public loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef) { }


  async ngOnInit() {
    this.loaderService.isLoading.subscribe(data => {
      this.flag = this.loaderService.isLoading.value;
      this.changeDetectorRef.detectChanges();
    })
    try {
      let token = localStorage.getItem("token");
      let decoded: Jwtobj = (jwt_decode(token!));
      this.userService.isAdmin = decoded.authorities[0].authority == 'ADMIN';
      if (token == null || token == "" || Jwtutils.tokenExpired(decoded.exp!)) {
        this.logOut();
      }

      if (decoded.authorities[0].authority == 'USER') {
        this.selectedState = ToggleEnum.MyOrders;
      }
      this.userService.getUserInfo(decoded.sub).subscribe(
        data => {
          this.data = data;
        }
      );
    }
    catch (Error) {
      console.log(Error)
    }
  }

  logOut() {
    localStorage.setItem("token", "");
    this.router.navigate(["login"]).then(value => window.location.reload())
  }

  onChange($event: any) {

    this.selectedState = $event.value;
  }

}

