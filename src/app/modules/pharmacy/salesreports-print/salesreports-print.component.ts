import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';
import numWords from 'num-words';


@Component({
  selector: 'app-salesreports-print',
  templateUrl: './salesreports-print.component.html',
  styleUrls: ['./salesreports-print.component.scss']
})
export class SalesreportsPrintComponent implements OnInit {

  salesRpt: any = [];
  TakingObject: any;
  INwords: any;
  userName: any;

  showSpinner: boolean = false
  constructor(private location: Location, private service: PharmaserviceService) {
    this.userName = (localStorage.getItem('usr_nm'));
  }

  dynamicPrintCount: any

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('salesReport'));
    this.salesRpt.push(dta);
    this.func(this.salesRpt[0].id)
    this.TakingObject = this.salesRpt[0]
    this.INwords = numWords(parseInt(this.salesRpt[0]?.sale_grandtotal));
    this.HitForPrintCount()
  }

  HitForPrintCount() {
    this.dynamicPrintCount = 0
    var data = {
      id: this.salesRpt[0].id
    }
    this.service.getPrintCountForSale(data).subscribe((res) => {
      this.dynamicPrintCount = res.data[0].sale_print_count
    })
  }

  print() {
    this.showSpinner = true
    var data = {
      id: this.salesRpt[0].id
    }
    this.service.updatePrintCountForSale(data).subscribe((res) => {
      this.showSpinner = false
      if (res.status == 200) {
        this.HitForPrintCount()
      }
    })
    window.print();
  }

  Back() {
    this.location.back();
  }

  // Listen for 'Ctrl + P' (or 'Cmd + P' on macOS) using HostListener
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      // this.print();  // Call the print function
      event.preventDefault()
    }
  }

  salesPatientData: any;
  grandTotal: any = 0
  totalWords: any;

  func(data1) {
    var data = {
      'salepersonid': data1,
    }
    this.showSpinner = true
    this.service.getparticularsalesdetials(data).subscribe((res) => {
      this.showSpinner = false
      this.salesPatientData = res.data
    })
  }

}
