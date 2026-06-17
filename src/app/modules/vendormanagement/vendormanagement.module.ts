import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendormanagementRoutingModule } from './vendormanagement-routing.module';
import { VendorsComponent } from './vendors/vendors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';


@NgModule({
  declarations: [
    VendorsComponent
  ],
  imports: [
    CommonModule,
    VendormanagementRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class VendormanagementModule { }
