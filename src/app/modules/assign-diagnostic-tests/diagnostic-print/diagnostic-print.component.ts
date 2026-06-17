import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DiagnosticServicesService } from '../diagnostic-services.service';
import numWords from 'num-words';

@Component({
  selector: 'app-diagnostic-print',
  templateUrl: './diagnostic-print.component.html',
  styleUrls: ['./diagnostic-print.component.scss']
})
export class DiagnosticPrintComponent implements OnInit {
  test_data: any[] = [];
  groupMbrsData: any[] = [];
  numberInWords: any;
  phone_number:any

  constructor(private location: Location,private service: DiagnosticServicesService) { }
  name:any
  ngOnInit(): void {
  
    var test_data = JSON.parse(sessionStorage.getItem('diagnostic-print'));
    this.phone_number = sessionStorage.getItem('phone_number');
  
    this.test_data.push(test_data);
    
    this.func(this.test_data[0].id);

    this.name=localStorage.getItem('usr_nm');

    setTimeout(() => {
      window.print();
    }, 700);
  }
  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  grandTotal: any = 0
  totalWords:any;
  func(data1) {
    
    var data = {
      'group_id': data1,
    }
   
    this.service.getpatientDiagnosticTests(data).subscribe((res) => {
      this.groupMbrsData = res.data
      
console.log(res.data);

      let sum = 0;

      this.groupMbrsData.map((item) => {
        sum += parseInt(item.d_test_amount)

      })

      this.grandTotal = sum;
     
    this.numberInWords = numWords(this.grandTotal);
   
    })
  }


}
