import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpdaccountsreportComponent } from './opdaccountsreport/opdaccountsreport.component';
import { PatientAllBillsComponent } from './patient-all-bills/patient-all-bills.component';

const routes: Routes = [
  { path: 'opdaccountsreport', component: OpdaccountsreportComponent, data: { roles: 35 } },
  { path: 'patient-all-bills', component: PatientAllBillsComponent, data: { roles: 76 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
