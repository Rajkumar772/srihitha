import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NabhRoutingModule } from './nabh-routing.module';
import { NabhQiComponent } from './nabh-qi/nabh-qi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { KpisComponent } from './kpis/kpis.component';


@NgModule({
  declarations: [
    NabhQiComponent,
    KpisComponent
  ],
  imports: [
    CommonModule,
    NabhRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class NabhModule { }
