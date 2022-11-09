import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor() { }

  public getCurrentTenant() {
    let token = localStorage.getItem("token");
    let username = "";
    try {
      let decoded = JSON.stringify(jwt_decode(token!));
      username = ((decoded.split(",")[0].split(":")[1].replace(/['"]+/g, '')));

      // this.router.navigate(["home"])
    }
    catch (Error) {
      console.log(Error)
    }
    return username;
  }

}
