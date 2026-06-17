import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LabsManagementRoutingModule } from './labs-management-routing.module';
import { AddLabTestsComponent } from './add-lab-tests/add-lab-tests.component';
import { AssignLabTestsComponent } from './assign-lab-tests/assign-lab-tests.component';
import { LabTestsReportsComponent } from './lab-tests-reports/lab-tests-reports.component';
import { PerformLabTestsComponent } from './perform-lab-tests/perform-lab-tests.component';
import { MaterialModule } from 'src/app/core/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LabPrintComponent } from './lab-print/lab-print.component';
import { LabsresultPrintComponent } from './labsresult-print/labsresult-print.component';
import { LabGrouptestsComponent } from './lab-grouptests/lab-grouptests.component';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { LabReportComponent } from './lab-report/lab-report.component';



@NgModule({
  declarations: [
    AddLabTestsComponent,
    AssignLabTestsComponent,
    LabTestsReportsComponent,
    PerformLabTestsComponent,
    LabPrintComponent,
    LabsresultPrintComponent,
    LabGrouptestsComponent,
    LabReportComponent,
   
   
  ],
  imports: [
    CommonModule,
    LabsManagementRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
    MaterialModule
  ],
  providers: [DatePipe]
})
export class LabsManagementModule { }
