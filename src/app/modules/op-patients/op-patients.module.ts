import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OpPatientsRoutingModule } from './op-patients-routing.module';
import { AddPatientsComponent } from './add-patients/add-patients.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OpPatientsListComponent } from './op-patients-list/op-patients-list.component';
import { AddDoctorsComponent } from './add-doctors/add-doctors.component';
import { DoctorsListComponent } from './doctors-list/doctors-list.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { OpPrintComponent } from './op-print/op-print.component';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';

import { CardtypeComponent } from './cardtype/cardtype.component';
import { ConsulationfeeComponent } from './consulationfee/consulationfee.component';

@NgModule({
  declarations: [
    AddPatientsComponent,
    OpPatientsListComponent,
    AddDoctorsComponent,
    DoctorsListComponent,
    OpPrintComponent,
    CardtypeComponent, ConsulationfeeComponent
  ],
  imports: [
    CommonModule,
    OpPatientsRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ],
  providers: [DatePipe]
})
export class OpPatientsModule { }
