import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { PageEvent } from '@angular/material/paginator';
import { Hall } from 'src/app/common/hall';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HalleditComponent } from '../halledit/halledit.component';
import { Product } from 'src/app/common/product';

/**
 * @title Table with filtering
 */
@Component({
  selector: 'app-halltable',
  templateUrl: './halltable.component.html',
  styleUrls: ['./halltable.component.css']
})
export class HalltableComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'city', 'address', 'options'];
  halls: Product[] = [];

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.halls);
  constructor(private http: HttpClient, private hallService: ProductService, public dialog: MatDialog) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.thePageNumber = 0;
    this.hallService.searchHallPaginate(this.thePageNumber,
      this.thePageSize,
      this.dataSource.filter.toString()).subscribe(
        data => {
          this.halls = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(this.halls);
        }
      )
  }
  openDialog(id: string) {
    this.dialog.open(HalleditComponent, {
      data: this.halls.find(element => element.id == id),
    });
  }

  async ngOnInit() {
    this.hallService.getHallsListPaginate(this.thePageNumber,
      this.thePageSize).subscribe(
        data => {
          this.halls = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;

          this.dataSource = new MatTableDataSource(this.halls);
        }
      )
  }

  handlePage(event: PageEvent) {
    this.thePageNumber = event.pageIndex;
    this.thePageSize = event.pageSize;
    if (this.dataSource.filter) {
      this.hallService.searchHallPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.halls = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.halls);
          }
        )
    }
    else {
      this.hallService.getHallsListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.halls = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;

            this.dataSource = new MatTableDataSource(this.halls);
          }
        )
    }

  }

  deleteHall(id: string) {
    this.hallService.removeHall(id).subscribe(
      data => {
      }
    );
  }
}

