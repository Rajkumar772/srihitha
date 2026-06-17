import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HrmoduleRoutingModule } from './hrmodule-routing.module';
import { EmployeemanagenmentComponent } from './employeemanagenment/employeemanagenment.component';

import { WebcamModule } from 'ngx-webcam';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { LeavemanagenmentComponent } from './leavemanagenment/leavemanagenment.component';
import { AddingshiftsComponent } from './addingshifts/addingshifts.component';
import { HranalysisComponent } from './hranalysis/hranalysis.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    EmployeemanagenmentComponent,
    LeavemanagenmentComponent,
    AddingshiftsComponent,
    HranalysisComponent,NotificationsComponent
  ],
  imports: [
    CommonModule,
    HrmoduleRoutingModule,
    WebcamModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
    NgApexchartsModule,
  ]
})
export class HrmoduleModule { }
