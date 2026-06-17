
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimePipe } from '../pipes/time.pipe';


@NgModule({
  declarations: [TimePipe],
  imports: [
    CommonModule
  ],
  // exports is required so you can access your component/pipe in other modules
  exports: [ TimePipe]
})
export class SharedPipeModule{}
