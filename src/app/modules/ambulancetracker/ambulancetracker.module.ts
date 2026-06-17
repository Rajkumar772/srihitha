import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AmbulancetrackerRoutingModule } from './ambulancetracker-routing.module';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDetailsComponent } from './add-details/add-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { AmbulanceanalysisComponent } from './ambulanceanalysis/ambulanceanalysis.component';

@NgModule({
  declarations: [
    AmbulanceComponent,
    AddDetailsComponent,
    AmbulanceanalysisComponent
  ],
  imports: [
    CommonModule,
    AmbulancetrackerRoutingModule,
    FormsModule,
    ReactiveFormsModule,



        SharedPipeModule,
        NgSelectModule,
        MaterialModule,
        RemoveDuplicateJsonObjectModule,

  ]
})
export class AmbulancetrackerModule { }
