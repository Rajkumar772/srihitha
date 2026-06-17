import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FireandsafetyComponent } from './fireandsafety/fireandsafety.component';
import { MockdrillComponent } from './mockdrill/mockdrill.component';

const routes: Routes = [
     { path: 'fireandsafety', component: FireandsafetyComponent, data: { roles: 52 } },
     { path: 'mockdrill', component: MockdrillComponent, data: { roles: 62 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiremanagementRoutingModule { }
