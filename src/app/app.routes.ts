import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./main/user/user.component').then(m => m.UserComponent),
    data: { title: 'Users' },
  },
  {
    path: 'user',
    loadComponent: () => import('./main/user/add-edit-user/add-edit-user.component')
      .then(m => m.AddEditUserComponent),
    data: { title: 'User' },
  },
];
