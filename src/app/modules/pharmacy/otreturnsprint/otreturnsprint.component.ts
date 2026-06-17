import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';
import numWords from 'num-words';


@Component({
  selector: 'app-otreturnsprint',
  templateUrl: './otreturnsprint.component.html',
  styleUrls: ['./otreturnsprint.component.scss']
})
export class OtreturnsprintComponent implements OnInit {

  otreturnsReports: any = [];


  userName: any;


  constructor(private location: Location, private service: PharmaserviceService) {
    this.userName = (localStorage.getItem('usr_nm'));
  }

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('otreturnprints'));
    this.otreturnsReports = dta;
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
    this.otreturnsReports?.map((res) => {
      grandTotal += parseInt(res.grandtotal) || 0;
    })
    return grandTotal;
  }
}
