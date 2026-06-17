import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';



@Component({
  selector: 'app-phar-overall-print',
  templateUrl: './phar-overall-print.component.html',
  styleUrls: ['./phar-overall-print.component.scss']
})
export class PharOverallPrintComponent implements OnInit {

  otreturnsReports: any = [];


  userName: any;


  constructor(private location: Location, private service: PharmaserviceService) {

  }

  overAllData: any = [];
  ngOnInit(): void {
    this.service.getOverallStock().subscribe((res: any) => {
      this.overAllData = res.data
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });

    });
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
