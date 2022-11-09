import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-create',
  templateUrl: './stock-create.component.html',
  styleUrls: ['./stock-create.component.css']
})
export class StockCreateComponent implements OnInit {

  name: string = "";
  quantity: string = "";
  category: string = "";
  thisIsMyForm!: FormGroup;

  constructor(private stockService: StockService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.thisIsMyForm = new FormGroup({
      formArrayName: this.formBuilder.array([])
    })
  }

  send() {
    this.stockService.saveStock(this.name, this.quantity, this.category).subscribe(
      d => {
        this.stockService.refreshTrigger = true;
        this.name = '';
        this.quantity = '';
        this.category = '';
      }
    )
  }

}
