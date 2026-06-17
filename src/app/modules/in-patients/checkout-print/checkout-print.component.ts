import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NumToWordsServicesService } from '../../num-to-words-services.service';
import numWords from 'num-words';

@Component({
  selector: 'app-checkout-print',
  templateUrl: './checkout-print.component.html',
  styleUrls: ['./checkout-print.component.scss']
})
export class CheckoutPrintComponent implements OnInit {
  today = new Date();
  ordersData: any[] = [];
  proforma1: any[] = [];
  numberInWords: any
  showOverlay: boolean = true;
  showOverlaying: boolean = false;
  private subscription: Subscription;
  constructor(private location: Location, private convertTowords: NumToWordsServicesService) { }
  name: any
  ngOnInit(): void {
    this.proforma1 = [JSON.parse(sessionStorage.getItem('proforma1'))]

    this.numberInWords = numWords(this.proforma1[0].lessadvance);
   
   this.name = localStorage.getItem('usr_nm')

    // this.totalWords =this.convertTowords.numberToWordsInIndianFormat(this.proforma1[0].lessadvance)

    // this.name = localStorage.getItem('usr_nm')

    // this.convertTowords.numberToWordsInIndianFormat(this.proforma1[0].lessadvance)
  }
  print() {

    setTimeout(() => {
      window.print();
    }, 200);

  }

  Back() {
    sessionStorage.setItem('seter', '1');
    this.location.back();
  }

}
