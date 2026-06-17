import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReferencesRoutingModule } from './references-routing.module';
import { ReferlistComponent } from './referlist/referlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RefhospitalcountsComponent } from './refhospitalcounts/refhospitalcounts.component';


@NgModule({
  declarations: [
    ReferlistComponent,
    RefhospitalcountsComponent
  ],
  imports: [
    CommonModule,
    ReferencesRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ],
  providers: [DatePipe]
})
export class ReferencesModule { }
