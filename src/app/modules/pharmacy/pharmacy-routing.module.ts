import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditemsComponent } from './additems/additems.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { PurchaseitemsComponent } from './purchaseitems/purchaseitems.component';
import { PurchasereportComponent } from './purchasereport/purchasereport.component';
import { SaleitemsComponent } from './saleitems/saleitems.component';
import { SaleitemsReportsComponent } from './saleitems-reports/saleitems-reports.component';
import { PharmacyStockComponent } from './pharmacy-stock/pharmacy-stock.component';

import { PrescriptionreportComponent } from './prescriptionreport/prescriptionreport.component';
const routes: Routes = [

  { path: 'additems', component: AdditemsComponent, data: { roles: 19 } },
  { path: 'suppliers', component: SuppliersComponent, data: { roles: 20 } },
  { path: 'purchaseitems', component: PurchaseitemsComponent, data: { roles: 21 } },
  { path: 'purchasereport', component: PurchasereportComponent, data: { roles: 22 } },
  { path: 'salesitems', component: SaleitemsComponent, data: { roles: 23 } },
  { path: 'salesitemsreports', component: SaleitemsReportsComponent, data: { roles: 24 }},
  { path: 'pharmacystock', component: PharmacyStockComponent, data: { roles: 25 }},
  { path: 'prescriptionreport', component: PrescriptionreportComponent, data: { roles: 26 }},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmacyRoutingModule { }
