import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GooglemeetComponent } from './googlemeet/googlemeet.component';


const routes: Routes = [
  { path: 'googlemeet', component: GooglemeetComponent, data: { roles: 44 } },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeleconsultationRoutingModule { }
