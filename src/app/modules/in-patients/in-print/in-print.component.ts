import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-in-print',
  templateUrl: './in-print.component.html',
  styleUrls: ['./in-print.component.scss']
})
export class InPrintComponent implements OnInit {
  opdata: any[] = [];

  constructor(private location:Location) { }

  ngOnInit(): void {
    this.opdata = [JSON.parse(sessionStorage.getItem('opprint'))]

    
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
