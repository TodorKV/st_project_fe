
import { Input, OnInit, TemplateRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {
  Action,
  ButtonEvent,
  ButtonType,
  Image,
  ImageModalEvent,
  ModalGalleryService,
  ModalGalleryRef,
  ModalGalleryConfig,
  ModalLibConfig
} from '@ks89/angular-modal-gallery';
import { Subscription } from 'rxjs';
import { Photo } from 'src/app/common/photo';
import { OrderService } from 'src/app/services/order.service';
import { environment } from 'src/environments/environment';

import * as libConfigs from './libconfig';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnDestroy {

  /**
   * A custom template to illustrate the customization of previews rendering.
   */
  @ViewChild('previewsTemplate')
  previewsTemplate?: TemplateRef<HTMLElement>;

  @Input()
  isCompleted: boolean = false;

  @Input()
  photos: Photo[] = [];

  imageIndex = 0;
  galleryId = 1;
  isPlaying = true;
  // Examples A LIBCONFIG_406 LIBCONFIG_507
  CONFIG: ModalLibConfig = libConfigs.LIBCONFIG_507;

  images: Image[] = [
    new Image(0, {
      img: 'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png',
    })
  ];

  // subscriptions to receive events from the gallery
  // REMEMBER TO call unsubscribe(); in ngOnDestroy (see below)
  private closeSubscription: Subscription | undefined;
  private showSubscription: Subscription | undefined;
  private firstImageSubscription: Subscription | undefined;
  private lastImageSubscription: Subscription | undefined;
  private hasDataSubscription: Subscription | undefined;
  private buttonBeforeHookSubscription: Subscription | undefined;
  private buttonAfterHookSubscription: Subscription | undefined;

  constructor(private modalGalleryService: ModalGalleryService,
    private sanitizer: DomSanitizer,
    private orderService: OrderService) {

  }

  openModal(id: number, imagesArrayToUse: Image[], imageIndex: number, libConfig?: ModalLibConfig): void {
    let orderImages: Image[] = [];

    this.photos.forEach((image, idx) => {
      if (image.forCompletedProduct == this.isCompleted) {
        var realName = image.secureUrl.split("ordero");
        var url = (`${environment.downloadUrl}ordero${realName[1]}`);
        orderImages.push(
          new Image(idx, { img: url })
        )
      }
    });
    if (orderImages.length > 0) {
      imagesArrayToUse = orderImages;
    }
    if (imagesArrayToUse.length === 0) {
      console.error('Cannot open modal-gallery because images array cannot be empty');
      return;
    }
    if (imageIndex > imagesArrayToUse.length - 1) {
      console.error('Cannot open modal-gallery because imageIndex must be valid');
      return;
    }
    const imageToShow: Image = imagesArrayToUse[imageIndex];
    const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
      id,
      images: imagesArrayToUse,
      currentImage: imageToShow,
      libConfig
    } as ModalGalleryConfig) as ModalGalleryRef;
  }


  ngOnDestroy(): void {
    // release resources to prevent memory leaks and unexpected behaviours
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.showSubscription) {
      this.showSubscription.unsubscribe();
    }
    if (this.firstImageSubscription) {
      this.firstImageSubscription.unsubscribe();
    }
    if (this.lastImageSubscription) {
      this.lastImageSubscription.unsubscribe();
    }
    if (this.hasDataSubscription) {
      this.hasDataSubscription.unsubscribe();
    }
    if (this.buttonBeforeHookSubscription) {
      this.buttonBeforeHookSubscription.unsubscribe();
    }
    if (this.buttonAfterHookSubscription) {
      this.buttonAfterHookSubscription.unsubscribe();
    }
  }

  countOfPhotos(photos: Photo[], forCompletedProduct: boolean): number {
    let result = 0;
    photos.forEach(photo => {
      if (photo.forCompletedProduct == forCompletedProduct) {
        result++;
      }
    });
    return result;
  }
}