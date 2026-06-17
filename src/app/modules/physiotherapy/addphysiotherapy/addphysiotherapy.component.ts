import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import Swal from 'sweetalert2';
import { PhysiotherapyserviceService } from '../physiotherapyservice.service';

@Component({
  selector: 'app-addphysiotherapy',
  templateUrl: './addphysiotherapy.component.html',
  styleUrls: ['./addphysiotherapy.component.scss']
})
export class AddphysiotherapyComponent  {


  typeValidationForm: FormGroup;
  currentDate: any;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  restOfColumns: string[] = [];

  nextdisplayedColumns: string[] = ['i',  'op_date', 'name', 'age', 'gender', 'phone_number', 'address', 'consultant_fee', 'payment', 'i_ts'];
  selectColumns: string[] = [];
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


  constructor(private modalService: NgbModal, private router: Router,
    public formBuilder: FormBuilder, public datePipe: DatePipe, private myservice: PhysiotherapyserviceService) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  user_id: any
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.gotDataAllpatients();
    this.typeValidationForm = this.formBuilder.group({
      op_date: [this.currentDate, [Validators.required]],
      title: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      yandm: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      consultant_fee: ['',],
      payment: [''],
      user_id: [''],
      usr_nm: [''],
    });
  }

  gotAllpatients: any;


  gotDataAllpatients() {
    this.myservice.getphysiotherapy().subscribe((res) => {
      this.gotAllpatients = res.data;
      for (let i = 0; i < this.gotAllpatients.length; i++) {
      }
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

  //////mat table
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
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }
  masterdata_main: any;
  forshowdisplay1: any = [];
  printData(row) {
    sessionStorage.setItem('opprint', JSON.stringify(row))
    this.router.navigate(['op-print']);
  }
  print(row) {
    sessionStorage.setItem('vitalprint', JSON.stringify(row))
    this.router.navigate(['vital-print']);
  }
  showSpinner: boolean = false;
  submitted: boolean = false;
  submitForm() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.typeValidationForm.invalid) {
      alert("Please fill the details");
      this.showSpinner = false;
    }

    else {
      var data = {
        op_date: this.typeValidationForm.value.op_date,
        title: this.typeValidationForm.value.title,
        phone_number: this.typeValidationForm.value.phone_number,
        name: this.typeValidationForm.value.name,
        age: this.typeValidationForm.value.age,
        yandm: this.typeValidationForm.value.yandm,
        gender: this.typeValidationForm.value.gender,
        address: this.typeValidationForm.value.address,
        consultant_fee: this.typeValidationForm.value.consultant_fee,
        payment: this.typeValidationForm.value.payment,
        user_id: this.user_id,
        usr_nm: this.usr_nm
      };
      this.myservice.addphysiotherapy(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.showSpinner = false;
          this.submitted = false;
          this.typeValidationForm.reset();
          this.modalService.dismissAll();
        } else {
          Swal.fire('Failed');
          this.showSpinner = false;
          this.submitted = false;
        }
      })
    }
  }


   exportColumns: string[] = ['i', 'roomtype'];   
    exportTable() {
      TableUtil.exportTableToExcel('exportTable', 'Physiotherapy'); // table id, file name
    }
}
