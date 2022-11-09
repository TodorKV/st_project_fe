import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Product } from 'src/app/common/product';
import { User } from 'src/app/common/user';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import { GetUserResponse, UserService } from 'src/app/services/user.service';
import { Actions } from '../../product/product-create/product-create.component';
import { ClImage, Resource } from 'src/app/common/cl-image';
import { Order } from 'src/app/common/order';
import { Photo } from 'src/app/common/photo';

@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.css']
})
export class OrderStepperComponent implements OnInit {
  userData!: GetUserResponse;
  date = new FormControl(new Date());

  basicInfoGroup!: FormGroup;
  productGroup!: FormGroup;
  imageGroup!: FormGroup;
  assigneeGroup!: FormGroup;
  tenantIds: string[] = [];
  arePhotosSaved: boolean = false;

  Priority: any = [
    'URGENT',
    'HIGH',
    'MEDIUM',
    'LOW'
  ]

  prioritySelected: string = "";
  fileInput: File[] = [];

  resources: Resource[] = [];
  userOptions: User[] = [];

  productOptions: Product[] = [];
  productFilteredOptions!: Observable<Product[]>;

  //refresh order history
  public refresh!: Observable<boolean>;
  private refreshSubject!: BehaviorSubject<boolean>;

  set refreshTrigger(newValue: boolean) {
    this.refreshSubject.next(newValue);
    this.refresh = this.refreshSubject.asObservable();
  }

  constructor(private _formBuilder: FormBuilder,
    public orderService: OrderService,
    private productService: ProductService,
    private userService: UserService) {
    this.refreshSubject = new BehaviorSubject<boolean>(false);
    this.refresh = this.refreshSubject.asObservable();
  }

  ngOnInit() {
    this.basicInfoGroup = this._formBuilder.group({
      ctrlPriority: ['', [Validators.required]],
      ctrlDesc: [''],
      ctrlNumber: ['', Validators.required],
      ctrlWhenToBeDone: ['', Validators.required]
    });
    this.imageGroup = this._formBuilder.group({
      ctrlFileInput: [''],
    });
    this.assigneeGroup = this._formBuilder.group({});

    this.productGroup = this._formBuilder.group({
      ctrlProduct: ['', Validators.required]
    });
    this.refresh.subscribe((data) => {
      if (data == true && this.fileInput.length == this.resources.length) {
        var photos: Photo[] = [];
        this.resources.forEach(resource => {
          var photo: Photo = new Photo();
          photo.createdAt = resource.created_at;
          photo.publicId = resource.public_id;
          photo.secureUrl = resource.secure_url;
          photos.push(photo);
        })
        this.orderService.savePhotos(photos, photos[0].publicId.split("/")[1]).subscribe(
          data => {
            this.resources = [];
            this.orderService.refreshTrigger = true;
            this.arePhotosSaved = true;
          }
        );
      }
      // this.refreshTrigger = false;
    });
    this.userService.getUserListPaginate(0, 10000).subscribe(
      data => {
        this.userOptions = data.content;
      }
    );
    this.productService.getHallsListPaginate(0, 10000).subscribe(
      data => {
        this.productOptions = data.content;
        this.productFilteredOptions = this.productGroup.get("ctrlProduct")!.valueChanges.pipe(
          startWith(''),
          map(value => value != null ? value : ""),
          map(value => (typeof value === 'string' ? value : value.name)),
          map(name => {
            let products = (name ? this._productFilter(name) : this.productOptions.slice());
            if (products.length > 0 && products.length < 2) {
              this.setControls(products[0].actions);
            }
            return products;
          }),
        );
      }
    );
  }

  get ctrlWhenToBeDone() {
    var d = this.basicInfoGroup.get('ctrlWhenToBeDone')!.value;
    return d.date() + "/" + (d.month() + 1) + "/" + d.year();
  }

  get ctrlNumber() {
    return this.basicInfoGroup.get('ctrlNumber')!.value;
  }

  get ctrlPriority() {
    return this.basicInfoGroup.get('ctrlPriority')!.value;
  }

  get ctrlProduct(): Actions[] | null {
    let abstrctrl = this.productGroup.get("ctrlProduct")!;
    if (abstrctrl != null) {
      let value = abstrctrl!.value;
      if (value != null)
        return value.actions;
    }
    return null;
  }

  displayUsername(user: User): string {
    return user && user.username ? user.username : '';
  }

  displayName(product: Product): string {
    return product && product.name ? product.name : '';
  }


  imageInputChange(fileInputEvent: any) {
    this.fileInput = fileInputEvent.target.files;
  }

  publishOrder() {
    let order = new Order();
    order.WhenToBeDone = this.ctrlWhenToBeDone;
    order.description = this.basicInfoGroup.get('ctrlDesc')!.value;
    order.orderNumber = this.ctrlNumber;
    order.priority = this.ctrlPriority;
    order.tenantIds = this.tenantIds;
    order.product = this.productGroup.get('ctrlProduct')!.value;
    this.orderService.saveOrder(order).subscribe(data => {
      if (data) {
        if (this.fileInput.length == 0) {
          this.arePhotosSaved = true;
        }

        Array.from(this.fileInput).forEach(file => {
          var uploadFromData: any = new FormData();
          uploadFromData.append("file", file);
          uploadFromData.append("upload_preset", "ordero");
          uploadFromData.append("public_id", `${data.id}/${file.name}`);
          this.orderService.uploadPhoto(uploadFromData).subscribe((data) => {
            if (data) {
              this.resources.push(data);
              this.refreshTrigger = true;
            }
          });
        });
      }
    });
  }

  private _userFilter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.userOptions.filter(option => option.username!.toLowerCase().includes(filterValue));
  }

  private setControls(actions: Actions[]) {
    this.assigneeGroup = this._formBuilder.group({});
    actions.forEach(action => {
      let control = new FormControl('', Validators.required);
      control.valueChanges.subscribe(
        user => {
          if (user != null) this.tenantIds.push(user.tenant.id)
        }
      )
      this.assigneeGroup.addControl(action.id, control)
    });
  }

  private _productFilter(name: string): Product[] {
    const filterValue = name.toLowerCase();
    return this.productOptions.filter(option => option.name!.toLowerCase().includes(filterValue));
  }

  showProduct() {

    console.log("WTF")
  }
}