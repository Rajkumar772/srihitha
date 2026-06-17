import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DietitianRoutingModule } from './dietitian-routing.module';
import { DietComponent } from './diet/diet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DietListComponent } from './diet-list/diet-list.component';
import { EditDietComponent } from './edit-diet/edit-diet.component';


@NgModule({
  declarations: [
    DietComponent,
    DietListComponent,
    EditDietComponent
  ],
  imports: [
    CommonModule,
    DietitianRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DietitianModule { }
