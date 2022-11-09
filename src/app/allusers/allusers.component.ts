import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components//dialog/dialog.component';

/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'dialog-content-example',
  templateUrl: 'allusers.component.html',
})
export class AllusersComponent implements OnInit {
  constructor(public dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   
    // });
  }
  ngOnInit(): void {

  }
}