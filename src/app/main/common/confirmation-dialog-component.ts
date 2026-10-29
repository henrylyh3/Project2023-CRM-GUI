import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-raised-button color="secondary" (click)="onCancelClick()">Cancel</button>
      <button mat-button mat-raised-button color="primary" (click)="onConfirmClick()">Confirm</button>
    </mat-dialog-actions>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatButtonModule]
})
export class ConfirmationDialogComponent {
  public data = inject<any>(MAT_DIALOG_DATA);
  public dialogRef = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
