import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category, Product } from '../interface/products.interface';
import { NotificationService } from '../services/notification.service';
import { ProductsService } from '../services/products.service';
import { SharedService } from '../services/shared.service';
import { Subject, takeUntil } from 'rxjs';
import { IDialogService } from '../services/i-dialog.service';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { IDialogData } from '../interface/shared.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  products: any[] = [];
  categories: Category[] = [];
  displayedColumns: string[] = ['no', 'productName', "productDescription", 'productCostPrice', 'productSellingPrice',
    'productQuantityInStock', 'productReorderPoint', 'actions'];

  dataSource = new MatTableDataSource<Product>(this.products);
  selectedProduct: any | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    public notificationService: NotificationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
    private iDialogService: IDialogService
  ) {
    this.sharedService.setIsAuthentic('Products');
  }

  ngOnInit(): void {
    this.getProductList();
    this.sharedService.deleteDialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        if (show.component === this.constructor.name && show.confirm) this.deleteProduct();
      })

    this.iDialogService.dialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: IDialogData | null) => {
        if (!result) return;
        if (result?.component == "AddUpdateProductComponent")
          this.openSaveChanges(result.isUpdate ? this.selectedProduct : null, result);
      })
    // this.getCategoryList();
  }

  getProductList(): void {
    try {
      this.productsService.getProductsList().subscribe((product) => {
        if (!product?.data) return;
        this.products = product.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  getCategoryList(): void {
    try {
      this.productsService.getCategoryList().subscribe((category) => {
        if (!category.data) return;
        this.categories = category.data;
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource<Product>(this.products);
    this.dataSource.paginator = this.paginator;
  }

  public openAddProductDialog(element: Product | null, title = 'Add Product'): void {
    this.selectedProduct = element;
    if (element)
      this.iDialogService.setDialogShow(true, title, AddUpdateProductComponent, true, { element });
    else
      this.iDialogService.setDialogShow(true, title, AddUpdateProductComponent, false, {});
  }

  openSaveChanges(element: null | Product = null, result: IDialogData | any = null): void {

    if (!result || !result.form.valid) return;
    try {
      if (element) {
        this.productsService.updateProduct(
          element.productId as string,
          result.form.value,
        ).subscribe((product) => {
          if (!product.success) return;

          const index = this.products.findIndex(product => product.productId == element?.productId);
          if (index !== -1) {
            this.products[index] = {
              ...this.products[index],
              ...result.form.value,
            };
            this.loadData();
          }
          this.notificationService.showSuccess('Product Updated Successfully!');
        })
      }
      else {
        this.productsService.addProduct(
          result.form.value,
        ).subscribe((product) => {
          if (!product.success) return;
          this.getProductList();
          this.notificationService.showSuccess('Product Added Successfully!');
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

  deleteProduct(): void {
    if (!this.selectedProduct?.productId) return;
    try {
      this.productsService.deleteProduct(
        this.selectedProduct.productId as string
      ).subscribe((product) => {
        if (!product.success) return;
        this.notificationService.showSuccess('Product deleted Successfully!');
        const indexToRemove = this.products.findIndex((category) => category.productId == this.selectedProduct?.productId);
        if (indexToRemove !== -1) {
          this.products.splice(indexToRemove, 1);
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
