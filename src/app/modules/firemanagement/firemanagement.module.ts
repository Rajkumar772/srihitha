import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FiremanagementRoutingModule } from './firemanagement-routing.module';
import { FireandsafetyComponent } from './fireandsafety/fireandsafety.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { MockdrillComponent } from './mockdrill/mockdrill.component';
@NgModule({
  declarations: [
    FireandsafetyComponent,MockdrillComponent
  ],
  imports: [
    CommonModule,
    FiremanagementRoutingModule,
    CommonModule,
        FormsModule,
        SharedPipeModule,
        NgSelectModule,
        MaterialModule,
        ReactiveFormsModule,
        RemoveDuplicateJsonObjectModule,
  ]
})
export class FiremanagementModule { }
