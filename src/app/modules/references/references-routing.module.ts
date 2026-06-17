import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferlistComponent } from './referlist/referlist.component';
import { RefhospitalcountsComponent } from './refhospitalcounts/refhospitalcounts.component';

const routes: Routes = [
    { path: 'referlist', component: ReferlistComponent, data: { roles: 32 } },
    { path: 'refhospitalcounts', component: RefhospitalcountsComponent, data: { roles: 33 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferencesRoutingModule { }
