import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category, ProductDialogData } from 'src/app/interface/products.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { IDialog } from 'src/shared/common/i-dialog/i-dialog.component';

@Component({
  selector: 'app-add-update-customer',
  templateUrl: './add-update-customer.component.html',
  styleUrls: ['./add-update-customer.component.css']
})
export class AddUpdateCustomerComponent {
  customerForm: FormGroup;
  categories: Category[] = [];

  constructor(
    public dialogRef: MatDialogRef<IDialog>,
    private fb: FormBuilder,
    private router: Router,
    public notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData,
  ) {
    if (!data.isUpdate) {
      this.customerForm = this.fb.group({
        customerName: ['', [Validators.required, Validators.maxLength(30)]],
        customerEmail: ['', [Validators.required, Validators.email]],
        customerPhone: [null, Validators.pattern("^((\\+91)|(0091))-{0,1}\\d{3}-{0,1}\\d{6}$|^\\d{10}$|^\\d{4}-\\d{6}$")],
        customerAddress: [null],
      });
    } else {
      const formValue = this.data?.data?.element;
      this.customerForm = this.fb.group({
        customerName: [formValue.customerName, [Validators.required, Validators.maxLength(30)]],
        customerEmail: [formValue.customerEmail, [Validators.required, Validators.email]],
        customerPhone: [formValue.customerPhone || null, Validators.pattern("^((\\+91)|(0091))-{0,1}\\d{3}-{0,1}\\d{6}$|^\\d{10}$|^\\d{4}-\\d{6}$")],
        customerAddress: [formValue.customerAddress || null],
      });
    }
    this.categories = this.data?.data?.categories;
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  onSaveClick(): void {
    this.data = {
      ...this.data,
      form: this.customerForm,
      component: this.data.component.name
    }
    this.dialogRef.close(this.data);
  }

  public addCategory() {
    this.router.navigate(['/category']);
    this.onNoClick();
  }
}
