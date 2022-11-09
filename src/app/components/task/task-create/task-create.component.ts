import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { User } from 'src/app/common/user';
import { TasksService } from 'src/app/services/tasks.service';
import { GetUserResponse, UserService } from 'src/app/services/user.service';
import { Actions, Product } from '../../product/product-create/product-create.component';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  userData!: GetUserResponse;
  date = new FormControl(new Date());

  basicInfoGroup!: FormGroup;
  productGroup!: FormGroup;
  imageGroup!: FormGroup;
  assigneeGroup!: FormGroup;
  tenantIds!: string;

  Priority: any = [
    'URGENT',
    'HIGH',
    'MEDIUM',
    'LOW'
  ]

  prioritySelected: string = "";
  fileInput: File[] = [];

  userOptions: User[] = [];

  productOptions: Product[] = [];
  productFilteredOptions!: Observable<Product[]>;

  constructor(private _formBuilder: FormBuilder,
    // private orderService: OrderService,
    // private productService: ProductService,
    private tasksService: TasksService,
    private userService: UserService) { }

  ngOnInit() {
    this.basicInfoGroup = this._formBuilder.group({
      ctrlDesc: ['', Validators.required],
      ctrlWhenToBeDone: ['', Validators.required]
    });
    this.assigneeGroup = this._formBuilder.group({
      ctrlWorker: ['', Validators.required]
    });
    this.userService.getUserListPaginate(0, 10000).subscribe(
      data => {
        this.userOptions = data.content;
      }
    );
    // this.productService.getHallsListPaginate(0, 10000).subscribe(
    //   data => {
    //     this.productOptions = data.content;
    //     this.productFilteredOptions = this.productGroup.get("ctrlProduct")!.valueChanges.pipe(
    //       startWith(''),
    //       map(value => (typeof value === 'string' ? value : value.name)),
    //       map(name => {
    //         let products = (name ? this._productFilter(name) : this.productOptions.slice());
    //         if (products.length > 0 && products.length < 2) {
    //           this.setControls(products[0].actions);
    //         }
    //         return products;
    //       }),
    //     );
    //   }
    // );
  }

  get ctrlWhenToBeDone() {
    var d = this.basicInfoGroup.get('ctrlWhenToBeDone')!.value;
    return d.date() + "/" + (d.month() + 1) + "/" + d.year();
  }

  get ctrlWorker() {
    return this.assigneeGroup.get('ctrlWorker')!.value.tenant.id;
  }

  displayUsername(user: User): string {
    return user && user.username ? user.username : '';
  }

  imageInputChange(fileInputEvent: any) {
    this.fileInput = fileInputEvent.target.files;
  }

  publishOrder() {
    var formData: any = new FormData();
    formData.append("description", this.basicInfoGroup.get('ctrlDesc')!.value);
    formData.append("whenToBeDone", this.ctrlWhenToBeDone)
    formData.append("tenantids", this.ctrlWorker);

    this.tasksService.saveTask(formData);
  }

  private _userFilter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.userOptions.filter(option => option.username!.toLowerCase().includes(filterValue));
  }

  private setControls(actions: Actions[]) {
    actions.forEach(action => {
      let control = new FormControl('', Validators.required);
      control.valueChanges.subscribe(
        user => {
          this.tenantIds = user.tenant.id;
        }
      )
      this.assigneeGroup.addControl(action.id, control)
    });
  }

  // private _productFilter(name: string): Product[] {
  //   const filterValue = name.toLowerCase();
  //   return this.productOptions.filter(option => option.name!.toLowerCase().includes(filterValue));
  // }
}
