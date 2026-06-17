import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NabhQiComponent } from './nabh-qi/nabh-qi.component';
import { KpisComponent } from './kpis/kpis.component';

const routes: Routes = [
  { path: 'nabh_qi', component: NabhQiComponent, data: { roles: 68 } },
  { path: 'kpis', component: KpisComponent, data: { roles: 69 } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NabhRoutingModule { }
