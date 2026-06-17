import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DietComponent } from './diet/diet.component';
import { DietListComponent } from './diet-list/diet-list.component';

const routes: Routes = [
  { path: 'diet', component: DietComponent, data: { roles: 58 } },
  { path: 'dietlist', component: DietListComponent, data: { roles: 59 } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DietitianRoutingModule { }
