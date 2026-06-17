import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalrecordsRoutingModule } from './medicalrecords-routing.module';
import { OpdrecordsComponent } from './opdrecords/opdrecords.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { IpdreportsComponent } from './ipdreports/ipdreports.component';
@NgModule({
  declarations: [
    OpdrecordsComponent,
    IpdreportsComponent
  ],
  imports: [
    CommonModule,
    MedicalrecordsRoutingModule,FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        MaterialModule,
        RemoveDuplicateJsonObjectModule
  ]
})
export class MedicalrecordsModule { }
