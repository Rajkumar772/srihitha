import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { VideocallComponent } from './videocall/videocall.component';

const routes: Routes = [
  { path: 'doctor', component: DoctorComponent, data: { roles: 110 } },
  { path: 'patient', component: PatientComponent, data: { roles: 111 } },
  { path: 'videocall', component: VideocallComponent, data: { roles: 112 } },
  { path: '', redirectTo: 'doctor', pathMatch: 'full' },
  { path: '**', redirectTo: 'doctor' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineconsultancyRoutingModule { }
