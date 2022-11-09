import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, Subject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Hall } from '../common/hall';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  //refresh order history
  public refresh!: Observable<boolean>;
  private refreshSubject!: Subject<boolean>;

  constructor(private http: HttpClient) {
    this.refreshSubject = new Subject<boolean>();
    this.refresh = this.refreshSubject.asObservable();
  }

  set refreshTrigger(newValue: boolean) {
    this.refresh = of(newValue);
    this.refreshSubject.next(newValue);
  }

  getHallsListPaginate(thePage: number, thePageSize: number): Observable<GetProductsResponse> {
    const searchUrl = `${environment.baseUrl}product?`
      + `pageNo=${thePage}&pageSize=${thePageSize}`;
    return this.http.get<GetProductsResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  searchHallPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetProductsResponse> {
    const searchUrl = `${environment.baseUrl}hall/search/getAllPaginated?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    return this.http.get<GetProductsResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  saveProduct(name: string,
    description: string,
    actions: Action[]): Observable<GetProductResponse> {
    const searchUrl = `${environment.baseUrl}product`;
    return this.save(searchUrl, description, name, actions);
  }

  getProductsListPaginate(thePage: number, thePageSize: number): Observable<GetProductsResponse> {
    const searchUrl = `${environment.baseUrl}product?pageNo=${thePage}&pageSize=${thePageSize}`
    return this.http.get<GetProductsResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  searchProductsListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetProductsResponse> {
    const searchUrl = `${environment.baseUrl}product/search?name=${theKeyword}&pageNo=${thePage}&pageSize=${thePageSize}`
    return this.http.get<GetProductsResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  removeProduct(id: string) {
    const searchUrl = `${environment.baseUrl}product/delete/${id}`
    return this.http.delete<GetProductResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  removeHall(id: string) {
    const searchUrl = `${environment.baseUrl}hall/${id}`
    return this.http.delete(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  update(hall: Hall): Observable<GetProductResponse> {
    const searchUrl = `${environment.baseUrl}hall/${hall.id}`;
    return this.http.put<GetProductResponse>(searchUrl, {
      "name": hall.name,
      "city": hall.city,
      "address": hall.address

    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => response)
    );
  }

  private save(searchUrl: string,
    description: string,
    name: string,
    actions: Action[]): Observable<GetProductResponse> {
    return this.http.post<GetProductResponse>(searchUrl, {
      "name": name,
      "description": description,
      "actions": actions
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

export interface GetProductsResponse {
  content: Product[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}

export interface GetProductResponse {
  id: string,
  name: string,
  description: string,
  actions: Action[]
}

export interface Action {
  id: string,
  name: string,
  expectedMinutes: number
  step: number;
}

export interface GetProductsResponse {
  content: Product[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}