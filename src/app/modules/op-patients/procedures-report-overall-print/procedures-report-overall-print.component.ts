import { Component, OnInit } from '@angular/core';
import { OpServicesService } from '../op-services.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-procedures-report-overall-print',
  templateUrl: './procedures-report-overall-print.component.html',
  styleUrls: ['./procedures-report-overall-print.component.scss']
})
export class ProceduresReportOverallPrintComponent implements OnInit {

  currentDate: any;
  showSpinner: boolean = false

  constructor(private location:Location,
    private myservice: OpServicesService) {

  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  proceduredata: any;

  ngOnInit(): void {
    var data = JSON.parse(sessionStorage.getItem('procedure-reports-overall-print'))
    this.proceduredata = data
  }

  
}
