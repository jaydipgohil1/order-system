import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DeleteDialogComponent } from 'src/shared/common/delete-dialog/delete-dialog.component';
import { IDialogComponent } from 'src/shared/common/i-dialog/i-dialog.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { MaterialModule } from './material/material.module';
import { AddUpdateOrderComponent } from './order/add-update-order/add-update-order.component';
import { OrderComponent } from './order/order.component';
import { AddUpdateProductComponent } from './product/add-update-product/add-update-product.component';
import { ProductComponent } from './product/product.component';


@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    ProductComponent,
    AddUpdateProductComponent,
    OrderComponent,
    AddUpdateOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    DeleteDialogComponent,
    IDialogComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
