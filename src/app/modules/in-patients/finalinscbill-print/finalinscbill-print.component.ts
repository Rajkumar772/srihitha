import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NumToWordsServicesService } from '../../num-to-words-services.service';
import numWords from 'num-words';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InPatienrservicesService } from '../in-patienrservices.service';



@Component({
  selector: 'app-finalinscbill-print',
  templateUrl: './finalinscbill-print.component.html',
  styleUrls: ['./finalinscbill-print.component.scss']
})
export class FinalinscbillPrintComponent implements OnInit {

  constructor(private location: Location, private convertTowords: NumToWordsServicesService, private service: InPatienrservicesService) { }

  bill_data: any;
  showTime: boolean = false
  ngOnInit(): void {

    this.bill_data = []
    this.bill_data = [JSON.parse(sessionStorage.getItem('finalbillprint'))]
    this.getOrginalDat()

    if (this.bill_data[0].payment_types === 'CASHLESS' && this.bill_data[0].med_claim === 'Yes') {
      this.showTime = false
    }
    else {
      this.showTime = true
    }
  }

  showSpinner: boolean = false;


  formatDate(dateString: string, includeTime: boolean = true): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
    };
    return date.toLocaleString('en-US', options).replace(',', ' at');
  }

  print() {

    setTimeout(() => {
      window.print();
    }, 200);

  }

  Back() {
    this.location.back();
  }

  grandTotal: any;


  head_one: any;
  head_two: any;
  head_three: any;

  head_four: any;
  head_five: any;
  head_six: any;
  head_seven: any;


  column_one: any = 0;
  column_two: any = 0;
  column_three: any = 0;
  column_four: any = 0;
  column_five: any = 0;
  column_six: any = 0;
  column_seven: any = 0;

  claim_no: any;
  pre_initmation_number: any;


  calculateGrandTotal() {
    this.grandTotal =
      parseFloat(this.column_one || 0) +
      parseFloat(this.column_two || 0) +
      parseFloat(this.column_three || 0) +
      parseFloat(this.column_four || 0) +
      parseFloat(this.column_five || 0) +
      parseFloat(this.column_six || 0) +
      parseFloat(this.column_seven || 0);

    this.grandTotal = +this.grandTotal.toFixed(2); // Shorter but less explicit

  }
  final_bill_no: any;

  getOrginalDat() {
    var data = {
      uh_id: this.bill_data[0].uh_id,
      ip_number: this.bill_data[0].ip_number,
    }
    this.showSpinner = true
    this.service.getIpfianlbillInsurcnemode(data).subscribe((res) => {

      this.showSpinner = false

      this.final_bill_no = res.data[0]?.final_bill_no || "",

        this.column_one = parseFloat(res.data[0]?.column_one || 0),
        this.column_two = parseFloat(res.data[0]?.column_two || 0),
        this.column_three = parseFloat(res.data[0]?.column_three || 0),
        this.column_four = parseFloat(res.data[0]?.column_four || 0),
        this.column_five = parseFloat(res.data[0]?.column_five || 0),
        this.column_six = parseFloat(res.data[0]?.column_six || 0),
        this.column_seven = parseFloat(res.data[0]?.column_seven || 0),

        this.grandTotal = parseFloat(res.data[0]?.grandTotal || 0)

      this.head_one = res.data[0]?.head_one || '',
        this.head_two = res.data[0]?.head_two || '',
        this.head_three = res.data[0]?.head_three || '',
        this.head_four = res.data[0]?.head_four || '',
        this.head_five = res.data[0]?.head_five || '',
        this.head_six = res.data[0]?.head_six || '',
        this.head_seven = res.data[0]?.head_seven || '',

        this.claim_no = res.data[0]?.claim_no || '',
        this.pre_initmation_number = res.data[0]?.pre_initmation_number || ''
    })

  }



  submitFinallBill() {
    var data = {

      uh_id: this.bill_data[0].uh_id,
      ip_number: this.bill_data[0].ip_number,
      date_of_admit: this.bill_data[0].date_of_admission || '',
      date_of_discharge: this.bill_data[0].date_of_discharge,
      name: this.bill_data[0].name,

      payment_types: this.bill_data[0].payment_types,
      med_claim: this.bill_data[0].med_claim,
      insurance_name: this.bill_data[0].insurance_name,

      column_one: this.column_one,
      column_two: this.column_two,
      column_three: this.column_three,
      column_four: this.column_four,
      column_five: this.column_five,
      column_six: this.column_six,
      column_seven: this.column_seven,

      grandTotal: this.grandTotal,

      head_one: this.head_one || '',
      head_two: this.head_two || '',
      head_three: this.head_three || '',
      head_four: this.head_four || '',
      head_five: this.head_five || '',
      head_six: this.head_six || '',
      head_seven: this.head_seven || '',

      claim_no: this.claim_no,
      pre_initmation_number: this.pre_initmation_number,

    }

    this.showSpinner = true
    this.service.saveIpfinalBillInsurnceMod(data).subscribe((res) => {
      this.showSpinner = false
      if (res.status == 200) {
        alert("Success")
        this.getOrginalDat();
      }
    })



  }


}
