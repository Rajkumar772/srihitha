import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicensetrackingRoutingModule } from './licensetracking-routing.module';
import { TrackingComponent } from './tracking/tracking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
















import { MatButtonModule } from '@angular/material/button';


import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';

@NgModule({
  declarations: [
    TrackingComponent
  ],
  imports: [
    CommonModule,
    LicensetrackingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,   MatButtonModule,MatInputModule,
  ]
})
export class LicensetrackingModule { }
