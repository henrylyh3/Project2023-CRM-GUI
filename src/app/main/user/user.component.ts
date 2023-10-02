import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

import { UserDto } from '@models/user-dto';
import { UserService } from '@services/user.service';
import { ConfirmationDialogService } from '@services/confirmation-dialog-service';
import {NgFor} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { AlertDialogComponent } from '@main/common/alert-dialog.component'; 

@Component({
  selector: 'CRM-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements OnInit {
 isBusy = true;

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

  selectedUser: UserDto;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService : UserService
   ) { }

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

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

  openEditDialog(input: number): void {
    var result = new UserDto();
    result= this.dataSource.filteredData[input];

    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: this.dataSource.filteredData[input],
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }


  delete(input: number): void {
    console.log(this.dataSource.filteredData[input]);
    this.confirmationDialogService
    .openConfirmationDialog('Delete', 'Are you sure you want to proceed?')
    .subscribe((confirmed) => {
      if (confirmed) {
        // User confirmed, proceed with the action
        // Add your action here
        console.log('User confirmed');
        this.userService.deleteUser(this.dataSource.filteredData[input].id).subscribe(
          () => {
              // this.dialogRef.close();
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                  width: '250px',
                  data: {
                  title: 'Success',
                  message: 'Successfully delete user.'
                  }
              });
              dialogRef.afterClosed().subscribe(result => {
                this.getUsers();
              });
          },
          (error) => {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                  width: '250px',
                  data: {
                  title: 'Error',
                  message: 'Failed to delete user.'
                  }
              });
          },
      );
      } else {
        // User canceled
        console.log('User canceled');
      }
    });

    
  }

}

