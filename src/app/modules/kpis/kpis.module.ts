import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpisRoutingModule } from './kpis-routing.module';
import { KpisComponent } from './kpis/kpis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { ThirtytwokpisComponent } from './thirtytwokpis/thirtytwokpis.component';
import { KpisanalysisComponent } from './kpisanalysis/kpisanalysis.component';


@NgModule({
  declarations: [
    KpisComponent,
    ThirtytwokpisComponent,
    KpisanalysisComponent
  ],
  imports: [
    CommonModule,
    KpisRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ]
})
export class KpisModule { }
