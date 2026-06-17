import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RoomsComponent } from './rooms/rooms.component';



const routes: Routes = [
  { path: 'appointments', component: AppointmentsComponent, data: { roles: 47 } },
  { path: 'rooms', component: RoomsComponent, data: { roles: 3 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
