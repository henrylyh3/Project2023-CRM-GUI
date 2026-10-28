import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './confirmation-dialog-component';

describe('Delete confirmation dialog', () => {
  let dialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [MatDialogModule, MatButtonModule, NoopAnimationsModule],
      providers: [provideZoneChangeDetection(),
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Delete', message: 'Delete this contact?' } },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    });
  });

  it('displays the confirmation and returns true for Confirm', () => {
    const fixture = TestBed.createComponent(ConfirmationDialogComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Delete this contact?');
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.textContent?.trim() === 'Confirm')!.click();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('returns false for Cancel', () => {
    const fixture = TestBed.createComponent(ConfirmationDialogComponent);
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.textContent?.trim() === 'Cancel')!.click();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
