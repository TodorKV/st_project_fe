import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-edit-dialog',
  templateUrl: './stock-edit-dialog.component.html',
  styleUrls: ['./stock-edit-dialog.component.css']
})
export class StockEditDialogComponent implements OnInit {
  data = this.stockService.getCurrentStock();
  updatedQuantity: string = '';

  constructor(private stockService: StockService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  updateQuantity() {
    console.log(this.updatedQuantity);
    this.data.quantity = this.updatedQuantity;
    this.stockService.editStock(this.data)
      .subscribe(
        data => {

        }
      );
  }

}
