import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStockComponent } from './add-stock/add-stock.component';

const routes: Routes = [
  {path:'add-stock',component:AddStockComponent,data:{roles: 109}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInventoryRoutingModule { }
