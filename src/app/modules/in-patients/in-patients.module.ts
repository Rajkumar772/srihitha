import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InPatientsRoutingModule } from './in-patients-routing.module';
import { AddTypeComponent } from './add-type/add-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { AddRoomtypeComponent } from './add-roomtype/add-roomtype.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReportsComponent } from './reports/reports.component';
import { InPrintComponent } from './in-print/in-print.component';
import { PrintPerfomaComponent } from './print-perfoma/print-perfoma.component';
import { CheckoutPrintComponent } from './checkout-print/checkout-print.component';

import { DischargePrintComponent } from './discharge-print/discharge-print.component';
import { FinalbillPrintComponent } from './finalbill-print/finalbill-print.component';
import { FinalinscbillPrintComponent } from './finalinscbill-print/finalinscbill-print.component';
import { AdmitReportsComponent } from './admit-reports/admit-reports.component';
import { AdmitReportsPrintComponent } from './admit-reports-print/admit-reports-print.component';
import { DischargesummaryComponent } from './dischargesummary/dischargesummary.component';
import { DischargeprintComponent } from './dischargeprint/dischargeprint.component';
import { PrintdischargeComponent } from './printdischarge/printdischarge.component';
import { CasesheetComponent } from './casesheet/casesheet.component';



@NgModule({
  declarations: [
    AddTypeComponent,
    AddRoomtypeComponent,
    InsuranceComponent,
    RoomsComponent,
    ReportsComponent,
    InPrintComponent,
    PrintPerfomaComponent,
    CheckoutPrintComponent,
 
    DischargePrintComponent,
    FinalbillPrintComponent,
    FinalinscbillPrintComponent,
    AdmitReportsComponent,
    AdmitReportsPrintComponent,DischargesummaryComponent, DischargeprintComponent, PrintdischargeComponent, CasesheetComponent

  ],
  imports: [
    CommonModule,
    InPatientsRoutingModule,
    FormsModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
  ],
  providers: [DatePipe],
})
export class InPatientsModule { }
