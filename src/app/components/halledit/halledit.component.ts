import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hall } from 'src/app/common/hall';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-halledit',
  templateUrl: './halledit.component.html',
  styleUrls: ['./halledit.component.css']
})
export class HalleditComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public hall: Hall,
    private hallService: ProductService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  update() {
    this.hallService.update(this.hall).subscribe(
      data => {
        if (data)
          this._snackBar.open("Success", "Close!").afterDismissed().subscribe(data => { window.location.reload(); });
      }
    )
  }

}
