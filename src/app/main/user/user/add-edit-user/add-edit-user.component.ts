import { finalize } from 'rxjs/operators';

import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';

import { UserDto } from '@models/user-dto';
@Component({
    selector: 'CRM-add-edit-user',
    templateUrl: './add-edit-user.component.html',
    styles: [],
})
export class AddEditUserComponent implements OnInit {
    mode="Add";

    constructor(
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<AddEditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserDto,
    ) { }

    ngOnInit(): void {
      
    }
}
