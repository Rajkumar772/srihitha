import { Component, OnInit } from '@angular/core';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admit-reports-print',
  templateUrl: './admit-reports-print.component.html',
  styleUrls: ['./admit-reports-print.component.scss']
})
export class AdmitReportsPrintComponent implements OnInit {

  currentDate: any;
  showSpinner: boolean = false

  constructor(private location: Location, private service: InPatienrservicesService) { }


  dateOfAdmitdata: any;

  ngOnInit(): void {
    var data = JSON.parse(sessionStorage.getItem('admit-reports-print'))
    this.dateOfAdmitdata = data
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

}
