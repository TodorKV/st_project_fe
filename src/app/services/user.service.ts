import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../common/user';
import { Numeric } from 'd3-array';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isAdmin: boolean = false;

  constructor(private http: HttpClient) { }


  registerUser(password: string,
    role: string,
    tenant: string,
    username: string,
    realname: string): Observable<GetUserResponse> {
    const searchUrl = `${environment.baseUrl}user/register`;
    return this.register(searchUrl, password, role, tenant, username, realname);
  }

  getUserInfo(username: string) {
    const searchUrl = `${environment.baseUrl}user/${username}`;
    return this.findByEmail(searchUrl);
  }

  private register(searchUrl: string,
    password: string,
    role: string,
    tenant: string,
    username: string,
    realname: string): Observable<GetUserResponse> {
    return this.http.post<GetUserResponse>(searchUrl, {
      "password": password,
      "role": role,
      "tenant": {
        "id": username + "_id",
        "tenantValue": "value_" + tenant + "_" + username
      },
      "username": username,
      "realname": realname
    }).pipe(
      map(response => response)
    );
  }

  findByEmail(searchUrl: string): Observable<GetUserResponse> {
    return this.http.get<GetUserResponse>(searchUrl).pipe(
      map(response => response)
    );
  }

  login(email: string, password: string) {

    return this.http.post(environment.baseLoginUrl,
      {
        "username": email,
        "password": password,
      }, { observe: 'response' }).pipe(map(
        resp => resp));
  }

  getUserListPaginate(thePage: number, thePageSize: number): Observable<GetUsersResponse> {
    const searchUrl = `${environment.baseUrl}user?`
      + `pageNo=${thePage}&pageSize=${thePageSize}`;
    return this.http.get<GetUsersResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  searchUserPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetUsersResponse> {
    const searchUrl = `${environment.baseUrl}user/search/?username=${theKeyword}`
      + `&pageNo=${thePage}&pageSize=${thePageSize}`;
    return this.http.get<GetUsersResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  removeUser(id: string) {
    const searchUrl = `${environment.baseV2Url}/users/${id}`
    return this.http.delete<GetUsersResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  promoteUser(id: string, role: string) {
    const promoteUrl = `${environment.baseUrl}user/promote/${id}/to/${role}`

    return this.http.put(promoteUrl, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => "ok")
    );
  }

  updatePassword(url: string, passwordChange: PasswordChange) {
    return this.http.put(url, passwordChange, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(map(response => "ok"));
  }

}
export class PasswordChange {
  id: string = "";
  oldPassword: string = "";
  newPassword: string = "";
}

export interface GetUserResponse {
  realname: string,
  username: string,
  password: string,
  tenant: {
    id: string,
    tenantValue: string
  },
  role: string
}

interface GetUsersResponse {
  content: User[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}
