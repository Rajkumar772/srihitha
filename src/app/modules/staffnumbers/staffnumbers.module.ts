import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffnumbersRoutingModule } from './staffnumbers-routing.module';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';


@NgModule({
  declarations: [
    ContactlistComponent
  ],
  imports: [
    CommonModule,
    StaffnumbersRoutingModule, FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class StaffnumbersModule { }
