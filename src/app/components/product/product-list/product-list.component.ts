import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product-create/product-create.component';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'description', 'actions', 'options'];
  products: Product[] = [];

  // new properties for pagination
  thePageNumber: number = 0;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  dataSource = new MatTableDataSource(this.products);

  constructor(private http: HttpClient, private productService: ProductService) { }

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

    this.productService.refresh.subscribe(data => {
      if (data) {
        this.buildPage();
        this.productService.refreshTrigger = false;
      }
    })

    this.productService.getProductsListPaginate(this.thePageNumber,
      this.thePageSize).subscribe(
        data => {
          this.products = data.content;
          this.thePageNumber = data.number + 1;
          this.thePageSize = data.numberOfElements;
          this.theTotalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(this.products);
        }
      )
  }

  handlePage(event: PageEvent) {
    this.thePageNumber = event.pageIndex;
    this.thePageSize = event.pageSize;
    if (this.dataSource.filter)
      this.productService.searchProductsListPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.products = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.products);
          }
        )
    else {
      this.productService.getProductsListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.products = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.products);
          }
        )
    }
  }

  removeProduct(id: string) {
    this.productService.removeProduct(id).subscribe(
      data => {
        this.buildPage();
      }
    );
  }

  openDialog(id: string) {

  }

  buildPage() {
    this.thePageNumber = 0;
    if (this.thePageSize < 1) this.thePageSize = 10;
    if (this.dataSource.filter) {
      this.productService.searchProductsListPaginate(this.thePageNumber,
        this.thePageSize,
        this.dataSource.filter.toString()).subscribe(
          data => {
            this.products = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.products);
          }
        )
    }
    else {
      this.thePageSize = 10;
      this.productService.getProductsListPaginate(this.thePageNumber,
        this.thePageSize).subscribe(
          data => {
            this.products = data.content;
            this.thePageNumber = data.number + 1;
            this.thePageSize = data.numberOfElements;
            this.theTotalElements = data.totalElements;
            this.dataSource = new MatTableDataSource(this.products);
          }
        )
    }
  }

}
