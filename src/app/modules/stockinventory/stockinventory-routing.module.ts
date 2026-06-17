import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditemsstockComponent } from './additemsstock/additemsstock.component';
import { InventorypurchadseComponent } from './inventorypurchadse/inventorypurchadse.component';
import { StoreinventorypurchasereportComponent } from './storeinventorypurchasereport/storeinventorypurchasereport.component';

const routes: Routes = [
  { path: 'additemsstock', component: AdditemsstockComponent, data: { roles: 63 } },
  { path: 'inventorypurchadse', component: InventorypurchadseComponent, data: { roles: 64 } },
  { path: 'storeinventorypurchasereport', component: StoreinventorypurchasereportComponent, data: { roles: 65 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockinventoryRoutingModule { }
