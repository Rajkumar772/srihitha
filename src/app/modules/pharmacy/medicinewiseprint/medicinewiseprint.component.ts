import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';

@Component({
  selector: 'app-medicinewiseprint',
  templateUrl: './medicinewiseprint.component.html',
  styleUrls: ['./medicinewiseprint.component.scss']
})
export class MedicinewiseprintComponent implements OnInit {

  currentDate: any;
  showSpinner: boolean = false

  constructor(private location: Location,
    private myservice: PharmaserviceService) {

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
  medicinewisedata: any;

  ngOnInit(): void {
    var data = JSON.parse(sessionStorage.getItem('medicine-wise-print'))
    this.medicinewisedata = data
  }

}
