import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GstreportssesrviceService } from '../gstreportssesrvice.service';


@Component({
  selector: 'app-gst-reports-print',
  templateUrl: './gst-reports-print.component.html',
  styleUrls: ['./gst-reports-print.component.scss']
})
export class GstReportsPrintComponent implements OnInit {

  current_date: any;
  showname: any;
  gstPurchaseData: any;
  igstPurchaseData: any;
  gstSalesData: any;
  dateRangeDisplay2: any

  constructor(private location: Location, private service: GstreportssesrviceService) {
    this.gstPurchaseData = JSON.parse(sessionStorage.getItem('gst-reports-print'))
    this.igstPurchaseData = JSON.parse(sessionStorage.getItem('igst-reports-print'))
    this.gstSalesData = JSON.parse(sessionStorage.getItem('gst-sales-print'))
    this.dateRangeDisplay2 = JSON.parse(sessionStorage.getItem('gst-sales-date'))
    this.current_date = new Date().toDateString()
  }

  ngOnInit(): void {
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  public openPDF(): void {
    var x = this.showname;
    setTimeout(() => {
      x = this.showname;
      document.title = x;
      window.print();
    }, 200);
  }

}

