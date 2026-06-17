import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpdrecordsComponent } from './opdrecords/opdrecords.component';
import { IpdreportsComponent } from './ipdreports/ipdreports.component';

const routes: Routes = [
  { path: 'opdrecords', component: OpdrecordsComponent, data: { roles: 42 } },
  { path: 'ipdreports', component: IpdreportsComponent, data: { roles: 43 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalrecordsRoutingModule { }
