import { provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';
import { delay, of } from 'rxjs';
import { UniversalModule } from '../universal.module';
import { UserComponent } from './user.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserService } from '@services/user.service';
import { ConfirmationDialogService } from '@services/confirmation-dialog-service';
import { UserDto } from '@models/user-dto';

describe('CRM user list', () => {
  let fixture: ComponentFixture<UserComponent>;
  let service: jasmine.SpyObj<UserService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let confirmation: jasmine.SpyObj<ConfirmationDialogService>;
  const users: UserDto[] = Array.from({ length: 12 }, (_, index) => ({
    id: `user-${index + 1}`, userName: `Person ${index + 1}`,
    email: `person${index + 1}@example.com`, phone: '0123456789',
    skills: 'Angular', hobbies: 'Hiking',
  }));

  beforeEach(async () => {
    service = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser']);
    service.getUsers.and.returnValue(of(users).pipe(delay(0)));
    service.deleteUser.and.returnValue(of(null));
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as any);
    confirmation = jasmine.createSpyObj('ConfirmationDialogService', ['openConfirmationDialog']);
    confirmation.openConfirmationDialog.and.returnValue(of(true));
    TestBed.configureTestingModule({
      imports: [UniversalModule, NoopAnimationsModule],
      providers: [provideZoneChangeDetection(),provideRouter([]), { provide: UserService, useValue: service }],
    });
    TestBed.overrideProvider(MatDialog, { useValue: dialog });
    TestBed.overrideProvider(ConfirmationDialogService, { useValue: confirmation });
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function rows(): HTMLTableRowElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('tr.mat-mdc-row'));
  }

  it('renders all contact fields and paginates results', async () => {
    expect(rows().length).toBe(5);
    expect(rows()[0].textContent).toContain('person1@example.com');
    fixture.componentInstance.paginator.pageSize = 5;
    fixture.componentInstance.paginator.firstPage();
    fixture.componentInstance.paginator.page.emit({ pageIndex: 0, pageSize: 5, length: 12 });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(rows().length).toBe(5);
    fixture.componentInstance.paginator.nextPage();
    fixture.detectChanges();
    expect(rows()[0].textContent).toContain('Person 6');
  });

  it('filters contacts case-insensitively', () => {
    fixture.componentInstance.filter = ' PERSON12@EXAMPLE.COM ';
    fixture.componentInstance.applyFilter();
    fixture.detectChanges();
    expect(rows().length).toBe(1);
    expect(rows()[0].textContent).toContain('Person 12');
  });

  it('opens the add dialog and refreshes after closing', () => {
    fixture.componentInstance.openAddDialog();
    expect(dialog.open).toHaveBeenCalledWith(AddEditUserComponent);
    expect(service.getUsers).toHaveBeenCalledTimes(2);
  });

  it('opens edit for the selected contact', () => {
    fixture.componentInstance.openEditDialog(1);
    expect(dialog.open).toHaveBeenCalledWith(AddEditUserComponent, { data: users[1] });
  });

  it('deletes only after confirmation, then refreshes', () => {
    fixture.componentInstance.delete(1);
    expect(confirmation.openConfirmationDialog).toHaveBeenCalled();
    expect(service.deleteUser).toHaveBeenCalledWith('user-2');
    expect(service.getUsers).toHaveBeenCalledTimes(2);
  });

  it('keeps the contact when confirmation is cancelled', () => {
    confirmation.openConfirmationDialog.and.returnValue(of(false));
    fixture.componentInstance.delete(1);
    expect(service.deleteUser).not.toHaveBeenCalled();
  });
});
