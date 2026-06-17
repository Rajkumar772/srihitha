import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddphysiotherapyComponent } from './addphysiotherapy/addphysiotherapy.component';
import { CerticicateComponent } from './certicicate/certicicate.component';

const routes: Routes = [
    { path: 'addphysiotherapy', component: AddphysiotherapyComponent, data: { roles: 53 } },
       { path: 'certicicate', component: CerticicateComponent, data: { roles: 53 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysiotherapyRoutingModule { }
