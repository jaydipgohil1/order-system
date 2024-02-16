import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../interface/products.interface';
import { IDialogData } from '../interface/shared.interface';
import { CustomersService } from '../services/customer.service';
import { IDialogService } from '../services/i-dialog.service';
import { NotificationService } from '../services/notification.service';
import { SharedService } from '../services/shared.service';
import { AddUpdateCustomerComponent } from './add-update-customer/add-update-customer.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  customer: any[] = [];
  displayedColumns: string[] = ['no', 'customerName', "customerEmail", 'customerPhone', 'customerAddress', 'actions'];

  dataSource = new MatTableDataSource<Product>(this.customer);
  selectedProduct: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private customersService: CustomersService,
    public notificationService: NotificationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private iDialogService: IDialogService
  ) {
    this.sharedService.setIsAuthentic('Customers');
  }

  ngOnInit(): void {
    this.getCustomerList();
    this.sharedService.deleteDialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        if (show.component === this.constructor.name && show.confirm) this.deleteCustomer();
      })

    this.iDialogService.dialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IDialogData | null) => {
        if (!result) return;
        if (result?.component == "AddUpdateCustomerComponent")
          this.openSaveChanges(result.isUpdate ? this.selectedProduct : null, result);
      })
  }

  getCustomerList(): void {
    try {
      this.customersService.getCustomersList().subscribe((customer) => {
        if (!customer.data) return;
        this.customer = customer.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource<Product>(this.customer);
    this.dataSource.paginator = this.paginator;
  }

  public openAddProductDialog(element: any | null, title = 'Add Customer'): void {
    this.selectedProduct = element;

    if (element)
      this.iDialogService.setDialogShow(true, title, AddUpdateCustomerComponent, true, { element });
    else
      this.iDialogService.setDialogShow(true, title, AddUpdateCustomerComponent, false, {});
  }

  openSaveChanges(element: any | Product = null, result: IDialogData | any = null): void {
    if (!result || !result.form.valid) return;
    try {
      if (element) {
        this.customersService.updateCustomer(
          element.customerId as string,
          result.form.value,
        ).subscribe((customer) => {
          if (!customer.success || !customer.data) return;
          const index = this.customer.findIndex(customer => customer.customerId == element?.customerId);
          if (index !== -1) {
            this.customer[index] = {
              ...this.customer[index],
              ...result.form.value,
              ...customer.data
            };
            this.loadData();
          }
          this.notificationService.showSuccess('Customer Updated Successfully!');
        })
      }
      else {
        this.customersService.addCustomer(
          result.form.value,
        ).subscribe((customer) => {
          if (!customer.success || !customer.data) return;
          this.customer.unshift(customer.data);
          this.loadData();
          this.notificationService.showSuccess('Customer Added Successfully!');
        })
      }
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  public openDeleteModel(element: Product): void {
    this.selectedProduct = element;
    this.sharedService.setIsDeleteDialogShow(true, this.constructor.name);
  }

  deleteCustomer(): void {
    if (!this.selectedProduct?.customerId) return;
    try {
      this.customersService.deleteCustomer(
        this.selectedProduct.customerId as string
      ).subscribe((customer) => {
        if (!customer.success) return;
        this.notificationService.showSuccess('Customer deleted Successfully!');
        const indexToRemove = this.customer.findIndex(customer => customer.customerId == this.selectedProduct?.customerId);
        if (indexToRemove !== -1) {
          this.customer.splice(indexToRemove, 1);
          this.loadData();
        }
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  ngOnDestroy(): void {
    this.iDialogService.setDialogResult(null);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
