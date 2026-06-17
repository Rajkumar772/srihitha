import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OpServicesService } from '../op-services.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-op-old-patients',
  templateUrl: './op-old-patients.component.html',
  styleUrls: ['./op-old-patients.component.scss']
})
export class OpOldPatientsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'phone_number', 'patient_type', 'uh_id', 'name', 'age', 'gender', 'date'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8'];
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
    'backgroundColor': 'black',
    'color': 'white'
  };

  op_old: FormGroup
  typesubmit: boolean = false
  currentDate: any;

  constructor(public router: Router,
    public service: OpServicesService,
    public formBuilder: FormBuilder, private datePipe: DatePipe) {

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.op_old = this.formBuilder.group({
      phone_number: ['', [Validators.required]],
      patient_type: ['OLD', [Validators.required]],
      uh_id: ['', [Validators.required]],
      // sur_name: [''],
      days_to_expiry: [15,],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      arrived_date: ['', [Validators.required]],
      expiry_date: ['']
    })

  }

  disableManualInput(event: KeyboardEvent) {
    event.preventDefault();
  }

  get type() {
    return this.op_old.controls
  }

  ngOnInit(): void {
    this.getOldOp()
  }

  clcick() {
    this.router.navigate(["/op-patients/add-patient"]);
  }

  typeSubmit() {
    this.typesubmit = true;
    if (this.op_old.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Fill All Details',
        text: 'Required',
        showCancelButton: false, timer: 1500
      })
    } else {

      let uppercaseUhId = this.op_old.value.uh_id.toUpperCase();
      this.op_old.value.uh_id = uppercaseUhId
      var DAYS = 15;
      var date = new Date(this.op_old.value.arrived_date);
      date.setDate(date.getDate() + DAYS * 1);
      this.op_old.value.expiry_date = date.toLocaleDateString();
    
      this.service.op_old_patient(this.op_old.value).subscribe((res: any) => {
        if (res.status = 200) {
          Swal.fire({
            position: 'top-end',
            icon: "success",
            title: "Successfully Submitted",
            showCancelButton: false, timer: 1500
          })
          this.typesubmit = false;
          this.op_old.reset()
          this.getOldOp()
        } else {
          Swal.fire("Failed");
        }
      })
    }
  }
  hideme: boolean[] = [];
  data: any = [];


  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  opdata: any = [];
  getOldOp() {
    this.service.gettingOlddata().subscribe((res) => {
      this.opdata = res.data;
      for (let i = 0; i < this.opdata.length; i++) {
        this.hideme.push(true);
      }
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  // Accept Input As a Number Only
  numericOnly(event): boolean {
    let patt = /^([0-9,/,.,])$/;
    let result = patt.test(event.key);
    return result;
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
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
      this.headerclass['background-color'] = 'black';
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

}
