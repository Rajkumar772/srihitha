import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddLabTestsComponent } from './add-lab-tests/add-lab-tests.component';
import { AssignLabTestsComponent } from './assign-lab-tests/assign-lab-tests.component';
import { PerformLabTestsComponent } from './perform-lab-tests/perform-lab-tests.component';
import { LabTestsReportsComponent } from './lab-tests-reports/lab-tests-reports.component';
import { LabGrouptestsComponent } from './lab-grouptests/lab-grouptests.component';
import { LabReportComponent } from './lab-report/lab-report.component';

const routes: Routes = [
  { path: 'Add-lab-tests', component: AddLabTestsComponent, data: { roles: 15 } },
  { path: 'Assign-lab-tests', component: AssignLabTestsComponent, data: { roles: 16 } },
  { path: 'Perform-lab-tests', component: PerformLabTestsComponent, data: { roles: 17 } },
  { path: 'Lab-tests-reports', component: LabTestsReportsComponent, data: { roles: 18 } },
    { path: 'Lab-reports', component: LabReportComponent, data: { roles: 19 } },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabsManagementRoutingModule { }
