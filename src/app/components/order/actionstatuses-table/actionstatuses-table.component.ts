import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { ActionStatus } from 'src/app/common/order';
import { GetUserResponse, UserService } from 'src/app/services/user.service';
import { ActionstatusesService } from '../actionstatuses.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { LastphotoDialogComponent } from '../lastphoto-dialog/lastphoto-dialog.component';

@Component({
  selector: 'app-actionstatuses-table',
  templateUrl: './actionstatuses-table.component.html',
  styleUrls: ['./actionstatuses-table.component.css']
})
export class ActionstatusesTableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'action', 'progress', 'comment', 'timeBegin', 'timeEnd', 'update'];
  actionStatuses: ActionStatus[] = [];
  data: GetUserResponse | undefined;

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.actionStatuses);
  constructor(private http: HttpClient, private orderService: OrderService,
    public userService: UserService,
    private actionStatusService: ActionstatusesService,
    public dialog: MatDialog) { }

  applyFilter(event: any) {
    if (event.key === 'Enter') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  mouseOverIndex = -1;

  public onMouseOver(index: any) {
    this.mouseOverIndex = index;
  }
  async ngOnInit() {
    if (this.userService.isAdmin) {
      this.displayedColumns.splice(1, 0, 'user');
      // this.displayedColumns.push('user')
    }
    this.dataSource = new MatTableDataSource(this.actionStatusService.getActionStatuses());
  }

  changeProgress(actionStatus: ActionStatus) {
    if (actionStatus.lastAction && actionStatus.progress == "CURRENTLY_WORKING") {

      this.dialog.open(LastphotoDialogComponent).afterClosed().subscribe(result => {
        this.orderService.changeProgress(actionStatus).subscribe(data => { if (data) this.actionStatusService.refreshTrigger = true; });
      });
    } else {
      this.orderService.changeProgress(actionStatus).subscribe(data => { if (data) this.actionStatusService.refreshTrigger = true; });
    }

  }

  openCommentDialog(actionStatus: ActionStatus) {
    this.actionStatusService.setCurrentActionStatus(actionStatus);
    const dialogRef = this.dialog.open(CommentsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

