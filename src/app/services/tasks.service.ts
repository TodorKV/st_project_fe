import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Jwtobj } from '../common/jwtobj';
import jwt_decode from 'jwt-decode';
import { Task } from '../common/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  decoded: Jwtobj = new Jwtobj;
  token: string = "";
  domain: string = "";

  //refresh tasks history
  public refresh!: Observable<boolean>;
  private refreshSubject!: Subject<boolean>;

  set refreshTrigger(newValue: boolean) {
    this.refresh = of(newValue);
    this.refreshSubject.next(newValue);
  }

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token")!;
    this.decoded = (jwt_decode(this.token));
    this.domain = this.decoded.authorities[0].authority == 'USER' ?
      `${environment.baseUrl}task/tenant` :
      `${environment.baseUrl}task`;

    this.refreshSubject = new Subject<boolean>();
    this.refresh = this.refreshSubject.asObservable();

  }

  // V3 is free from tenant filtering
  getTaskListPaginate(thePage: number, thePageSize: number, finished: boolean): Observable<GetTasksResponse> {
    const searchUrl = `${this.domain}?pageNo=${thePage}&pageSize=${thePageSize}&finished=${finished}`;
    return this.http.get<GetTasksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }
  // V3 is free from tenant filtering
  searchTaskPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetTasksResponse> {
    const searchUrl = `${this.domain}/search?description=${theKeyword}&pageNo=${thePage}&pageSize=${thePageSize}`;
    return this.http.get<GetTasksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  saveTask(data: FormData) {
    const searchUrl = `${environment.baseUrl}task`;
    this.http.post(searchUrl,
      {
        "description": data.get('description'),
        "whenToBeDone": data.get('whenToBeDone'),
        "tenants": [
          {
            "id": data.get('tenantids')
          }
        ]
      },
      {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        })
      }).subscribe(data => {

        this.refreshTrigger = true;
      });
  }

  removeContent(id: string) {
    const searchUrl = `${environment.baseUrl}task/delete/${id}`
    return this.http.delete<GetTasksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  finishTask(id: string) {
    const searchUrl = `${environment.baseUrl}task/finish/${id}`
    return this.http.put<GetTasksResponse>(searchUrl, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }
}

export interface GetTasksResponse {
  content: Task[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}