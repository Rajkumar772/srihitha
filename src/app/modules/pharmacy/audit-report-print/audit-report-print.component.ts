import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';

@Component({
  selector: 'app-audit-report-print',
  templateUrl: './audit-report-print.component.html',
  styleUrls: ['./audit-report-print.component.scss']
})
export class AuditReportPrintComponent implements OnInit {

  currentDate: any;

  constructor(private location: Location,
    private myservice: PharmaserviceService
  ) {

  }

  showSpinner: boolean = false
  audtData: any = [];

  currentMonth: any;


  ngOnInit(): void {

    var data = JSON.parse(sessionStorage.getItem('auditReportMonth'))

    this.audtData = data

    this.currentMonth = this.audtData[0].each_day
  }


  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }
  // getTotalCost() {
  //   var grandTotal = 0;
  //   this.audtData?.map((res) => {
  //     grandTotal += res.day_grandtotal
  //   })
  //   return grandTotal;
  // }

  getSalesTotl() {
    var grandTotal = 0;
    this.audtData?.map((res) => {
      grandTotal += res.without_reduction
    })
    return grandTotal;
  }


}
