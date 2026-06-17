import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [

    { path: 'tracking', component: TrackingComponent, data: { roles: 34 } },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicensetrackingRoutingModule { }
