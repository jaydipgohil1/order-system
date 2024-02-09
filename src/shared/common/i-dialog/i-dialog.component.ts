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
import { IDialogService } from 'src/app/services/i-dialog.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { IDialogData } from 'src/app/interface/shared.interface';


@Component({
  selector: 'i-dialog',
  standalone: true,
  template: '',
  styleUrls: ['./i-dialog.component.scss'],
})
export class IDialogComponent {
  constructor(
    public dialog: MatDialog,
    private iDialogService: IDialogService) { }

  ngOnInit(): void {
    this.iDialogService.isDialogShow$.subscribe(show => {
      if (show.show) this.openDialog(show);
    })
  }

  openDialog(iDialogData: IDialogData): void {
    const dialogRef = this.dialog.open(IDialog, {
      data: { ...iDialogData },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.iDialogService.setDialogResult(result);
    });
  }
}

NgModule({
  declarations: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
  ]
})
@Component({
  selector: 'i-dialog',
  templateUrl: 'i-dialog.component.html',
  styleUrls: ['./i-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
})
export class IDialog {
  CompleteComponent: any = null;

  constructor(
    public dialogRef: MatDialogRef<IDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
  ) {
    this.CompleteComponent = this.data.component;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
