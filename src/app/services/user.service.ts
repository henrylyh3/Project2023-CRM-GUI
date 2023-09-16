import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '@models/user-dto';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base/base-service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  public getUsers(): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/User/users`).pipe(
      map((result: any) => {
        return result;
      }),
    );
  }

  public getUserById(id: string): Observable<UserDto> {
    return this.httpClient.get(`${this.baseURL}/User/user/${id}`).pipe(
      map((result: any) => {
        return result;
      }),
    );
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
