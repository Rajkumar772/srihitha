import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorRoutingModule } from './doctor-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorPrescComponent } from './doctor-presc/doctor-presc.component';
import { DocMedicinePrintComponent } from './doc-medicine-print/doc-medicine-print.component';
import { AssignLabTestsComponent } from './assign-lab-tests/assign-lab-tests.component';
import { AssignRadiologyTestsComponent } from './assign-radiology-tests/assign-radiology-tests.component';


@NgModule({
  declarations: [
    DoctorListComponent,
    DoctorPrescComponent,
    DocMedicinePrintComponent,
    AssignLabTestsComponent,
    AssignRadiologyTestsComponent
  ],
  imports: [
    CommonModule,
    DoctorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class DoctorModule { }
