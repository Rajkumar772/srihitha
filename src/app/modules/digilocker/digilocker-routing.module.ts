import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LockerComponent } from './locker/locker.component';

const routes: Routes = [
   { path: 'locker', component: LockerComponent, data: { roles: 66 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigilockerRoutingModule { }
