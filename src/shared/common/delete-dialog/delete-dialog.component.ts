import { Component, Inject, NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedService } from 'src/app/services/shared.service';

export interface DialogData {
  category_name: string;
  isUpdate: boolean;
}

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.isDeleteDialogShow$.subscribe(show => {
      if (show.show) this.openDialog(show.component);
    })
  }

  openDialog(component: string): void {
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: { component: component },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.sharedService.setDeleteDialogResult(true, result.component);
    });
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
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
  styleUrls: ['./delete-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DeleteDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.data);
  }
}
