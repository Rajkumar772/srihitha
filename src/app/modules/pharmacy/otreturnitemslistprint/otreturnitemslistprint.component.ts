import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PharmaserviceService } from '../pharmaservice.service';

@Component({
  selector: 'app-otreturnitemslistprint',
  templateUrl: './otreturnitemslistprint.component.html',
  styleUrls: ['./otreturnitemslistprint.component.scss']
})
export class OtreturnitemslistprintComponent implements OnInit {
  otreturnslistitems: any = [];


  userName: any;

  mainItem: any;

  constructor(private location: Location, private service: PharmaserviceService) {
    this.userName = (localStorage.getItem('usr_nm'));
  }

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('otitemslist'));
    this.otreturnslistitems = dta;
    this.mainItem = [this.otreturnslistitems[0]]
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
