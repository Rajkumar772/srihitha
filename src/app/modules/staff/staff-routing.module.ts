import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';

const routes: Routes = [
  { path: 'add-staff', component: AddStaffComponent, data: {roles:27} },

  { path: 'staff-list', component: StaffListComponent, data: {roles:28} },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
