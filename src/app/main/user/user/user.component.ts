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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'CRM-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements OnInit {
 isBusy = true;

  columns = [
    {
      columnDef: 'Id',
      header: 'Id.',
      cell: (element: UserDto) => `${element.id}`,
    },
    {
      columnDef: 'userId',
      header: 'userId',
      cell: (element: UserDto) => `${element.userId}`,
    },
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
    // {
    //   columnDef: 'action',
    //   header: 'Action',
    //   // cell: (element: UserDto) => `${element.hobbies}`,
    // },
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
    // debugger;
    this.getUsers();
  }

  getUsers(): void {
    this.isBusy = true;
    const todayDate = new Date();
    this.userService.getUsers().subscribe((result) => {
      // debugger;
      console.log(result);
      this.dataSource = new MatTableDataSource<UserDto>(result);
      this.dataSource.paginator = this.paginator;

      this.isBusy = false;
    });
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;

  // }
  
  applyFilter() {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEditUserComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  // openEditDialog(): void {
  //   const dialogRef = this.dialog.open(AddEditUserComponent, {
  //     data: {name: this.selectedUser.userName, email: this.selectedUser.email},
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // this.animal = result;
  //   });
  // }
}

