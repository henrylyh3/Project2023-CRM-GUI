import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

import { UserDto } from '@models/user-dto';
import { UserService } from '@services/user.service';
import {NgFor} from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

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
      header: 'userName',
      cell: (element: UserDto) => `${element.userName}`,
    },
    {
      columnDef: 'email',
      header: 'email',
      cell: (element: UserDto) => `${element.email}`,
    },
    {
      columnDef: 'phone',
      header: 'phone',
      cell: (element: UserDto) => `${element.phone}`,
    },
    {
      columnDef: 'skills',
      header: 'skills',
      cell: (element: UserDto) => `${element.skills}`,
    },
    {
      columnDef: 'hobbies',
      header: 'hobbies',
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
  }

}

