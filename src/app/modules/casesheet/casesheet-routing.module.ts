import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientCasesheetComponent } from './patient-casesheet/patient-casesheet.component';
import { LiveEntryComponent } from './live-entry/live-entry.component';
import { PrimaryConsultantComponent } from './primary-consultant/primary-consultant.component';

const routes: Routes = [
    { path: 'Patient-Casesheet', component: PatientCasesheetComponent, data: { roles: 1 } },
        { path: 'Live-Entry', component: LiveEntryComponent, data: { roles: 2 } },



  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesheetRoutingModule { }
