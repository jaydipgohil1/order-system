import { Component, Inject, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Category, DialogData } from '../interface/products.interface';
import { NotificationService } from '../services/notification.service';
import { ProductsService } from '../services/products.service';
import { SharedService } from '../services/shared.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  categories: Category[] = [];
  displayedColumns: string[] = ['no', 'category_name', "actions"];
  dataSource = new MatTableDataSource<Category>(this.categories);
  selectedCategory: Category | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private productsService: ProductsService,
    public notificationService: NotificationService,
    private sharedService: SharedService,
    public dialog: MatDialog,
  ) {
    this.sharedService.setIsAuthentic('Category');
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.sharedService.deleteDialogResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => {
        if (show.component === this.constructor.name && show.confirm) this.deleteCategory();
      })
  }

  getCategoryList(): void {
    try {
      this.productsService.getCategoryList().subscribe((category) => {
        if (!category.data) return;
        this.categories = category.data;
        this.loadData();
      });
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  loadData(): void {
    this.dataSource = new MatTableDataSource<Category>(this.categories);
    this.dataSource.paginator = this.paginator;
  }


  openAddCategoryDialog(element: null | Category = null): void {
    const dialogRef = this.dialog.open(CategoryDialog, {
      data: { isUpdate: element ? true : false, category_name: element ? element.category_name : '' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || !result.category_name) return;
      try {
        if (element) {
          if (element.category_name === result.category_name) return;
          this.productsService.updateCategory(
            element._id as string,
            { category_name: result.category_name },
          ).subscribe((category) => {
            if (!category.data || !category?.data?.modifiedCount) return;
            element.category_name = result.category_name;
            this.notificationService.showSuccess('Category Updated Successfully!');
          })
        }
        else {
          this.productsService.addCategory(
            { category_name: result.category_name },
          ).subscribe((category) => {
            if (!category.data.category_name) return;
            this.categories.unshift(category.data);
            this.loadData();
            this.notificationService.showSuccess('Category Added Successfully!');
          })
        }
      } catch (error: any) {
        this.notificationService.showError('Something went wrong:' + error);
      }
    });
  }


  public openDeleteModel(element: Category): void {
    this.selectedCategory = element;
    this.sharedService.setIsDeleteDialogShow(true, this.constructor.name);
  }

  deleteCategory(): void {
    if (!this.selectedCategory?._id) return;
    try {
      this.productsService.deleteCategory(
        this.selectedCategory._id as string
      ).subscribe((category) => {
        if (!category.data || !category?.data?.deletedCount) return;
        this.notificationService.showSuccess('Category deleted Successfully!');
        const indexToRemove = this.categories.findIndex(category => category._id == this.selectedCategory?._id);
        if (indexToRemove !== -1) {
          this.categories.splice(indexToRemove, 1);
          this.loadData();
        }
      })
    } catch (error: any) {
      this.notificationService.showError('Something went wrong:' + error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

NgModule({
  declarations: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule
  ]
})
@Component({
  selector: 'category-dialog',
  templateUrl: 'category-dialog.html',
  styleUrls: ['./category.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class CategoryDialog {
  constructor(
    public dialogRef: MatDialogRef<CategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }

}
