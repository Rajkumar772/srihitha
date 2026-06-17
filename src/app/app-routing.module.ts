
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";
import { AuthGuard } from './core/gaurds/auth.guard';
import { OpPrintComponent } from './modules/op-patients/op-print/op-print.component';
import { InPrintComponent } from './modules/in-patients/in-print/in-print.component';
import { DiagnosticPrintComponent } from './modules/assign-diagnostic-tests/diagnostic-print/diagnostic-print.component';
import { PrintPerfomaComponent } from './modules/in-patients/print-perfoma/print-perfoma.component';
import { CheckoutPrintComponent } from './modules/in-patients/checkout-print/checkout-print.component';
import { LabsresultPrintComponent } from './modules/labsmdl/labsresult-print/labsresult-print.component';
import { LabPrintComponent } from './modules/labsmdl/lab-print/lab-print.component';
import { SalesreportsPrintComponent } from './modules/pharmacy/salesreports-print/salesreports-print.component';
import { DischargePrintComponent } from './modules/in-patients/discharge-print/discharge-print.component';
import { FinalbillPrintComponent } from './modules/in-patients/finalbill-print/finalbill-print.component';
import { PurchaseprintsComponent } from './modules/pharmacy/purchaseprints/purchaseprints.component';
import { PharmaDayendprintComponent } from './modules/pharmacy/pharma-dayendprint/pharma-dayendprint.component';
import { DocMedicinePrintComponent } from './modules/doctor/doc-medicine-print/doc-medicine-print.component';
import { MedicinewiseprintComponent } from './modules/pharmacy/medicinewiseprint/medicinewiseprint.component';
import { AdmitReportsPrintComponent } from './modules/in-patients/admit-reports-print/admit-reports-print.component';
import { SupplierPurchaseReportsPrintComponent } from './modules/pharmacy/supplier-purchase-reports-print/supplier-purchase-reports-print.component';
import { PrintdischargeComponent } from './modules/in-patients/printdischarge/printdischarge.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/analysis',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES, canActivate: [AuthGuard] },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  { path: 'op-print', component: OpPrintComponent },
  { path: 'in-print', component: InPrintComponent },
  { path: 'diagnostic-print', component: DiagnosticPrintComponent },
  { path: 'print-perfoma', component: PrintPerfomaComponent },
  { path: 'checkout-print', component: CheckoutPrintComponent },
  { path: 'lbresultsprint', component: LabsresultPrintComponent },
  { path: 'lab-print', component: LabPrintComponent },
  { path: 'salesreportsPrint', component: SalesreportsPrintComponent },
  { path: 'finalbill-print', component: FinalbillPrintComponent },
  { path: 'purchasereports-prints', component: PurchaseprintsComponent },
  { path: 'pharmadayendprint', component: PharmaDayendprintComponent },
  { path: 'doc-medicine-print', component: DocMedicinePrintComponent },
  { path: 'discharge-summary', component: DischargePrintComponent },
  { path: 'medicine-wise-print', component: MedicinewiseprintComponent },
  { path: 'admit-reports-print', component: AdmitReportsPrintComponent },
  { path: 'supplier-purchase-reports-print', component: SupplierPurchaseReportsPrintComponent },
  { path: 'printdischarge', component: PrintdischargeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
