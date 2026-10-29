import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserDto } from '@models/user-dto';

import { Observable } from 'rxjs';
import { BaseService } from './base/base-service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private httpClient = inject(HttpClient);

  public getUsers(): Observable<UserDto[]> {
    return this.httpClient.get<UserDto[]>(`${this.baseURL}/User/users`);
  }

  public getUserById(id: string): Observable<UserDto> {
    return this.httpClient.get<UserDto>(`${this.baseURL}/User/user/${id}`);
  }

  public updateUser(input: UserDto): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/User/user`, input);
  }

  public createUser(input: UserDto): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/User/user`, input);
  }


  public deleteUser(id: string): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/User/user/${id}`);
  }
}
