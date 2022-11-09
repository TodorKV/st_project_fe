import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {

  constructor(private http: HttpClient) { }


  saveBox(
    column: number,
    row: number,
    floor: number,
    name: string,
    hallId: number): Observable<GetBoxResponse> {
    const searchUrl = `${environment.baseUrl}box`;
    return this.save(searchUrl, column, row, floor, name, hallId);
  }



  private save(searchUrl: string,
    column: number,
    row: number,
    floor: number,
    name: string,
    hallId: number): Observable<GetBoxResponse> {
    return this.http.post<GetBoxResponse>(searchUrl, {
      "placementColumn": column,
      "placementRow": row,
      "floor": floor,
      "name": name,
      "hall": {
        "id": hallId
      }
    },{
      headers: new HttpHeaders({ 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem("token") })
    }).pipe(
      map(response => response)
    );
  }

}
export interface GetBoxResponse {
  id: string,
  line: string,
  floor: string,
  name: string,
  hall: {
    id: string,
    name: string
  }
}
