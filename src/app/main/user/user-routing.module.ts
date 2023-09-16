import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user/user.component';
import { AddEditUserComponent } from './user/add-edit-user/add-edit-user.component';
const routes: Routes = [
  { path: '', component: UserComponent, data: { title: 'Users' } },
  { path: 'user', component: AddEditUserComponent, data: { title: 'User' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
