import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';
import numWords from 'num-words';


@Component({
  selector: 'app-supplier-purchase-reports-print',
  templateUrl: './supplier-purchase-reports-print.component.html',
  styleUrls: ['./supplier-purchase-reports-print.component.scss']
})
export class SupplierPurchaseReportsPrintComponent implements OnInit {

  SupplierpurchaseReports: any = [];
  userName: any;

  constructor(private location: Location, private service: PharmaserviceService) {
    this.userName = (localStorage.getItem('usr_nm'));
  }


  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('supplier-purchase-reports-print'));
    this.SupplierpurchaseReports = dta;
this.function(this.SupplierpurchaseReports)
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  getTotalCost() {
    var grandTotal = 0;
    this.SupplierpurchaseReports?.map((res) => {
      grandTotal += parseInt(res.grandtotal) || 0;
    })
    return grandTotal;
  }

  cleared: any;
  notcleared: any;
  grandTotal: any;

  function(data) {

    this.grandTotal = 0;
    this.cleared = 0;
    this.notcleared = 0;
    data.forEach((item) => {
      const total = parseInt(item.grandtotal) || 0;
      this.grandTotal += total;
      if (item.purchase_payment_ind === 'CLEARED') {
        this.cleared += total;
      } else if (item.purchase_payment_ind === 'NOT CLEARED') {
        this.notcleared += total;
      }
    });
  }

}
