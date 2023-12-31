import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren:()=> import('./main/universal.module').then((m)=> m.UniversalModule)
  },
  // {
  //   path: 'customers',
  //   loadChildren:()=> import('./main/customer/customers.module').then((m)=> m.CustomersModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
