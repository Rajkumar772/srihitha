import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisteremployeeComponent } from './registeremployee/registeremployee.component';

const routes: Routes = [
    { path: 'registeremployee', component: RegisteremployeeComponent, data: { roles: 51 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousekeepingRoutingModule { }
