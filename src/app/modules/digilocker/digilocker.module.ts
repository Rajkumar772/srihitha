import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigilockerRoutingModule } from './digilocker-routing.module';
import { LockerComponent } from './locker/locker.component';
import { WebcamModule } from 'ngx-webcam';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';

@NgModule({
  declarations: [
    LockerComponent
  ],
  imports: [
    CommonModule,
    DigilockerRoutingModule,WebcamModule,
        SharedPipeModule,
        NgSelectModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RemoveDuplicateJsonObjectModule,
        NgApexchartsModule,
  ]
})
export class DigilockerModule { }
