import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { RegisterComponent } from './components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/* Angular material */
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { AllusersComponent } from './allusers/allusers.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

import { MatStepperModule } from '@angular/material/stepper';
import { TableFilteringExampleComponent } from './components/table-filtering-example/table-filtering-example.component';
import { SidenavDrawerOverviewExample } from './components/sidenav-drawer-overview-example/sidenav-drawer-overview-example.component';
import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { BoxCreateComponent } from './components/box-create/box-create.component';
import { ContentCreateComponent } from './components/content-create/content-create.component';
import { HallgridComponent } from './components/hallgrid/hallgrid.component';
import { HalltableComponent } from './components/halltable/halltable.component';
import { HalleditComponent } from './components/halledit/halledit.component';
import { OrderStepperComponent } from './components/order/order-stepper/order-stepper.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { OrderHistoryComponent } from './components/order/order-history/order-history.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPageComponent } from './components/product/product-page/product-page.component';
import { OrderPageComponent } from './components/order/order-page/order-page.component';
import { ActionstatusesTableComponent } from './components/order/actionstatuses-table/actionstatuses-table.component';
import { ActionstatusesDialogComponent } from './components/order/actionstatuses-dialog/actionstatuses-dialog.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { StompService } from './services/stomp.service';
import { CommentsDialogComponent } from './components/order/comments-dialog/comments-dialog.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { GalleryComponent } from './components/order/gallery/gallery.component';
import { TaskPageComponent } from './components/task/task-page/task-page.component';
import { TaskHistoryComponent } from './components/task/task-history/task-history.component';
import { TaskCreateComponent } from './components/task/task-create/task-create.component';
import { LastphotoDialogComponent } from './components/order/lastphoto-dialog/lastphoto-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavComponent } from './components/nav/nav.component';
import { InterceptorService } from './services/loader/interceptor.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorCatchingService } from './services/error/error-catching.service';
import { ErrorDialogComponent } from './services/error/error-dialog/error-dialog.component';
import { StockPageComponent } from './components/stock/stock-page/stock-page.component';
import { StockCreateComponent } from './components/stock/stock-create/stock-create.component';
import { StockHistoryComponent } from './components/stock/stock-history/stock-history.component';
import { StockEditDialogComponent } from './components/stock/stock-edit-dialog/stock-edit-dialog.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    HomeComponent,
    AllusersComponent,
    DialogComponent,
    TableFilteringExampleComponent,
    SidenavDrawerOverviewExample,
    ProductCreateComponent,
    BoxCreateComponent,
    ContentCreateComponent,
    HallgridComponent,
    HalltableComponent,
    HalleditComponent,
    OrderStepperComponent,
    StatisticsComponent,
    OrderHistoryComponent,
    UserEditComponent,
    ProductListComponent,
    ProductPageComponent,
    OrderPageComponent,
    ActionstatusesTableComponent,
    ActionstatusesDialogComponent,
    CommentsDialogComponent,
    GalleryComponent,
    TaskPageComponent,
    TaskHistoryComponent,
    TaskCreateComponent,
    LastphotoDialogComponent,
    NavComponent,
    ErrorDialogComponent,
    StockPageComponent,
    StockCreateComponent,
    StockHistoryComponent,
    StockEditDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatTableModule,
    RouterModule,
    MatStepperModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      percent: 0,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#CC0000",
      innerStrokeColor: "#C7E596",
      animationDuration: 150,
      subtitle: 'Прогрес',
      subtitleFontSize: '15',
      animation: false,
      responsive: true,
      renderOnClick: false,
    })
  ],

  providers: [StompService,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }