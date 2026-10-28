import { Component, OnInit, ViewChild, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

import { UserDto } from '@models/user-dto';
import { UserService } from '@services/user.service';
import { ConfirmationDialogService } from '@services/confirmation-dialog-service';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AlertDialogComponent } from '@main/common/alert-dialog.component'; 

@Component({
    selector: 'CRM-user',
    templateUrl: './user.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatTableModule,
      MatPaginatorModule,
    ]
})
export class UserComponent implements OnInit {

  columns = [
    {
      columnDef: 'userName',
      header: 'Name',
      cell: (element: UserDto) => `${element.userName}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: UserDto) => `${element.email}`,
    },
    {
      columnDef: 'phone',
      header: 'Phone',
      cell: (element: UserDto) => `${element.phone}`,
    },
    {
      columnDef: 'skills',
      header: 'Skills',
      cell: (element: UserDto) => `${element.skills}`,
    },
    {
      columnDef: 'hobbies',
      header: 'Hobbies',
      cell: (element: UserDto) => `${element.hobbies}`,
    },
  ];
  filter='';
  dataSource : any;
  displayedColumns = this.columns.map(c => c.columnDef);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private confirmationDialogService = inject(ConfirmationDialogService);
  public dialog = inject(MatDialog);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((result) => {
      this.dataSource = new MatTableDataSource<UserDto>(result);
      this.dataSource.paginator = this.paginator;
    });
  }
  
  applyFilter() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEditUserComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  openEditDialog(input: number): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: this.dataSource.filteredData[input],
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }


  delete(input: number): void {
    this.confirmationDialogService
    .openConfirmationDialog('Delete', 'Are you sure you want to proceed?')
    .subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(this.dataSource.filteredData[input].id).subscribe(
          () => {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                  width: '250px',
                  data: {
                  title: 'Success',
                  message: 'Successfully delete user.'
                  }
              });
              dialogRef.afterClosed().subscribe(() => {
                this.getUsers();
              });
          },
          () => {
              this.dialog.open(AlertDialogComponent, {
                  width: '250px',
                  data: {
                  title: 'Error',
                  message: 'Failed to delete user.'
                  }
              });
          },
      );
      }
    });

    
  }

}

