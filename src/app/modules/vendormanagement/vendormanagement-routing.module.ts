import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorsComponent } from './vendors/vendors.component';

const routes: Routes = [
  { path: "vendors", component: VendorsComponent, data: { roles: 45 } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendormanagementRoutingModule { }
