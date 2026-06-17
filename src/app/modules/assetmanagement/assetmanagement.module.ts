import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetmanagementRoutingModule } from './assetmanagement-routing.module';
import { AddassetComponent } from './addasset/addasset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { MaterialModule } from 'src/app/core/material/material.module';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { AddequipmentComponent } from './addequipment/addequipment.component';
import { AssetstockComponent } from './assetstock/assetstock.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    AddassetComponent,
    AddequipmentComponent,
    AssetstockComponent,
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    AssetmanagementRoutingModule, CommonModule,
    FormsModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    RemoveDuplicateJsonObjectModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule, MatSortModule,
    MatButtonModule, MatInputModule
  ]
})
export class AssetmanagementModule { }
