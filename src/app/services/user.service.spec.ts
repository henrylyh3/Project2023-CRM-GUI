import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { UserDto } from '@models/user-dto';

describe('UserService API contract', () => {
  let service: UserService;
  let http: HttpTestingController;
  const user: UserDto = {
    id: 'user-1', userName: 'Henry', email: 'henry@example.com',
    phone: '0123456789', skills: 'Angular', hobbies: 'Hiking',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr()), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the user list without changing the endpoint or response', () => {
    service.getUsers().subscribe(users => expect(users).toEqual([user]));
    const request = http.expectOne(`${service.baseURL}/User/users`);
    expect(request.request.method).toBe('GET');
    request.flush([user]);
  });

  it('loads a user by ID', () => {
    service.getUserById(user.id).subscribe(result => expect(result).toEqual(user));
    const request = http.expectOne(`${service.baseURL}/User/user/${user.id}`);
    expect(request.request.method).toBe('GET');
    request.flush(user);
  });

  it('creates a user with the original payload', () => {
    service.createUser(user).subscribe();
    const request = http.expectOne(`${service.baseURL}/User/user`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(user);
    request.flush(user);
  });

  it('updates a user with the original payload', () => {
    service.updateUser(user).subscribe();
    const request = http.expectOne(`${service.baseURL}/User/user`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(user);
    request.flush(user);
  });

  it('deletes the selected user by ID', () => {
    service.deleteUser(user.id).subscribe();
    const request = http.expectOne(`${service.baseURL}/User/user/${user.id}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('passes backend errors to the caller', () => {
    service.createUser(user).subscribe({
      next: () => fail('Expected backend error'),
      error: error => expect(error.status).toBe(400),
    });
    http.expectOne(`${service.baseURL}/User/user`).flush('Invalid user', {
      status: 400, statusText: 'Bad Request',
    });
  });
});
