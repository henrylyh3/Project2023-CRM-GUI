import { finalize } from 'rxjs/operators';

import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

import { UserDto } from '@models/user-dto';
import { UserService } from '@services/user.service';
import { AlertDialogComponent } from '@main/common/alert-dialog.component'; // Adjust the path

@Component({
    selector: 'CRM-add-edit-user',
    templateUrl: './add-edit-user.component.html',
    styles: [],
})
export class AddEditUserComponent implements OnInit {
    mode="Add";
    user: UserDto = new UserDto();
    constructor(
        private formBuilder: FormBuilder,
        private userService : UserService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<AddEditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserDto,
    ) {

     }

    ngOnInit(): void {
        if(this.data)
        {
            this.mode = "Edit";    
            this.user = this.data;
        }
    }

    save(): void {
        if(this.mode=='Add')
        {
            this.userService.createUser(this.user).subscribe(
                () => {
                    this.dialogRef.close();
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Success',
                        message: 'Successfully added user.'
                        }
                    });
                },
                (error) => {
                    this.dialogRef.close();
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
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
                    this.dialogRef.close();
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
                        width: '250px',
                        data: {
                        title: 'Success',
                        message: 'Successfully updated user.'
                        }
                    });
                },
                (error) => {
                    this.dialogRef.close();
                    const dialogRef = this.dialog.open(AlertDialogComponent, {
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
        this.dialogRef.close();
    }
}
