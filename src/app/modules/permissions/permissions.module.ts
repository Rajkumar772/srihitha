import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/core/material/material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RemoveDuplicateJsonObjectModule } from 'remove-duplicate-json-object';
import { SharedPipeModule } from 'src/app/core/material/pipes.module';
import { UserPermissionComponent } from './user-permission/user-permission.component';


@NgModule({
  declarations: [
    UserPermissionComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedPipeModule,
    NgSelectModule,
    MaterialModule,
    ReactiveFormsModule,
    PermissionsRoutingModule,
    RemoveDuplicateJsonObjectModule,
  ]
})
export class PermissionsModule { }
