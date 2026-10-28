import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { UniversalModule } from '../../universal.module';
import { AddEditUserComponent } from './add-edit-user.component';
import { AlertDialogComponent } from '../../common/alert-dialog.component';
import { UserService } from '@services/user.service';
import { UserDto } from '@models/user-dto';

describe('CRM add/edit dialog', () => {
  let service: jasmine.SpyObj<UserService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddEditUserComponent>>;
  const user: UserDto = {
    id: 'user-1', userName: 'Henry', email: 'henry@example.com',
    phone: '0123456789', skills: 'Angular', hobbies: 'Hiking',
  };

  beforeEach(() => {
    service = jasmine.createSpyObj('UserService', ['createUser', 'updateUser']);
    service.createUser.and.returnValue(of(user));
    service.updateUser.and.returnValue(of(user));
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [UniversalModule, NoopAnimationsModule],
      providers: [provideZoneChangeDetection(),provideRouter([]), { provide: UserService, useValue: service },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: dialogRef }],
    });
    TestBed.overrideProvider(MatDialog, { useValue: dialog });
  });

  it('binds form values and creates a user', async () => {
    const fixture = TestBed.createComponent(AddEditUserComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[name="name"]');
    input.value = 'New contact';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.user.userName).toBe('New contact');
    fixture.componentInstance.save();
    expect(service.createUser).toHaveBeenCalledWith(fixture.componentInstance.user);
    expect(service.updateUser).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(dialog.open).toHaveBeenCalledWith(AlertDialogComponent, jasmine.objectContaining({
      data: { title: 'Success', message: 'Successfully added user.' },
    }));
  });

  it('loads existing data and updates the user', () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { ...user } });
    const fixture = TestBed.createComponent(AddEditUserComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.mode).toBe('Edit');
    expect(fixture.componentInstance.user).toEqual(user);
    fixture.componentInstance.save();
    expect(service.updateUser).toHaveBeenCalledWith(user);
    expect(service.createUser).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('cancels without saving', () => {
    TestBed.createComponent(AddEditUserComponent).componentInstance.cancel();
    expect(dialogRef.close).toHaveBeenCalled();
    expect(service.createUser).not.toHaveBeenCalled();
    expect(service.updateUser).not.toHaveBeenCalled();
  });

  it('shows an error when creating a user fails', () => {
    service.createUser.and.returnValue(throwError(() => new Error('Backend unavailable')));
    const fixture = TestBed.createComponent(AddEditUserComponent);
    fixture.componentInstance.save();
    expect(dialog.open).toHaveBeenCalledWith(AlertDialogComponent, jasmine.objectContaining({
      data: { title: 'Error', message: 'Failed to add user.' },
    }));
  });

  it('shows an error when updating a user fails', () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { ...user } });
    service.updateUser.and.returnValue(throwError(() => new Error('Backend unavailable')));
    const fixture = TestBed.createComponent(AddEditUserComponent);
    fixture.detectChanges();
    fixture.componentInstance.save();
    expect(dialog.open).toHaveBeenCalledWith(AlertDialogComponent, jasmine.objectContaining({
      data: { title: 'Error', message: 'Failed to add user.' },
    }));
  });
});
