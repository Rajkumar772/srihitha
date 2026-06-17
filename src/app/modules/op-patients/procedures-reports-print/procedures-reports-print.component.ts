import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OpServicesService } from '../op-services.service';
import numWords from 'num-words';

@Component({
  selector: 'app-procedures-reports-print',
  templateUrl: './procedures-reports-print.component.html',
  styleUrls: ['./procedures-reports-print.component.scss']
})
export class ProceduresReportsPrintComponent implements OnInit {

  constructor(private location: Location,private service: OpServicesService) { }

  proceduredata:any[]=[];
  TakingObject:any
  showSpinner: boolean = false;
  INwords: any;

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('procedure-reports-print'));
    this.proceduredata.push(dta);
    this.func(this.proceduredata[0].id)
    this.TakingObject = this.proceduredata[0]
    this.INwords = numWords(parseInt(this.proceduredata[0]?.totalAmountAftrgst));
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }
  
  Back() {
    this.location.back();
  }

  procedurepatientdata: any;

  func(data1) {
    var data = {
      'procedure_id': data1,
    }
    this.showSpinner = true
    this.service.getproceduredetailsdata(data).subscribe((res) => {
      this.showSpinner = false;
      this.procedurepatientdata = res.data
    })
  }

}
