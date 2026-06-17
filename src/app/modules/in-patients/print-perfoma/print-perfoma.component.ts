import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NumToWordsServicesService } from '../../num-to-words-services.service';
import numWords from 'num-words';

@Component({
  selector: 'app-print-perfoma',
  templateUrl: './print-perfoma.component.html',
  styleUrls: ['./print-perfoma.component.scss']
})
export class PrintPerfomaComponent implements OnInit {

  @HostListener('window:afterprint') onafterprint() {
    sessionStorage.setItem('seter', '1');
    // this.location.back();
  }
  today = new Date();
  ordersData: any[] = [];
  proforma: any[] = [];
  showOverlay: boolean = true;
  showOverlaying: boolean = false;
  private subscription: Subscription;
  constructor(private location: Location, private convertTowords: NumToWordsServicesService) {

  }
  numberInWords:any
  name:any
  ngOnInit(): void {
    // this.subscription = this.orderservice.currentMessage.subscribe(message => this.labeldata = message);
    this.proforma = [JSON.parse(sessionStorage.getItem('proforma'))]
   
    // this.totalWords =this.convertTowords.numberToWordsInIndianFormat(this.proforma[0].amount);
    // this.convertTowords.numberToWordsInIndianFormat(this.proforma[0].amount)
    this.numberInWords = numWords(this.proforma[0].amount);

     this.name = localStorage.getItem('usr_nm')
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
