import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockinventoryRoutingModule } from './stockinventory-routing.module';
import { AdditemsstockComponent } from './additemsstock/additemsstock.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { InventorypurchadseComponent } from './inventorypurchadse/inventorypurchadse.component';
import { StoreinventorypurchasereportComponent } from './storeinventorypurchasereport/storeinventorypurchasereport.component';
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    AdditemsstockComponent,
    InventorypurchadseComponent,
    StoreinventorypurchasereportComponent
  ],
  imports: [
    CommonModule,
    StockinventoryRoutingModule, FormsModule,
        NgSelectModule,
        ReactiveFormsModule,
        MaterialModule,
        RemoveDuplicateJsonObjectModule
  ],
   providers: [DatePipe],
})
export class StockinventoryModule { }
