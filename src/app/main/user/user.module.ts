import { NgModule } from '@angular/core';
// import { SharedModule } from '@shared';

// import { NzModalRef } from 'ng-zorro-antd/modal';

import { UserComponent} from './user/user.component';
import { AddEditUserComponent} from './user/add-edit-user/add-edit-user.component';
import { UserRoutingModule} from './user-routing.module';


import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog'; 
import { MatTable } from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';


import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddEditUserComponent,
    UserComponent,
    
    
  ],
  imports: [
    UserRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatPaginatorModule,
    
    MatSortModule,
    MatTableModule,
  ],
  // imports: [SharedModule, ContentRoutingModule, EditorModule],
})
export class UserModule { }
