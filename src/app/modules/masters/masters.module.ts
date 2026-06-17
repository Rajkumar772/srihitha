import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RoomsComponent } from './rooms/rooms.component';

@NgModule({
  declarations: [
    AppointmentsComponent,
    RoomsComponent,
  ],
  imports: [
    CommonModule,
    MastersRoutingModule,
    FormsModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
  ]
})
export class MastersModule { }
