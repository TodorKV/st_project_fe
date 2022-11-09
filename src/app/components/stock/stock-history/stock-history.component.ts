import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Stock, StockService } from 'src/app/services/stock.service';
import { StockEditDialogComponent } from '../stock-edit-dialog/stock-edit-dialog.component';

@Component({
  selector: 'app-stock-history',
  templateUrl: './stock-history.component.html',
  styleUrls: ['./stock-history.component.css']
})
export class StockHistoryComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'quantity', 'category', 'options'];
  stocks: Stock[] = [];

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.stocks);

  constructor(private http: HttpClient, private stockService: StockService, public dialog: MatDialog) { }

  applyFilter(event: any) {
    if (event.key === 'Enter') {
      const filterValue = (event.target as HTMLInputElement).value;

      this.dataSource.filter = filterValue.trim().toLowerCase();
      this.buildPage();
    }
  }

  mouseOverIndex = -1;

  public onMouseOver(index: any) {
    this.mouseOverIndex = index;
  }

  async ngOnInit() {

    this.stockService.refresh.subscribe(data => {
      if (data) {
        this.buildPage();
        this.stockService.refreshTrigger = false;
      }
    })

    this.stockService.getProductsListPaginate(this.thePageNumber,
      this.thePageSize).subscribe(
        data => {
          this.stocks = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(this.stocks);
        }
      )
  }

  handlePage(event: PageEvent) {
    this.thePageNumber = event.pageIndex;
    this.thePageSize = event.pageSize;
    if (this.dataSource.filter)
      this.stockService.searchProductsListPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.stocks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.stocks);
          }
        )
    else {
      this.stockService.getProductsListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.stocks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.stocks);
          }
        )
    }
  }

  removeProduct(id: string) {
    this.stockService.removeProduct(id).subscribe(
      data => {
        this.buildPage();
      }
    );
  }

  openDialog(id: string, stock: Stock) {
    this.stockService.setCurrentStock(stock);
    const dialogRef = this.dialog.open(StockEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      this.stockService.refreshTrigger = true;
    });
  }

  buildPage() {
    this.thePageNumber = 0;
    if (this.thePageSize < 1) this.thePageSize = 10;
    if (this.dataSource.filter) {
      this.stockService.searchProductsListPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.stocks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.stocks);
          }
        )
    }
    else {
      this.thePageSize = 10;
      this.stockService.getProductsListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.stocks = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.stocks);
          }
        )
    }
  }

}
