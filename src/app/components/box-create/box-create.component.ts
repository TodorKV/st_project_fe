import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoxesService } from 'src/app/services/boxes.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-box-create',
  templateUrl: './box-create.component.html',
  styleUrls: ['./box-create.component.css']
})
export class BoxCreateComponent implements OnInit {

  boxName: string = ""
  hallId: string = ""

  column: string = ""
  row: string = ""
  floor: string = ""

  constructor(private http: HttpClient,
    private boxService: BoxesService,
    private _snackBar: MatSnackBar) { }

  send() {
    // 
    // 
    // 
    // 
    this.boxService.saveBox(Number(this.column), Number(this.row), Number(this.floor), this.boxName, Number(this.hallId)).subscribe(
      data => {
        if (data)
          this._snackBar.open("Success", "Close!")
      }
    )
  }

  ngOnInit(): void {
  }

}
