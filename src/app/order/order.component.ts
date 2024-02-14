import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../interface/products.interface';
import { IDialogData } from '../interface/shared.interface';
import { IDialogService } from '../services/i-dialog.service';
import { NotificationService } from '../services/notification.service';
import { SharedService } from '../services/shared.service';
import { AddUpdateOrderComponent } from './add-update-order/add-update-order.component';
import { OrderService } from '../services/order.service';
import { ProductsService } from '../services/products.service';
import { CustomersService } from '../services/customer.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  orders: any[] = [];
  customer: any[] = [];
  products: any[] = [];
  displayedColumns: string[] =
    [
      'no',
      'orderId',
      'orderDate',
      "productName",
      'orderDetailQuantity',
      'orderDetailUnitPrice',
      'orderTotalAmount',
      'customerName',
      'customerEmail',
      'customerPhone',
      'actions'
    ];

  dataSource = new MatTableDataSource<Product>(this.orders);
  selectedProduct: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private customersService: CustomersService,
    private productsService: ProductsService,
    public notificationService: NotificationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private iDialogService: IDialogService
  ) {
    this.sharedService.setIsAuthentic('Orders');
  }

  ngOnInit(): void {
    this.getOrdersList();
    this.getCustomerList();
    this.getProductList();
    this.sharedService.deleteDialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        if (show.component === this.constructor.name && show.confirm) this.deleteCustomer();
      })

    this.iDialogService.dialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IDialogData | null) => {
        if (!result) return;
        if (result?.component == "AddUpdateOrderComponent")
          this.openSaveChanges(result.isUpdate ? this.selectedProduct : null, result);
      })
  }

  getCustomerList() {
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

  getProductList() {
    try {
      this.productsService.getProductsList().subscribe((product) => {
        if (!product.data) return;
        this.products = product.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  getOrdersList(): void {
    try {
      this.orderService.getOrdersList().subscribe((product) => {
        if (!product.data) return;
        this.orders = product.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource<Product>(this.orders);
    this.dataSource.paginator = this.paginator;
  }

  public openAddProductDialog(element: any | null, title = 'Make Order'): void {
    this.selectedProduct = element;

    if (element)
      this.iDialogService.setDialogShow(true, title, AddUpdateOrderComponent, true, { products: this.products, customers: this.customer, element });
    else
      this.iDialogService.setDialogShow(true, title, AddUpdateOrderComponent, false, { products: this.products, customers: this.customer });

    if (!this.customer.length)
      this.notificationService.showWarning('There is No customer found, please Add customer');
    if (!this.products.length)
      this.notificationService.showWarning('There is No product found, please Add product');
  }

  openSaveChanges(element: any | Product = null, result: IDialogData | any = null): void {
    if (!result || !result.form.valid) return;
    try {
      if (element) {
        this.orderService.updateOrder(
          element.orderId as string,
          result.form.value,
        ).subscribe((customer) => {
          if (!customer.success) return;
          this.getOrdersList();
          this.notificationService.showSuccess('Customer Updated Successfully!');
        })
      }
      else {
        this.orderService.addOrder(
          result.form.value,
        ).subscribe((customer) => {
          if (!customer.success) return;
          this.getOrdersList();
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
    if (!this.selectedProduct?.orderId) return;
    try {
      this.orderService.deleteOrder(
        this.selectedProduct.orderId as string
      ).subscribe((customer) => {
        if (!customer.success) return;
        this.notificationService.showSuccess('Order deleted Successfully!');
        const indexToRemove = this.orders.findIndex(customer => customer.orderId == this.selectedProduct?.orderId);
        if (indexToRemove !== -1) {
          this.orders.splice(indexToRemove, 1);
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
