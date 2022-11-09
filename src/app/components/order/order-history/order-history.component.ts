import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { OrderService } from 'src/app/services/order.service';
import { ActionStatus, Order } from 'src/app/common/order';
import { GetUserResponse, UserService } from 'src/app/services/user.service';
import { Jwtobj } from 'src/app/common/jwtobj';
import jwt_decode from 'jwt-decode';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActionstatusesDialogComponent } from '../actionstatuses-dialog/actionstatuses-dialog.component';
import { ActionstatusesService } from '../actionstatuses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileSaverService } from 'ngx-filesaver';
import { Photo } from 'src/app/common/photo';
import { saveAs as importedSaveAs } from "file-saver";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  @Input()
  isCompleted: boolean = false;

  displayedColumns: string[] = ['id', 'orderNumber', 'product_description', 'image', "completedImage", 'description', 'user', 'priority', 'options'];
  orders: Order[] = [];
  data: GetUserResponse | undefined;
  base64Image: any;
  // dialogRef!: MatDialogRef<ActionstatusesDialogComponent>;

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.orders);
  constructor(private http: HttpClient,
    private orderService: OrderService,
    private userService: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private actionStatusService: ActionstatusesService,
    private fileSaverService: FileSaverService) { }

  applyFilter(event: any) {
    if (event.key === 'Enter') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.getPage();
    }
  }

  async ngOnInit() {
    this.actionStatusService.refresh.subscribe(
      data => {
        if (data) {
          this.getPage();
          this.dialog.closeAll();
        }
      });
    this.orderService.refresh.subscribe(
      data => {
        if (data) {
          this.getPage();
        }
      });

    let token = localStorage.getItem("token");
    let decoded: Jwtobj = (jwt_decode(token!));

    this.userService.getUserInfo(decoded.sub).subscribe(
      data => {
        this.data = data;
      }
    );

    this.orderService.getOrderListPaginateV3(this.thePageNumber,
      this.thePageSize, this.isCompleted).subscribe(
        data => {
          this.orders = data.content;

          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(this.orders);
        }
      )
  }
  mouseOverIndex = -1;

  public onMouseOver(index: any) {
    this.mouseOverIndex = index;
  }

  handlePage(event: PageEvent) {
    this.thePageNumber = event.pageIndex;
    this.thePageSize = event.pageSize;
    if (this.dataSource.filter) {
      this.orderService.searchOrderPaginateV3(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.orders = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.orders);
          }
        )
    }
    else {
      this.orderService.getOrderListPaginateV3(this.thePageNumber,
        this.thePageSize, this.isCompleted).subscribe(
          data => {
            this.orders = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.orders);
          }
        )
    }
  }

  changeProgress(actionStatus: ActionStatus) {
    this.orderService.changeProgress(actionStatus)

  }

  deleteOrder(id: string) {
    this.orderService.removeContent(id).subscribe(
      data => {
        this.getPage();
      }
    );
  }

  openDialog(actionStatuses: ActionStatus[], currentOrder: Order) {
    this.actionStatusService.setActionStatuses(actionStatuses);
    this.orderService.setCurrentOrder(currentOrder);
    const dialogRef = this.dialog.open(ActionstatusesDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.actionStatusService.refreshTrigger = true;
    });
  }

  printrow(row: any) {

  }

  priorityIcon(priority: string): string {
    if (priority == "URGENT")
      return "priority_high";
    else if (priority == "HIGH")
      return "keyboard_arrow_up";
    else if (priority == "MEDIUM")
      return "drag_handle";
    else
      return "keyboard_arrow_down";
  }

  calculateOverallProgress(actionStatuses: ActionStatus[]): number {
    let stepsDone: number = 0;

    actionStatuses.forEach(function (actionStatus) {
      if (actionStatus.progress == 'CURRENTLY_WORKING')
        stepsDone += 1;
      else if (actionStatus.progress == 'COMPLETED')
        stepsDone += 2;
    });
    return (stepsDone * 100) / (actionStatuses.length * 2);
  }

  async getPage() {

    this.thePageNumber = 0;
    if (this.thePageSize < 1) this.thePageSize = 10;
    if (this.dataSource.filter) {
      this.orderService.searchOrderPaginateV3(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.orders = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.orders);
            this.actionStatusService.refreshTrigger = false;
            this.orderService.refreshTrigger = false;
          }
        )
    }
    else {
      this.thePageSize = 10;
      this.orderService.getOrderListPaginateV3(this.thePageNumber,
        this.thePageSize, this.isCompleted).subscribe(
          data => {
            this.orders = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.orders);
            this.actionStatusService.refreshTrigger = false;
            this.orderService.refreshTrigger = false;
          }
        )
    }
  }

  download(photos: Photo[]) {
    photos.forEach(async photo => {
      var realName = photo.secureUrl.split("ordero");
      console.log(`${environment.downloadUrl}ordero${realName[1]}`);
      console.log("Wtdf");
      var a = document.createElement('a');
      a.href = `${environment.downloadUrl}ordero${realName[1]}`;
      a.download = a.href.substr(a.href.lastIndexOf('/') + 1);
      a.click();
    });
  }

}
