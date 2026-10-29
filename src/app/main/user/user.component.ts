import { Component, OnInit, ViewChild, ChangeDetectionStrategy, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  readonly filter = signal('');
  readonly users = signal<UserDto[]>([]);
  readonly totalUsers = computed(() => this.users().length);
  readonly dataSource = new MatTableDataSource<UserDto>([]);
  displayedColumns = this.columns.map(c => c.columnDef);
  columnsToDisplayWithExpand = [...this.displayedColumns, 'action'];

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  private confirmationDialogService = inject(ConfirmationDialogService);
  public dialog = inject(MatDialog);
  private userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.dataSource.data = this.users();
      this.dataSource.filter = this.filter().trim().toLowerCase();
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      this.users.set(result);
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddEditUserComponent);

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.getUsers();
    });
  }

  openEditDialog(user: UserDto): void {
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: { ...user },
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.getUsers();
    });
  }


  delete(user: UserDto): void {
    this.confirmationDialogService
    .openConfirmationDialog('Delete', 'Are you sure you want to proceed?')
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((confirmed) => {
      if (confirmed) {
        // Keep this finite write subscribed even if the list is destroyed.
        this.userService.deleteUser(user.id).subscribe(
          () => {
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                  width: '250px',
                  data: {
                  title: 'Success',
                  message: 'Successfully delete user.'
                  }
              });
              dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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

