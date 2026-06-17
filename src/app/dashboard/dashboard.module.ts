import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AnalysisComponent } from './analysis/analysis.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from '../core/material/material.module';

import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgbModule,
        NgSelectModule,
        MaterialModule,
        NgApexchartsModule,
        RemoveDuplicateJsonObjectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [],
    declarations: [
        AnalysisComponent,
       
    ],
    providers: [DatePipe],
})
export class DashboardModule { }
