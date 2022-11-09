import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/common/user';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'table-filtering-example',
  styleUrls: ['table-filtering-example.component.css'],
  templateUrl: 'table-filtering-example.component.html',
})
export class TableFilteringExampleComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'role', 'edit'];
  users: User[] = [];

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.users);
  constructor(private http: HttpClient, private userService: UserService, private dialog: MatDialog) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.buildPage();
  }

  async ngOnInit() {
    this.userService.getUserListPaginate(this.thePageNumber,
      this.thePageSize).subscribe(
        data => {
          this.users = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;

          this.dataSource = new MatTableDataSource(this.users);
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
      this.userService.searchUserPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.users = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.users);
          }
        )
    }
    else {
      this.userService.getUserListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.users = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.users);
          }
        )
    }
  }
  deleteUser(id: string) {
    this.userService.removeUser(id).subscribe(
      data => {
        this.buildPage();
      }
    );
  }

  editUser(id: string) {
    this.dialog.open(UserEditComponent, {
      data: { user: this.users.find(element => element.id == id), showOldPassword: false }
    }).afterClosed().subscribe(data => {
      this.buildPage();
    });
  }

  buildPage() {

    this.thePageNumber = 0;
    if (this.thePageSize < 1) this.thePageSize = 10;
    if (this.dataSource.filter) {
      this.userService.searchUserPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.users = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.users);
          }
        )
    }
    else {
      this.thePageSize = 10;
      this.userService.getUserListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.users = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.users);
          }
        )
    }
  }
}
