import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousekeepingRoutingModule } from './housekeeping-routing.module';
import { RegisteremployeeComponent } from './registeremployee/registeremployee.component';
import { WebcamModule } from 'ngx-webcam';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';

@NgModule({
  declarations: [
    RegisteremployeeComponent
  ],
  imports: [
    CommonModule,
    HousekeepingRoutingModule,
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
export class HousekeepingModule { }
