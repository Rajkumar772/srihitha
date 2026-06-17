import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTypeComponent } from './add-type/add-type.component';
import { AddRoomtypeComponent } from './add-roomtype/add-roomtype.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ReportsComponent } from './reports/reports.component';
import { DischargesummaryComponent } from './dischargesummary/dischargesummary.component';

const routes: Routes = [
  { path: 'add-type', component: AddTypeComponent, data: { roles: 4 } },
  { path: 'add-roomtype', component: AddRoomtypeComponent, data: { roles: 5 } },
  { path: 'insurance', component: InsuranceComponent, data: { roles: 6 } },
  { path: 'rooms', component: RoomsComponent, data: { roles: 7 } },
  { path: 'reports', component: ReportsComponent, data: { roles: 8 } },
  { path: 'dischargesummary', component: DischargesummaryComponent, data: { roles: 61 } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InPatientsRoutingModule { }
