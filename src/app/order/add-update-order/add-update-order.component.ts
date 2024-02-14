import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Category, ProductDialogData } from 'src/app/interface/products.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { IDialog } from 'src/shared/common/i-dialog/i-dialog.component';
import * as _moment from 'moment';
@Component({
  selector: 'app-add-update-order',
  templateUrl: './add-update-order.component.html',
  styleUrls: ['./add-update-order.component.css'],
})
export class AddUpdateOrderComponent {
  orderForm: FormGroup;
  categories: Category[] = [];
  customers: any[] = [];
  products: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<IDialog>,
    private fb: FormBuilder,
    private router: Router,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
  ) {
    if (!data.isUpdate) {
      this.orderForm = this.fb.group({
        customerId: ['', Validators.required],
        productId: ['', Validators.required],
        orderDetailQuantity: ['', Validators.required],
        orderDetailUnitPrice: [0, [Validators.required]],
        orderDate: [new Date(), Validators.required],
      });
    } else {
      const formValue = this.data?.data?.element;
      this.orderForm = this.fb.group({
        customerId: [formValue.customerId, Validators.required],
        productId: [formValue.productId, Validators.required],
        orderDetailQuantity: [formValue.orderDetailQuantity, Validators.required],
        orderDetailUnitPrice: [formValue.orderDetailUnitPrice, Validators.required],
        orderDate: [formValue.orderDate || new Date(), Validators.required],
      });
    }
    // this.orderForm.controls['orderDetailUnitPrice'].disable();
    this.products = this.data?.data?.products;
    this.customers = this.data?.data?.customers;
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSaveClick(): void {
    if (this.orderForm.value.orderDetailQuantity <= 0) {
      this.notificationService.showError('Order Quantity Must Be greater than 0');
      return
    }
    this.data = {
      ...this.data,
      form: this.orderForm,
      component: this.data.component.name
    }
    this.dialogRef.close(this.data);
  }

  public addCategory() {
    this.router.navigate(['/category']);
    this.onNoClick();
  }

  changeProduct(event: any): void {
    let product = this.products.find(p => p.productId == event);
    this.orderForm.value.orderDetailUnitPrice = product.productSellingPrice;
    this.orderForm.patchValue({ orderDetailUnitPrice: product.productSellingPrice })
  }
}
