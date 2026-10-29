import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AddEditUserComponent implements OnInit {
    mode="Add";
    user: UserDto = new UserDto();
    private userService = inject(UserService);
    private dialog = inject(MatDialog);
    public dialogRef = inject<MatDialogRef<AddEditUserComponent>>(MatDialogRef, { optional: true });
    public data = inject<UserDto>(MAT_DIALOG_DATA, { optional: true });
    private router = inject(Router);

    ngOnInit(): void {
        if(this.data)
        {
            this.mode = "Edit";    
            this.user = this.data;
        }
    }

    save(): void {
        // Keep finite writes independent of the dialog or routed form lifetime.
        if(this.mode=='Add')
        {
            this.userService.createUser(this.user).subscribe(
                () => {
                    this.cancel();
                    this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Success',
                        message: 'Successfully added user.'
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
        else
        {
            this.userService.updateUser(this.user).subscribe(
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
