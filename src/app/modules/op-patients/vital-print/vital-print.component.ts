import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import numWords from 'num-words';

@Component({
  selector: 'app-vital-print',
  templateUrl: './vital-print.component.html',
  styleUrls: ['./vital-print.component.scss']
})
export class VitalPrintComponent implements OnInit {
  name: any
  vitaldata: any[] = [];
  consultant_fee: any
  numberInWords: any
  constructor(private location: Location) { }

  ngOnInit(): void {
    this.vitaldata = [JSON.parse(sessionStorage.getItem('vitalprint'))]

    this.numberInWords = numWords(this.vitaldata[0].consultant_fee);
    
    this.name = localStorage.getItem('usr_nm')
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
