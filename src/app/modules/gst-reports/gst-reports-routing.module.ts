import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GstReportsComponent } from './gst-reports/gst-reports.component';

const routes: Routes = [

  { path: 'gst-reports', component: GstReportsComponent, data: { roles: 92 } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GstReportsRoutingModule { }
 