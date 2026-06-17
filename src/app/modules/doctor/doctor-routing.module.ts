import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorPrescComponent } from './doctor-presc/doctor-presc.component';
import { AssignLabTestsComponent } from './assign-lab-tests/assign-lab-tests.component';
import { AssignRadiologyTestsComponent } from './assign-radiology-tests/assign-radiology-tests.component';

const routes: Routes = [
    { path: 'doctor-presc', component: DoctorPrescComponent, data: { roles: 29 } },
  { path: 'doctor-list', component: DoctorListComponent, data: { roles: 30 } },
  { path: 'assign-lab-tests', component: AssignLabTestsComponent, data: { roles: 16 } },
  { path: 'assign-radiology-tests', component: AssignRadiologyTestsComponent, data: { roles: 78 } }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
