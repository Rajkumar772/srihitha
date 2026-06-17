import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { NuresingRoutingModule } from './nuresing-routing.module';
import { DressingComponent } from './dressing/dressing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NursingtrainingComponent } from './nursingtraining/nursingtraining.component';


@NgModule({
  declarations: [
    DressingComponent,
    NursingtrainingComponent
  ],
  imports: [
    CommonModule,
    NuresingRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ],
  providers: [DatePipe]
})
export class NuresingModule { }
