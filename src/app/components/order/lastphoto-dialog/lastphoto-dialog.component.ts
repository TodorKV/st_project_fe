import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { Resource } from 'src/app/common/cl-image';
import { Photo } from 'src/app/common/photo';
import { OrderService } from 'src/app/services/order.service';
import { ActionstatusesService } from '../actionstatuses.service';

@Component({
  selector: 'app-lastphoto-dialog',
  templateUrl: './lastphoto-dialog.component.html',
  styleUrls: ['./lastphoto-dialog.component.css']
})
export class LastphotoDialogComponent implements OnInit {
  imageGroup!: FormGroup;
  fileInput: File[] = [];
  resources: Resource[] = [];
  //refresh order history
  public refresh!: Observable<boolean>;
  private refreshSubject!: BehaviorSubject<boolean>;

  set refreshTrigger(newValue: boolean) {
    this.refreshSubject.next(newValue);
    this.refresh = this.refreshSubject.asObservable();
  }

  constructor(private dialogRef: MatDialogRef<LastphotoDialogComponent>,
    private _formBuilder: FormBuilder,
    private orderService: OrderService,) {
    this.refreshSubject = new BehaviorSubject<boolean>(false);
    this.refresh = this.refreshSubject.asObservable();
  }

  async ngOnInit() {
    this.imageGroup = this._formBuilder.group({
      ctrlFileInput: ['', Validators.required],
    });

    this.refresh.subscribe((data) => {
      if (data == true && this.fileInput.length == this.resources.length) {
        var photos: Photo[] = [];
        this.resources.forEach(resource => {
          var photo: Photo = new Photo();
          photo.createdAt = resource.created_at;
          photo.publicId = resource.public_id;
          photo.secureUrl = resource.secure_url;
          photo.forCompletedProduct = true;
          photos.push(photo);
        })
        this.orderService.savePhotos(photos, photos[0].publicId.split("/")[1]).subscribe(
          data => {
            this.resources = [];
            this.orderService.refreshTrigger = true;
          }
        );
      }
    });
  }

  imageInputChange(fileInputEvent: any) {
    this.fileInput = fileInputEvent.target.files;
  }

  saveCompletedPhotos() {
    Array.from(this.fileInput).forEach(file => {
      var uploadFromData: any = new FormData();
      uploadFromData.append("file", file);
      uploadFromData.append("upload_preset", "ordero");
      uploadFromData.append("public_id", `${this.orderService.getCurrentOrder().id!.toString()}/${file.name}`);
      this.orderService.uploadPhoto(uploadFromData).subscribe((data) => {
        if (data) {
          this.resources.push(data);
          this.refreshTrigger = true;
        }
      });
    });
  }
}