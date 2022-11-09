import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Jwtobj } from '../common/jwtobj';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { ActionStatus, Tenant } from '../common/order';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  decoded: Jwtobj = new Jwtobj;
  token: string = "";
  domain: string = "";

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token")!;
    this.decoded = (jwt_decode(this.token));
    this.domain = `${environment.baseUrl}comment`;
  }

  saveComment(comment: string, tenant: Tenant, actionStatus: ActionStatus, timeSent: string): Observable<Comment> {
    return this.save(this.domain, comment, tenant, actionStatus, timeSent);
  }

  private save(searchUrl: string,
    comment: string,
    tenant: Tenant,
    actionStatus: ActionStatus,
    timeSent: string): Observable<Comment> {

    return this.http.post<Comment>(searchUrl, {
      "comment": comment,
      "tenant": tenant,
      "actionStatus": actionStatus,
      "timeSent": timeSent
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => response)
    );
  }
}

export class Comment {
  comment: string | undefined;
  tenant!: Tenant;
  actionStatus!: ActionStatus;
  timeSent: string | undefined;

  constructor(comment: string, tenant: Tenant, actionStatus: ActionStatus, timeSent: string) {
    this.comment = comment;
    this.tenant = tenant;
    this.actionStatus = actionStatus;
    this.timeSent = timeSent;
  }
}
