import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import numWords from 'num-words';

@Component({
  selector: 'app-op-print',
  templateUrl: './op-print.component.html',
  styleUrls: ['./op-print.component.scss']
})
export class OpPrintComponent implements OnInit {
  name:any
  opdata: any[] = [];
  consultant_fee:any
  numberInWords:any
  constructor(private location: Location) { }
  
  ngOnInit(): void {
    this.opdata = [JSON.parse(sessionStorage.getItem('opprint'))]
    
    this.numberInWords = numWords(this.opdata[0].after_discount_total);
    
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
