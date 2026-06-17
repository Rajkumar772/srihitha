import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineconsultancyRoutingModule } from './onlineconsultancy-routing.module';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { VideocallComponent } from './videocall/videocall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from 'src/app/core/material/material.module';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { HttpClientModule } from '@angular/common/http';

// import { AppRoutingModule } from './app-routing.module';
@NgModule({
  declarations: [
    DoctorComponent,
    PatientComponent,
    VideocallComponent
  ],
  imports: [
    CommonModule,
    OnlineconsultancyRoutingModule,
    //  BrowserModule,
    ReactiveFormsModule,FormsModule,
    // AppRoutingModule
    NgSelectModule,
    MaterialModule,
    RemoveDuplicateJsonObjectModule,HttpClientModule
  ]
})
export class OnlineconsultancyModule { }
