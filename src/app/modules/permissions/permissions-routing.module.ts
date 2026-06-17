import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPermissionComponent } from './user-permission/user-permission.component';


const routes: Routes = [
  { path: 'user-permissions', component: UserPermissionComponent, data: { roles: 2 } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionsRoutingModule { }
