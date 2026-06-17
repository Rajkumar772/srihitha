import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PharmacyRoutingModule } from './pharmacy-routing.module';
import { AdditemsComponent } from './additems/additems.component';
import { WebcamModule } from 'ngx-webcam';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { PurchaseitemsComponent } from './purchaseitems/purchaseitems.component';
import { PurchasereportComponent } from './purchasereport/purchasereport.component';
import { DatePipe } from '@angular/common';
import { SaleitemsComponent } from './saleitems/saleitems.component';
import { SaleitemsReportsComponent } from './saleitems-reports/saleitems-reports.component';
import { PharmacyStockComponent } from './pharmacy-stock/pharmacy-stock.component';
import { SalesreportsPrintComponent } from './salesreports-print/salesreports-print.component';
import { MedicineManufacturersComponent } from './medicine-manufacturers/medicine-manufacturers.component';
import { MedicineWiseReportsComponent } from './medicine-wise-reports/medicine-wise-reports.component';
import { PurchaseprintsComponent } from './purchaseprints/purchaseprints.component';
import { PharmaDayendprintComponent } from './pharma-dayendprint/pharma-dayendprint.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PharmaCredithistoryComponent } from './pharma-credithistory/pharma-credithistory.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { MedicinewiseprintComponent } from './medicinewiseprint/medicinewiseprint.component';
import { SupplierPurchaseReportsComponent } from './supplier-purchase-reports/supplier-purchase-reports.component';
import { SupplierPurchaseReportsPrintComponent } from './supplier-purchase-reports-print/supplier-purchase-reports-print.component';
import { PrescriptionreportComponent } from './prescriptionreport/prescriptionreport.component';






@NgModule({
  declarations: [
    AdditemsComponent,
    SuppliersComponent,
    PurchaseitemsComponent,
    PurchasereportComponent,
    SaleitemsComponent,
    SaleitemsReportsComponent,
    PharmacyStockComponent,
    SalesreportsPrintComponent,

    MedicineManufacturersComponent,
    MedicineWiseReportsComponent,
    PurchaseprintsComponent,
    PharmaDayendprintComponent,


    PharmaCredithistoryComponent,

    PurchaseReturnsComponent,
    MedicinewiseprintComponent,
    SupplierPurchaseReportsComponent,
    SupplierPurchaseReportsPrintComponent,
    PrescriptionreportComponent

  ],
  imports: [
    CommonModule,
    PharmacyRoutingModule,
    WebcamModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
    NgApexchartsModule,

  ],
  providers: [DatePipe],
})
export class PharmacyModule { }
