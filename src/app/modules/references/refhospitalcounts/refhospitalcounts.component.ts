// import { Component, OnInit } from '@angular/core';
import { Component, ViewChild } from '@angular/core';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver';
import { ReferserviceService } from '../referservice.service';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-refhospitalcounts',
  templateUrl: './refhospitalcounts.component.html',
  styleUrls: ['./refhospitalcounts.component.scss']
})
export class RefhospitalcountsComponent  {

  typeValidationForm: FormGroup;
  currentDate: any;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i','total_count','referaltype','categorytype','hospital_name','hospital_loc', 'name', 'reffered_by','i_ts'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7','select13','select14'];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

/////new code starts
//  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'service', 'message','its'];
// displayedColumns: string[] = [
//   'id',
//   'total_count',
//   'referaltype',
//   'categorytype',
//   'hospital_name',
//   'hospital_loc',
//   'name',
//   'age',
//   'gender',
//   'phone_number',
//   'marital_status',
//   'address',
//   'reffered_by',
//   'i_ts'
// ];

//   dataSources!: MatTableDataSource<any>;
//   searchKey: string = '';
//   @ViewChild(MatPaginator) paginatorr!: MatPaginator;



displayedColumns: string[] = [
  'id',
  // 'total_count',
  'referaltype',
  'categorytype',
  'hospital_name',
  'hospital_loc',
  'name',
  'age',
  'gender',
  'phone_number',
  'marital_status',
  'address',
  'reffered_by',
  'i_ts'
];

// TABLE 1
dataSource1!: MatTableDataSource<any>;
searchKey1: string = '';
@ViewChild('paginator1') paginator1!: MatPaginator;

// TABLE 2

  constructor(
    public formBuilder: FormBuilder, public datePipe: DatePipe, private myservice: ReferserviceService) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }




  user_id: any
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.typeValidationForm = this.formBuilder.group({
      referaltype:['',],
      op_date: [this.currentDate, [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      yandm: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      aadhar: [''],
      marital_status: ['', [Validators.required]],
      reffered_by: [''],
      address: ['', [Validators.required]],


      categorytype:['',],
      hospital_name:['',],
      hospital_loc:['',]
    });

    this.getReference();
  }
  references: any;

  getReference() {
    this.myservice.getrefernceshospitalcounts().subscribe((res) => {
      this.references = res.data;
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
    

      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  numericOnly(event): boolean {
    let patt = /^([0-9,.,_,/-])$/;
    let result = patt.test(event.key);
    return result;
  }
  typesubmit: boolean = false
  get type() {
    return this.typeValidationForm.controls;
  }
  
  showSpinner: boolean = false;


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
      this.headerclass['background-color'] = 'blue';
      this.reset = '';
    }
    this.clonedata = this.masterdata;
    this.dataSource = new MatTableDataSource(this.clonedata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = null;
    this.dataSource.sort = this.sort;
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


  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }


showreferaldetails:boolean= false;
  referaltype(event){
    
    if(event == 'Referal to Doctor'){
      this.showreferaldetails = true;

    }else{
      this.showreferaldetails = false;
    }
  }







  refhospitalcounts(count:any) {
    var data = count;
   
    this.myservice.getrefernceshospitalselectedcounts(data).subscribe((res) => {
      this.references = res.data;
      this.masterdata = res.data;
     

      if (res.status === 200 && res.data) {
      this.showSpinner = false;
      // Only pass the array to MatTableDataSource
      this.dataSource1 = new MatTableDataSource(res.data);
      this.dataSource1.paginator = this.paginator;
    } else {
      this.dataSource1 = new MatTableDataSource([]);
    }
    });
  }



  applyFilter1() {
  this.dataSource1.filter = this.searchKey1.trim().toLowerCase();
}

clearFilter1() {
  this.searchKey1 = '';
  this.applyFilter1();
}
}