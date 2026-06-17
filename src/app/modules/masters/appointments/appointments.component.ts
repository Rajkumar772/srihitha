import { Component, OnInit } from '@angular/core';


import * as ApexCharts from 'apexcharts';

import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

 
  constructor() {
  
  }

  ngOnInit(): void {
  
  

  }



  //remove excel x code 
  exportTable(id, name) {
    
    TableUtil.exportTableToExcel(id, name);
  }


}




