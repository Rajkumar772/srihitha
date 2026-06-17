import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { AddDetailsComponent } from './add-details/add-details.component';

const routes: Routes = [
    { path: 'ambulance', component:AmbulanceComponent , data: { roles: 56 } },
    { path: 'adddetails', component:AddDetailsComponent , data: { roles: 57 } },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AmbulancetrackerRoutingModule { }
