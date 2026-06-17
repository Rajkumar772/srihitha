import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeleconsultationRoutingModule } from './teleconsultation-routing.module';
import { GooglemeetComponent } from './googlemeet/googlemeet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeleconsultancytestingComponent } from './teleconsultancytesting/teleconsultancytesting.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [
    GooglemeetComponent,
    TeleconsultancytestingComponent
  ],
  imports: [
    CommonModule,
    TeleconsultationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    MatFormFieldModule,
    MatTableModule, MatRadioModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule,
  ]
})
export class TeleconsultationModule { }
