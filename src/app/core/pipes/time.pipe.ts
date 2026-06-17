import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value:any, args:any){

    return moment(value,'HH:mm').format("HH:mm A");

}
}
