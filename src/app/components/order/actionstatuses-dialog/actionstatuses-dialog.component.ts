import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActionstatusesService } from '../actionstatuses.service';

@Component({
  selector: 'app-actionstatuses-dialog',
  templateUrl: './actionstatuses-dialog.component.html',
  styleUrls: ['./actionstatuses-dialog.component.css']
})
export class ActionstatusesDialogComponent implements OnInit {

  constructor(private actionStatusesService: ActionstatusesService,
    private dialogRef: MatDialogRef<ActionstatusesDialogComponent>) { }

  async ngOnInit() { }

}
