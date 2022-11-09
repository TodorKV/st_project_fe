import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FileSaverService } from 'ngx-filesaver';
import { Jwtobj } from 'src/app/common/jwtobj';
import { GetUserResponse, UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/common/task';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.css']
})
export class TaskHistoryComponent implements OnInit {


  @Input()
  isCompleted: boolean = false;

  displayedColumns: string[] = ['id', 'description', 'user', 'options'];
  tasks: Task[] = [];
  data: GetUserResponse | undefined;
  base64Image: any;

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.tasks);
  constructor(private http: HttpClient,
    private tasksService: TasksService,
    private userService: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fileSaverService: FileSaverService) { }

  applyFilter(event: any) {
    if (event.key === 'Enter') {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.getPage();
    }
  }

  async ngOnInit() {
    this.tasksService.refresh.subscribe(
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

    this.tasksService.getTaskListPaginate(this.thePageNumber,
      this.thePageSize, this.isCompleted).subscribe(
        data => {
          this.tasks = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(this.tasks);
        }
      )
  }
  mouseOverIndex = -1;

  public onMouseOver(index: any) {
    this.mouseOverIndex = index;
  }

  deleteOrder(id: string) {
    this.tasksService.removeContent(id).subscribe(
      data => {
        this.getPage();
      }
    );
  }

  finishTask(id: string) {
    this.tasksService.finishTask(id).subscribe(
      data => {
        this.getPage();
      }
    );
  }

  handlePage(event: PageEvent) {
    this.thePageNumber = event.pageIndex;
    this.thePageSize = event.pageSize;
    if (this.dataSource.filter) {
      this.tasksService.searchTaskPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.tasks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.tasks);
          }
        )
    }
    else {
      this.tasksService.getTaskListPaginate(this.thePageNumber,
        this.thePageSize, this.isCompleted).subscribe(
          data => {
            this.tasks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.tasks);
          }
        )
    }
  }

  async getPage() {
    this.thePageNumber = 0;
    if (this.thePageSize < 1) this.thePageSize = 10;
    if (this.dataSource.filter) {
      this.tasksService.searchTaskPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.tasks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.tasks);
            this.tasksService.refreshTrigger = false;
          }
        )
    }
    else {
      this.thePageSize = 10;
      this.tasksService.getTaskListPaginate(this.thePageNumber,
        this.thePageSize, this.isCompleted).subscribe(
          data => {
            this.tasks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.tasks);
            this.tasksService.refreshTrigger = false;
          }
        )
    }
  }

}
