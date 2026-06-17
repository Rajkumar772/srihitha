import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';


@Component({
  selector: 'app-pharma-dayendprint',
  templateUrl: './pharma-dayendprint.component.html',
  styleUrls: ['./pharma-dayendprint.component.scss']
})
export class PharmaDayendprintComponent implements OnInit {

  currentDate: any;

  constructor(private location: Location,
    private myservice: PharmaserviceService
  ) {

  }


  pharmacydata: any;

  showSpinner: boolean = false

  currntDate: any;

  ngOnInit(): void {

    var data = JSON.parse(sessionStorage.getItem('pharmadayenddata'))

    this.pharmacydata = data


    this.currntDate = this.pharmacydata.masterdata[0].sale_date


    this.getTotalCost(this.pharmacydata.masterdata)
  }


  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }



  FullgrandTotal: any = 0;


  getTotalCost(masterData) {
    const currentDate = new Date(this.pharmacydata.sale_date).toISOString().split('T')[0]; // Current date in YYYY-MM-DD format

    this.FullgrandTotal = 0;

    // Step 1: Calculate initial FullgrandTotal
    masterData?.forEach((res) => {
      // Extract date part from sale_date and bill_modified_date
      const saleDate = res.sale_date ? new Date(res.sale_date).toISOString().split('T')[0] : null;
      const billModifiedDate = res.bill_modified_date ? new Date(res.bill_modified_date).toISOString().split('T')[0] : null;


      // Handle non-CREDIT payments
      if (saleDate === currentDate && billModifiedDate === currentDate) {
        // Both sale_date and bill_modified_date are the current date, add to grandTotal
        if (res.payment_mode === 'CREDIT') {
          // For CREDIT payments, deduct the sale_grandtotal
          this.FullgrandTotal += 0;
        }
        else {
          this.FullgrandTotal += parseFloat(res.sale_grandtotal) || 0;
        }
      } else if (saleDate === currentDate && !billModifiedDate) {
        // sale_date is current date and bill_modified_date is null, add to grandTotal
        if (res.payment_mode === 'CREDIT') {
          // For CREDIT payments, deduct the sale_grandtotal
          this.FullgrandTotal += 0;
        }
        else {
          this.FullgrandTotal += parseFloat(res.sale_grandtotal) || 0;
        }
      } else if (saleDate !== currentDate && billModifiedDate === currentDate) {
        // sale_date is not current date and bill_modified_date is current date, subtract from grandTotal
        if (res.payment_mode === 'CREDIT') {
          // For CREDIT payments, deduct the sale_grandtotal
          this.FullgrandTotal += 0;
        }
        else {
          this.FullgrandTotal -= parseFloat(res.return_amount) || 0;
        }
      } else if (saleDate === currentDate && billModifiedDate !== currentDate) {
        // sale_date is current date and bill_modified_date is not current date, add to grandTotal
        if (res.payment_mode === 'CREDIT') {
          // For CREDIT payments, deduct the sale_grandtotal
          this.FullgrandTotal += 0;
        }
        else {
          this.FullgrandTotal += parseFloat(res.sale_grandtotal) || 0;
        }
      }

    });



    // Step 2: Make the service call

    this.showSpinner = true
    this.myservice.OTreturnsEverydaytotalDeduction(this.pharmacydata).subscribe((res) => {
      this.showSpinner = false
      if (res.data.length) {
        // Deduct the amount returned by the service
        res.data?.forEach((item) => {
          this.FullgrandTotal -= parseFloat(item.grandtotal) || 0;
        });
      } else {
        // No data from service, grandTotal remains the same
      }
    });
  }


}
