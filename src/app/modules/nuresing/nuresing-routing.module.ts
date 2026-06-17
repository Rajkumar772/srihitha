import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DressingComponent } from './dressing/dressing.component';
import { NursingtrainingComponent } from './nursingtraining/nursingtraining.component';

const routes: Routes = [
  { path: 'dressing', component: DressingComponent, data: { roles: 45 }},
  { path: 'nursingtraining', component: NursingtrainingComponent, data: { roles: 45 }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NuresingRoutingModule { }
