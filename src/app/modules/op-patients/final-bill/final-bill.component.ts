import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';

@Component({
  selector: 'app-final-bill',
  templateUrl: './final-bill.component.html',
  styleUrls: ['./final-bill.component.scss']
})

export class FinalBillComponent implements OnInit {
  showSpinner: boolean = false
  typeValidationForm: FormGroup
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  currentDate: any;
  nextdisplayedColumns: string[] = ['i', 'd_name', 'old_uhid_no', 'name', 'age', 'gender', 'phone_number', 'address', 'final_bill'];
  selectColumns: string[] = ['selectSlno'];
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

  updateFormMRD: FormGroup;
  finalbillSearch: FormGroup;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private service: InPatienrservicesService, private router: Router, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.typeValidationForm = this.formBuilder.group({
      d_name: ['', [Validators.required]],
      op_date: [this.currentDate, [Validators.required]],
      // sur_name: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      old_uhid_no: [''],
      user_id: [''],
      usr_nm: [''],
    });

    this.finalbillSearch = this.formBuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getCallMain();
    this.gotDataAllpatients();
    this.getdoctorname();
  }

  submitt: boolean = false
  get validDate() {
    return this.finalbillSearch.controls;
  }

  SearchDATE() {
    this.submitt = true
    if (this.finalbillSearch.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.showSpinner = true
      this.service.getfinalbillData(this.finalbillSearch.value).subscribe((res) => {
        this.showSpinner = false;
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
  }

  getCallMain() {
    this.showSpinner = true
    this.service.finalbilldatas().subscribe((res: any) => {
      this.showSpinner = false
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  get type() {
    return this.typeValidationForm.controls
  }

  typesubmit: boolean = false;
  submitForm() {
    this.typesubmit = true
    if (this.typeValidationForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: "question",
        title: "Please Give requied Details",
        showCancelButton: false,
        timer: 1500
      })
    } else {
      this.showSpinner = true;
      this.typeValidationForm.value.user_id = localStorage.getItem('user_id'),
        this.typeValidationForm.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.addfinalbilling(this.typeValidationForm.value).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: "top-end", icon: "success", title: "Successfully Submitted",
              showConfirmButton: false, timer: 1500
            });
            this.showSpinner = false;
            this.typesubmit = false;
            this.finalbillprint(this.typeValidationForm.value);
            this.typeValidationForm.reset();
            this.modalDismiss()
            this.getCallMain();
          } else {
            Swal.fire("Failed");
            this.showSpinner = false;
          }
        });
    }
  }

  finalbillprint(invoice) {
    Swal.fire({
      title: 'Do You Want FinalBill Print ',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem('finalbillprints', JSON.stringify(invoice))
        this.router.navigate(['op_finallbill']);
      }
      this.modalService.dismissAll();
      this.closeModal();
    })
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  closeModal() {
    this.typeValidationForm.reset(this.initialValues);
  }

  //////////////////////// medicine code  end *****************************************
  //table code Start
  selectOpnumber(e) {
    this.typeValidationForm.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      // sur_name: '',
      patient_type: '',
      phone_number: '',
      address: ''
    })
    var results = this.gotAllpatients.filter(item => item.uh_id === e);
    if (results.length) {
      this.typeValidationForm.patchValue({
        old_uhid_no: results[0].uh_id,
        name: results[0].name,
        age: results[0].age,
        gender: results[0].gender,
        // sur_name: results[0].sur_name,
        phone_number: results[0].phone_number,
        address: results[0].address
      })
    }
  }

  gotAllpatients: any;
  gotDataAllpatients() {
    this.showSpinner = true
    this.service.getAllPateintDtsfill().subscribe((res) => {
      this.showSpinner = false
      this.gotAllpatients = res.data;
    });
  }

  gotdoctorname: any = [];

  getdoctorname() {
    this.service.getdoctorname().subscribe((res) => {
      this.gotdoctorname = res.data;
    })
  }

  modalDismiss() {
    this.modalService.dismissAll();
  }
  openmodal(addcloseform: any) {
    this.modalService.open(addcloseform, { size: 'xl', centered: true });
  }
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
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }

}



