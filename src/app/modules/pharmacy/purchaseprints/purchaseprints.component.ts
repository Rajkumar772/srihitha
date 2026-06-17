import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';
import numWords from 'num-words';



@Component({
  selector: 'app-purchaseprints',
  templateUrl: './purchaseprints.component.html',
  styleUrls: ['./purchaseprints.component.scss']
})
export class PurchaseprintsComponent implements OnInit {

  purchaseReports: any = [];
  userName: any;

  constructor(private location: Location, private service: PharmaserviceService) {
    this.userName = (localStorage.getItem('usr_nm'));
  }

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('purchaseReports'));
    this.purchaseReports = dta;
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
    this.purchaseReports?.map((res) => {
      grandTotal += parseInt(res.grandtotal) || 0;
    })
    return grandTotal;
  }


}
