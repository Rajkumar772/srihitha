import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import numWords from 'num-words';
import QRCode from 'qrcode';
@Component({
  selector: 'app-barcodeprint',
  templateUrl: './barcodeprint.component.html',
  styleUrls: ['./barcodeprint.component.scss']
})
export class BarcodeprintComponent implements OnInit {

  name: any
  opdata: any[] = [];
  consultant_fee: any
  numberInWords: any
  constructor(private location: Location) { }
  @ViewChild('qrcodeCanvas', { static: false }) qrcodeCanvas: ElementRef;
  ngOnInit(): void {
    this.opdata = [JSON.parse(sessionStorage.getItem('opprint'))]
    
    this.numberInWords = numWords(this.opdata[0].after_discount_total);
    
    this.name = localStorage.getItem('usr_nm')
    const canvas = this.qrcodeCanvas.nativeElement;
    QRCode.toCanvas(canvas, this.opdata[0].uh_id, (error) => {
      if (error) console.error(error);
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
