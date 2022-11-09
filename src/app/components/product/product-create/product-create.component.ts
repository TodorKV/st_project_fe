import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ObjectUnsubscribedError } from 'rxjs';
import { compileNgModuleDeclarationExpression } from '@angular/compiler/src/render3/r3_module_compiler';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  name: string = "";
  description: string = "";
  newActions: Actions[] = [];
  thisIsMyForm!: FormGroup;

  constructor(private http: HttpClient,
    private productService: ProductService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  buildForm() {
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;

    this.newActions.forEach((e, i) => {
      controlArray.push(
        this.formBuilder.group({
          name: ['', [Validators.required]],
          minutes: ['', [Validators.required]],
          step: 1
        })
      )
    });
  }

  addForm(last: number) {
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    controlArray.push(
      this.formBuilder.group({
        name: ['', [Validators.required]],
        minutes: ['', [Validators.required]],
        step: last
      })
    )
  }

  send() {
    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    if (controlArray.status == "VALID") {
      controlArray.controls.forEach((control, i) => {
        this.newActions[i].name = control.value.name;
        this.newActions[i].step = control.value.step;
        this.newActions[i].expectedMinutes = control.value.minutes;
      });
      this.productService.saveProduct(this.name, this.description, this.newActions).subscribe(
        data => {
          if (data)
            this._snackBar.open("Успешно добавяне на продукт!", "Затвори!")
              .afterDismissed()
              .subscribe(d => {

                // window.location.reload();
                this.productService.refreshTrigger = true;
              });
        }
      );
    }
  }

  ngOnInit(): void {
    let action = new Actions();
    action.step = 1;
    this.newActions.push(action);
    this.thisIsMyForm = new FormGroup({
      formArrayName: this.formBuilder.array([])
    })

    this.buildForm();
  }

  addNewAction() {
    let action = new Actions();
    action.step = this.newActions.length + 1;
    this.newActions.push(action)
    this.addForm(this.newActions.length);
    // 
  }

  removeAction(step: number, form: number) {
    this.newActions = this.newActions.filter(a => a.step != step);
    this.newActions.forEach(element => {
      if (element.step >= step)
        element.step--;
    });

    const controlArray = this.thisIsMyForm.get('formArrayName') as FormArray;
    controlArray.removeAt(form)
    controlArray.controls.forEach(control => {
      if (control.value.step > step)
        control.setValue({ name: control.value.name, minutes: control.value.minutes, step: --control.value.step });
    });
  }

}
export class Actions {
  id: string = "";
  name: string = "";
  expectedMinutes: number = 0;
  step: number = 0;
}

export class Product {
  id: string = "";
  name: string = "";
  description: string = "";
  actions: Actions[] = [];
}