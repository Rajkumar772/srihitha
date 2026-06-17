import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInventoryRoutingModule } from './store-inventory-routing.module';
import { AddStockComponent } from './add-stock/add-stock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
// import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [
    AddStockComponent
  ],
  imports: [
    CommonModule,
    StoreInventoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatTableExporterModule,
        MaterialModule,
        RemoveDuplicateJsonObjectModule,
        NgApexchartsModule
  
  ]
})
export class StoreInventoryModule { }
