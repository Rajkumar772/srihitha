import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PharmaserviceService } from '../pharmaservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';


@Component({
  selector: 'app-pharma-credithistory',
  templateUrl: './pharma-credithistory.component.html',
  styleUrls: ['./pharma-credithistory.component.scss']
})
export class PharmaCredithistoryComponent implements OnInit {



  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'sale_date', 'sale_bill_no', 'uh_id', 'patient_type', 'patient_name',
    'patient_number', 'payment_mode', 'sale_without_discount_total', 'sale_gst_amount', 'sale_disc_percnt',
    'sale_grandtotal', 'no_of_items']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4'];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'dodgerblue',
    'color': 'white'
  };

  showSpinner: boolean = false;

  constructor(private service: PharmaserviceService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.GetCreditBillsHistory()
  }







  //table code Start
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  originalandtoggle(index) {

    if (index) {
      this.hideselect = !this.hideselect;
    } else {
      this.hideselect = false;
      this.headerclass['background-color'] = 'blue ';
      this.reset = '';
    }
    this.clonedata = this.masterdata;
    this.dataSource = new MatTableDataSource(this.clonedata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = null;
    this.dataSource.sort = this.sort;
  }
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }
  columnfilterdata(object, index) {
    if (object == undefined) {
      this.clonedata = this.masterdata;
      this.reset = '';
    } else {
      if (index == 0) {
        this.clonedata = this.clonedata.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSource = new MatTableDataSource(this.clonedata);
  }


  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }


  salesReports() {
    this.router.navigate(['/pharmacy/salesitemsreports'])
  }







  GetCreditBillsHistory() {
    this.showSpinner = true
    this.service.getCreditBilsHistory().subscribe((res: any) => {
      this.showSpinner = false
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NO DATA FOUND'
        })
      }
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }








  functionToGetRange() {
    const from_date = document.getElementById('from_date') as HTMLInputElement;
    const to_date = document.getElementById('to_date') as HTMLInputElement;

    if (from_date.value && to_date.value) {
      var data = {
        from_date: from_date.value,
        to_date: to_date.value
      }

      this.showSpinner = true
     
      this.service.getDatesofCreditHistorys(data).subscribe((res: any) => {
        this.showSpinner = false
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        res.data.map((res, index) => {
          res.i = ++index;
        })
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    } else {
      Swal.fire({
        position: 'top-end',
        title: 'Please select both dates.',
        icon: 'error',
        timer: 1500
      })
    }

  }

}
