import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KpisComponent } from './kpis/kpis.component';
import { ThirtytwokpisComponent } from './thirtytwokpis/thirtytwokpis.component';
import { KpisanalysisComponent } from './kpisanalysis/kpisanalysis.component';

const routes: Routes = [
  { path: 'kpis', component: KpisComponent, data: { roles: 73 } },
  { path: 'thirtytwokpis', component: ThirtytwokpisComponent, data: { roles: 74 } },
  { path: 'kpisanalysis', component: KpisanalysisComponent, data: { roles: 75 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpisRoutingModule { }


