import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddassetComponent } from './addasset/addasset.component';
import { AddequipmentComponent } from './addequipment/addequipment.component';

import { AssetstockComponent } from './assetstock/assetstock.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';

const routes: Routes = [
  { path: 'addequipment', component: AddequipmentComponent, data: { roles: 46 } },
  { path: 'addasset', component: AddassetComponent, data: { roles: 47 } },
  { path: 'assetstock', component: AssetstockComponent, data: { roles: 48 } },
  { path: 'maintenance', component: MaintenanceComponent, data: { roles: 49 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetmanagementRoutingModule { }
