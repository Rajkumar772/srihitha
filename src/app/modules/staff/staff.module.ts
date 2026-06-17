import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';


@NgModule({
  declarations: [
    AddStaffComponent,
    StaffListComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class StaffModule { }
