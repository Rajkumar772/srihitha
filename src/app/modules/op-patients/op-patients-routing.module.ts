import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPatientsComponent } from './add-patients/add-patients.component';
import { OpPatientsListComponent } from './op-patients-list/op-patients-list.component';
import { AddDoctorsComponent } from './add-doctors/add-doctors.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';

import { ConsulationfeeComponent } from './consulationfee/consulationfee.component';
import { CardtypeComponent } from './cardtype/cardtype.component';

const routes: Routes = [
  { path: 'consulationfee', component: ConsulationfeeComponent, data: { roles: 36 } },
  { path: 'cardtype', component: CardtypeComponent, data: { roles: 37 } },
  { path: 'add-patient', component: AddPatientsComponent, data: { roles: 9 } },
  { path: 'op-patients-list', component: OpPatientsListComponent, data: { roles: 10 } },
  { path: 'add-doctors', component: AddDoctorsComponent, data: { roles: 11 } },
  { path: 'doctors-list', component: DoctorsListComponent, data: { roles: 12 } },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpPatientsRoutingModule { }
