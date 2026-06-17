import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LabsServicesService } from '../labs-services.service';
import numWords from 'num-words';

@Component({
  selector: 'app-lab-print',
  templateUrl: './lab-print.component.html',
  styleUrls: ['./lab-print.component.scss']
})
export class LabPrintComponent implements OnInit {

  lab_data: any = [];
  name: any
  totalWords: any

  groupTests: any

  constructor(private location: Location, private myservice: LabsServicesService) { }


  typeOfMode: any;

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('labprint'));
    console.log(dta,26);
    
    this.lab_data.push(dta);

    this.func(this.lab_data[0].id)

    this.totalWords = numWords(this.lab_data[0].after_discount_total);

    this.typeOfMode = this.lab_data[0].payment_mode == "CASH" || this.lab_data[0].payment_mode == "UPI" ? 'PAID' : 'FREE'


    setTimeout(() => {
      window.print();
    }, 3000);

  }

  groupMbrsData: any = [];
  grandTotal: any = 0

  func(data1) {
    var data = {
      'group_id': data1,
    }
    this.myservice.getlabTests(data).subscribe((res) => {

      if (this.lab_data[0].group_test_details == 'null') {
        this.groupMbrsData = res.data
      }
      else if (this.lab_data[0].group_test_details !== "null") {
        var groupTestsAll = JSON.parse(this.lab_data[0].group_test_details)
        groupTestsAll.map((item => {
          this.groupMbrsData.push({ labtest_name: item.group_name, amount: item.group_amount })
        }))
        res.data.map((item) => {
          if (parseInt(item.amount) != 0) {
            this.groupMbrsData.push(item)
          }
        }
        )
      }

    })


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
