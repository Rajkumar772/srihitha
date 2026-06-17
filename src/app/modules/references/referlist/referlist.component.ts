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
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-referlist',
  templateUrl: './referlist.component.html',
  styleUrls: ['./referlist.component.scss']
})
export class ReferlistComponent {

  typeValidationForm: FormGroup;
  currentDate: any;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'referaltype', 'categorytype', 'hospital_name', 'hospital_loc', 'name', 'age', 'gender', 'phone_number', 'marital_status', 'address', 'reffered_by'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10', 'select11', 'select12'];
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
      referaltype: ['',],
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


      categorytype: ['',],
      hospital_name: ['',],
      hospital_loc: ['',]
    });

    this.getReference();
  }
  references: any;

  getReference() {
    this.myservice.getrefernces().subscribe((res) => {
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
  submitForm() {
    this.typesubmit = true;
    if (this.typeValidationForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: "question",
        title: "Please Give required Details",
        showCancelButton: false,
        timer: 1400
      });
      return; // Exit the function if form is invalid
    }
    else {
      var data = {
        op_date: this.typeValidationForm.value.op_date,
        name: this.typeValidationForm.value.name,
        age: this.typeValidationForm.value.age,
        yandm: this.typeValidationForm.value.yandm,
        phone_number: this.typeValidationForm.value.phone_number,
        gender: this.typeValidationForm.value.gender,
        aadhar: this.typeValidationForm.value.aadhar,
        marital_status: this.typeValidationForm.value.marital_status,
        reffered_by: this.typeValidationForm.value.reffered_by,
        address: this.typeValidationForm.value.address,



        referaltype: this.typeValidationForm.value.referaltype,
        categorytype: this.typeValidationForm.value.categorytype,
        hospital_name: this.typeValidationForm.value.hospital_name,
        hospital_loc: this.typeValidationForm.value.hospital_loc,



        user_id: this.user_id,
        usr_nm: this.usr_nm
      }
    }

    this.myservice.addRefferedBY(data).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Submitted',
          showConfirmButton: false,
          timer: 1500
        })
        this.showSpinner = false
        this.typesubmit = false;
        this.typeValidationForm.reset();
        this.getReference();
      } else {
        Swal.fire('Failed');
        this.showSpinner = false
      }
    })
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


  showreferaldetails: boolean = false;
  referaltype(event) {
    if (event == 'Referal to Doctor') {
      this.showreferaldetails = true;

    } else {
      this.showreferaldetails = false;
    }


  }
}
