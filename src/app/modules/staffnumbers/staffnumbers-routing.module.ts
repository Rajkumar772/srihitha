import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactlistComponent } from './contactlist/contactlist.component';

const routes: Routes = [
  { path: 'contactlist', component:ContactlistComponent , data: { roles: 41 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffnumbersRoutingModule { }
