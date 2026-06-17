import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DiagnosticTestsRoutingModule } from './diagnostic-tests-routing.module';
import { AddDiagnosticTestsComponent } from './add-diagnostic-tests/add-diagnostic-tests.component';
import { AssignDiagnosticTestsComponent } from './assign-diagnostic-tests/assign-diagnostic-tests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { DiagnosticPrintComponent } from './diagnostic-print/diagnostic-print.component';
import { XRayComponent } from './x-ray/x-ray.component';
import { DiagnosticReportComponent } from './diagnostic-report/diagnostic-report.component';


@NgModule({
  declarations: [
    AddDiagnosticTestsComponent,
    AssignDiagnosticTestsComponent,
    DiagnosticPrintComponent,
    XRayComponent,
    DiagnosticReportComponent,
  ],
  imports: [
    CommonModule,
    DiagnosticTestsRoutingModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers:[DatePipe]
})
export class DiagnosticTestsModule { }
