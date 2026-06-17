import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GstReportsRoutingModule } from './gst-reports-routing.module';
import { GstReportsComponent } from './gst-reports/gst-reports.component';
import { WebcamModule } from 'ngx-webcam';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GstReportsPrintComponent } from './gst-reports-print/gst-reports-print.component';
import { OpIpLabGstReportPrintComponent } from './op-ip-lab-gst-report-print/op-ip-lab-gst-report-print.component';


@NgModule({
  declarations: [
    GstReportsComponent,
    GstReportsPrintComponent,
    OpIpLabGstReportPrintComponent
  ],
  imports: [
    CommonModule,
    GstReportsRoutingModule,
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
export class GstReportsModule { }
