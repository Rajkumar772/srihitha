import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeemanagenmentComponent } from './employeemanagenment/employeemanagenment.component';
import { LeavemanagenmentComponent } from './leavemanagenment/leavemanagenment.component';
import { AddingshiftsComponent } from './addingshifts/addingshifts.component';
import { HranalysisComponent } from './hranalysis/hranalysis.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  { path: 'employeemanagenment', component: EmployeemanagenmentComponent, data: { roles: 38 } },
  { path: 'leavemanagenment', component: LeavemanagenmentComponent, data: { roles: 39 } },
  { path: 'addingshifts', component: AddingshiftsComponent, data: { roles: 40 } },
  { path: 'hranalysis', component: HranalysisComponent, data: { roles: 54 } },
    { path: 'notifications', component: NotificationsComponent, data: { roles: 55 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrmoduleRoutingModule { }
