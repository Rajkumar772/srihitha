import { NgModule } from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common';
import { PhysiotherapyRoutingModule } from './physiotherapy-routing.module';
import { AddphysiotherapyComponent } from './addphysiotherapy/addphysiotherapy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { CerticicateComponent } from './certicicate/certicicate.component';


@NgModule({
  declarations: [
    AddphysiotherapyComponent,
    CerticicateComponent
  ],
  imports: [
    CommonModule,
    PhysiotherapyRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule
  ],
   providers: [DatePipe]
})
export class PhysiotherapyModule { }
