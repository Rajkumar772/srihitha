import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDiagnosticTestsComponent } from './add-diagnostic-tests/add-diagnostic-tests.component';
import { AssignDiagnosticTestsComponent } from './assign-diagnostic-tests/assign-diagnostic-tests.component';
import { XRayComponent } from './x-ray/x-ray.component';
import { DiagnosticReportComponent } from './diagnostic-report/diagnostic-report.component';

const routes: Routes = [

  { path: 'Add-diagnostic-tests', component: AddDiagnosticTestsComponent, data: { roles: 13 } },
  { path: 'Assign-diagnostic-tests', component: AssignDiagnosticTestsComponent, data: { roles: 14 } },
  { path: 'x-ray', component: XRayComponent, data: { roles: 31 } },
  { path: 'diagnostic-tests', component: DiagnosticReportComponent, data: { roles: 4 } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticTestsRoutingModule { }

