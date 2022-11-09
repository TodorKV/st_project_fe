import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, of, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActionStatus, Order } from '../common/order';
import { Jwtobj } from '../common/jwtobj';
import jwt_decode from 'jwt-decode';
import { ActionstatusesService } from '../components/order/actionstatuses.service';
import { ClImage, Resource } from '../common/cl-image';
import { Photo } from '../common/photo';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  uploadPhotoUrl: string = "https://api.cloudinary.com/v1_1/heh9sdxdw/upload";
  searchPhotoUrl: string = "https://api.cloudinary.com/v1_1/heh9sdxdw/resources/search";
  decoded: Jwtobj = new Jwtobj;
  token: string = "";
  domain: string = "";
  public currentOrder = new Order;

  //refresh order history
  public refresh!: Observable<boolean>;
  private refreshSubject!: BehaviorSubject<boolean>;

  set refreshTrigger(newValue: boolean) {
    this.refreshSubject.next(newValue);
    this.refresh = this.refreshSubject.asObservable();
  }

  constructor(private http: HttpClient, private actionStatusService: ActionstatusesService) {
    this.token = localStorage.getItem("token")!;
    this.decoded = (jwt_decode(this.token));
    this.domain = this.decoded.authorities[0].authority == 'USER' ?
      `${environment.baseUrl}order` :
      `${environment.baseV3Url}/order`;

    this.refreshSubject = new BehaviorSubject<boolean>(false);
    this.refresh = this.refreshSubject.asObservable();

  }

  getPhoto(id: string, photoName: string): Observable<Blob> {
    let url = environment.baseV3Url + '/order/downloadFile/' + id + '/' + photoName;
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      }), responseType: 'blob'
    });
  }

  // V3 is free from tenant filtering
  getOrderListPaginateV3(thePage: number, thePageSize: number, finished: boolean): Observable<GetOrdersResponse> {
    const searchUrl = `${this.domain}?pageNo=${thePage}&pageSize=${thePageSize}&finished=${finished}`;
    return this.http.get<GetOrdersResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }
  // V3 is free from tenant filtering
  searchOrderPaginateV3(thePage: number, thePageSize: number, theKeyword: string): Observable<GetOrdersResponse> {
    const searchUrl = `${this.domain}/search?description=${theKeyword}&pageNo=${thePage}&pageSize=${thePageSize}`;
    return this.http.get<GetOrdersResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

  saveOrder(order: Order): Observable<GetOrderResponse> {
    const searchUrl = `${environment.baseV3Url}/order`;
    return this.http.post<GetOrderResponse>(searchUrl, {
      "description": order.description,
      "orderNumber": order.orderNumber,
      "whenToBeDone": order.WhenToBeDone,
      "product": order.product,
      "priority": order.priority,
      "tenantIds": order.tenantIds,
      "completed": false

    }, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => response)
    );
  }

  uploadPhoto(data: FormData): Observable<Resource> {
    return this.http.post<Resource>(this.uploadPhotoUrl, data).pipe(
      map(response => response)
    );
  }

  getPhotosInFolder(orderId: string): Observable<ClImage> {
    return this.http.get<ClImage>(this.searchPhotoUrl + `?expression=folder=ordero/${orderId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('755733569419275:UD5bYYtvpVRREhMaPI0UteUcD2g')

      })
    }).pipe(map(response => response));
  }

  savePhotos(photos: Photo[], id: string) {
    const putPhotosUrl = `${environment.baseUrl}order/photos/${id}`;
    return this.http.put(putPhotosUrl, photos, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(map(response => response));
  }

  public changeProgress(actionStatus: ActionStatus): Observable<boolean> {
    const searchUrl = `${environment.baseUrl}action/status/edit/${actionStatus.id}`;
    return this.http.put<ActionStatus>(searchUrl, actionStatus, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(map(response => response ? true : false));
  }

  public getCurrentOrder(): Order {
    return this.currentOrder;
  }

  public setCurrentOrder(currentOrder: Order): void {
    this.currentOrder = currentOrder;
  }

  private save(searchUrl: string,
    description: string,
    name: string,
    tenantId: string,
    boxId: string): Observable<GetOrderResponse> {
    return this.http.post<GetOrderResponse>(searchUrl, {
      "description": description,
      "name": name,
      "tenant": {
        "id": tenantId
      },
      "box": {
        "id": boxId
      }
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    }).pipe(
      map(response => response)
    );
  }

  removeContent(id: string) {
    const searchUrl = `${environment.baseV3Url}/order/delete/${id}`
    return this.http.delete<GetOrderResponse>(searchUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    });
  }

}

export interface GetOrderResponse {
  id: string,
  name: string,
  description: string,
  orderNumber: string,
  tenant: {
    id: string,
    tenantValue: string
  },
  photos: string[]
}

export interface GetOrdersResponse {
  content: Order[];
  totalElements: number;
  number: number;
  numberOfElements: number;
}

interface GetOrdersV2Response {
  _embedded: {
    orders: Order[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}