import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  public refresh!: Observable<boolean>;
  private refreshSubject!: Subject<boolean>;
  public currentStock!: Stock;

  constructor(private http: HttpClient) {
    this.refreshSubject = new Subject<boolean>();
    this.refresh = this.refreshSubject.asObservable();
  }

  set refreshTrigger(newValue: boolean) {
    this.refresh = of(newValue);
    this.refreshSubject.next(newValue);
  }

  saveStock(name: string,
    quantity: string,
    category: string): Observable<Stock> {
    const saveUrl = `${environment.baseUrl}stock`;
    return this.save(saveUrl, quantity, name, category);
  }

  private save(saveUrl: string,
    quantity: string,
    name: string,
    category: string): Observable<Stock> {
    return this.http.post<Stock>(saveUrl, {
      "name": name,
      "quantity": quantity,
      "category": category
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => response)
    );
  }

  public editStock(stock: Stock): Observable<boolean> {
    const searchUrl = `${environment.baseUrl}stock/edit/${stock.id}`;
    return this.http.put<Stock>(searchUrl, stock, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(map(response => response ? true : false));
  }

  removeProduct(id: string) {
    const searchUrl = `${environment.baseUrl}stock/delete/${id}`
    return this.http.delete<GetStocksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  getProductsListPaginate(thePage: number, thePageSize: number): Observable<GetStocksResponse> {
    const searchUrl = `${environment.baseUrl}stock?pageNo=${thePage}&pageSize=${thePageSize}`
    return this.http.get<GetStocksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  searchProductsListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetStocksResponse> {
    const searchUrl = `${environment.baseUrl}stock/search?name=${theKeyword}&pageNo=${thePage}&pageSize=${thePageSize}`
    return this.http.get<GetStocksResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  public getCurrentStock(): Stock {
    return this.currentStock;
  }

  public setCurrentStock(currentStock: Stock): void {
    this.currentStock = currentStock;
  }

}

export interface GetStocksResponse {
  content: Stock[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}

export interface Stock {
  id: string,
  name: string,
  quantity: string,
  category: string
}