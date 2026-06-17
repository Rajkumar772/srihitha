import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { OpdaccountsreportComponent } from './opdaccountsreport/opdaccountsreport.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { PatientAllBillsComponent } from './patient-all-bills/patient-all-bills.component';

@NgModule({
  declarations: [
    OpdaccountsreportComponent,
    PatientAllBillsComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule, MatSortModule,
    MatButtonModule, MatInputModule
  ]
})
export class AccountsModule { }
