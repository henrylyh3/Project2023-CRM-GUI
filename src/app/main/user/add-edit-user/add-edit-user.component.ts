import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UserDto } from '@models/user-dto';
import { UserService } from '@services/user.service';
import { AlertDialogComponent } from '@main/common/alert-dialog.component'; 

@Component({
    selector: 'CRM-add-edit-user',
    templateUrl: './add-edit-user.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AddEditUserComponent implements OnInit {
    mode="Add";
    private user: UserDto = new UserDto();
    readonly form = inject(NonNullableFormBuilder).group({
        userName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        skills: ['', Validators.required],
        hobbies: ['', Validators.required],
    });
    private userService = inject(UserService);
    private dialog = inject(MatDialog);
    public dialogRef = inject<MatDialogRef<AddEditUserComponent>>(MatDialogRef, { optional: true });
    public data = inject<UserDto>(MAT_DIALOG_DATA, { optional: true });
    private router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    constructor() {
        // Notify the OnPush view when reactive form state changes programmatically.
        this.form.events.pipe(takeUntilDestroyed()).subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    ngOnInit(): void {
        if(this.data)
        {
            this.mode = "Edit";    
            this.user = this.data;
            this.form.patchValue(this.data);
        }
    }

    save(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const user: UserDto = { ...this.user, ...this.form.getRawValue() };
        // Keep finite writes independent of the dialog or routed form lifetime.
        if(this.mode=='Add')
        {
            this.userService.createUser(user).subscribe({
                next: () => {
                    this.cancel();
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Success',
                        message: 'Successfully added user.'
                        }
                    });
                },
                error: () => {
                    this.cancel();
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Error',
                        message: 'Failed to add user.'
                        }
                    });
                },
            });
        }
        else
        {
            this.userService.updateUser(user).subscribe(
                () => {
                    this.cancel();
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Success',
                        message: 'Successfully updated user.'
                        }
                    });
                },
                () => {
                    this.cancel();
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Error',
                        message: 'Failed to add user.'
                        }
                    });
                },
            );
        }
    }

    cancel(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        } else {
            void this.router.navigateByUrl('/');
        }
    }
}
