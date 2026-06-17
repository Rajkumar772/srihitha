import { Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosticServicesService } from '../diagnostic-services.service';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-assign-diagnostic-tests',
  templateUrl: './assign-diagnostic-tests.component.html',
  styleUrls: ['./assign-diagnostic-tests.component.scss']
})
export class AssignDiagnosticTestsComponent implements OnInit {

  patientDetailsForm: FormGroup
  patientTestsForm: FormGroup
  editForm: FormGroup


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'print', 'diagnostic_date', 'uh_id', 'patient_type', 'name', 'age', 'gender',
    'address', 'grandtotal', 'discount_per', 'discount_amount', 'after_discount_total', 'payment_mode', 'transaction_id', 'view']
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

  showSpinner: boolean = false;
  submitted: boolean = false;
  grandtotal: any;

  constructor(public router: Router, private formbuilder: FormBuilder, private service: DiagnosticServicesService,
    private modalService: NgbModal) {

    this.patientDetailsForm = this.formbuilder.group({
      uh_id: [''],
      patient_type: ["OP"],
      // sur_name: [''],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      transaction_id: [],
      payment_mode: ['', Validators.required],
      doctor_patient_id: [''],
      grandtotal: [''],
      discount_per: ['', [Validators.required]],
      discount_amount: [''],
      after_discount_total: [''],
    });

    this.patientTestsForm = this.formbuilder.group({
      d_test_name: ['', [Validators.required]],
      d_test_amount: ['', [Validators.required]],
    })

  }

  patientsTstdts: any = [];

  ngOnInit(): void {
    this.getGroupMbrs();
    this.gotDataAllpatients()
    this.getTestnames();
    this.get_tests_from_doctor()
  }

  clcick() {
    this.router.navigate(['/diagnostic-tests/Add-diagnostic-tests'])
  }

  timeslot(event: any) {
    var as = event.value
    this.patientDetailsForm.value.uh_id = ''
    this.patientDetailsForm.patchValue({
      uh_id: '',
      // sur_name: '',
      name: '',
      age: '',
      gender: ''
    });
    if (as == 'OP') {
      this.forOP = true;
      this.forDoctor = false
      this.diagnostic_doctor = []
    } else if (as == 'DOCTOR') {
      this.forOP = false;
      this.forDoctor = true
    }
  }

  addroe() {
    this.submitt = true
    if (this.patientTestsForm.invalid) {
      Swal.fire({
        title: 'Please fill out all required fields',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    } else {
      this.patientsTstdts.push({
        "d_test_name": this.patientTestsForm.value.d_test_name,
        "d_test_amount": this.patientTestsForm.value.d_test_amount,
      })
      let sum = 0;
      this.patientsTstdts.forEach((element) => {
        sum += (element.d_test_amount * 1);
      });
      this.submitt = false;
      this.grandtotal = sum;
      this.patientTestsForm.reset();
    }

  }


  printData(row) {
    sessionStorage.setItem('diagnostic-print', JSON.stringify(row))
    this.router.navigate(['diagnostic-print']);
  }

  hit() {
    var $popup = window.open(
      "diagnostic-print",
      "popup",
      "menubar=1,resizable=1,left=150,top=150,scrollbars=1"
    );
  }

  // submitted: boolean = false;
  submitt: boolean = false;
  forOP: boolean = true
  forDoctor: boolean = false

  get validGrup() {
    return this.patientDetailsForm.controls;
  }

  get validMbr() {
    return this.patientTestsForm.controls;
  }

  Addgroups() {
    this.submitted = true
    if (this.patientDetailsForm.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else if (this.patientsTstdts.length == 0) {
      Swal.fire({
        title: 'Add Test Details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.patientDetailsForm.value.grandtotal = this.grandtotal


      this.showSpinner = true


      this.patientDetailsForm.value.discount_amount = this.patientDetailsForm.value.grandtotal * this.patientDetailsForm.value.discount_per / 100;

      this.patientDetailsForm.value.after_discount_total = this.patientDetailsForm.value.grandtotal - (this.patientDetailsForm.value.grandtotal * this.patientDetailsForm.value.discount_per / 100)

      this.patientDetailsForm.value.after_discount_total = parseFloat(this.patientDetailsForm.value.after_discount_total.toFixed(2));

      var data = {
        'patientsdts': this.patientDetailsForm.value,
        'patientstestdts': this.patientsTstdts
      }

      this.service.addpatientDetailsTests(data).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            title: 'Submitted Successfully',
            position: 'top-end',
            icon: 'success',
            timer: 1500,
          })
          this.patientDetailsForm.reset({
            patient_type: "OP"
          })
          // this.patientDetailsForm.value.patient_type="OP"
          this.patientsTstdts = []
          this.diagnostic_doctor = []
          this.modalService.dismissAll()
          this.getGroupMbrs()
          this.submitted = false
          this.get_tests_from_doctor()
        }
        else {
          Swal.fire({
            title: 'Failed',
            position: 'top-end',
            icon: 'error',
            timer: 1500,
          })
        }
      })
    }

  }

  remove(i, medicine_price) {
    // this.patientsTstdts.splice(index, 1);
    this.grandtotal = (this.grandtotal * 1) - medicine_price;
    this.patientsTstdts.splice(i, 1);
  }

  diagData: any;
  getGroupMbrs() {
    this.showSpinner = true;
    this.service.getpatientsDetailsTests().subscribe((res) => {
      this.showSpinner = false;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.diagData = res.data
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }

  openPopupview(openPopup) {
    this.modalService.open(openPopup, { size: 'xl', centered: true })
  }


  gotAllpatients: any;

  gotDataAllpatients() {
    this.service.getDataAllpatients().subscribe((res) => {
      this.gotAllpatients = res.data;
    });
  }

  getOldOp(e: any) {
    this.gotAllpatients.map((res) => {
      if (res.uh_id == e) {
        this.patientDetailsForm.patchValue({
          // sur_name: res.sur_name,
          name: res.name,
          age: res.age,
          phone_number: res.phone_number,
          gender: res.gender,
          address: res.address
        })
      }
    })
  }

  doctor_data: any
  get_tests_from_doctor() {
    this.showSpinner = true;
    this.service.get_tests_from_doctor().subscribe((res) => {
      this.showSpinner = false;
      this.doctor_data = res.data
    })
  }

  diagnostic_doctor: any = []
  getOp(event: any) {
    this.doctor_data.map((res) => {
      if (res.uh_id == event[1]) {
        this.patientDetailsForm.patchValue({
          uh_id: res.uh_id,
          // sur_name: res.name,
          name: res.full_name,
          age: res.age,
          phone_number: res.phone_number,
          gender: res.gender,
          doctor_patient_id: event[0]
        })
      }
    })
    var data = {
      doctor_id: event[0],
      uh_id: event[1]
    }
    this.service.get_diagnostic_doctor_test(data).subscribe((res) => {

      this.diagnostic_doctor = res.data
    })
  }

  paymentload: boolean = false;
  paymentslot(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload = true
    } else if (as == 'CASH') {
      this.paymentload = false
    }
  }

  diagnosticTests: any;
  getTestnames() {
    this.showSpinner = true;
    this.service.getdiagnosticTests().subscribe((res) => {
      this.showSpinner = false;
      this.diagnosticTests = res.data
     
      
    })
  }


  getTestamnt(e) {
    this.diagnosticTests.map((res) => {
      if (res.d_test_name == e) {
        this.patientTestsForm.patchValue({
          d_test_amount: res.d_test_amount,
        })
      }
    })
  }

  editdatadetails: any
  participant_data: any
  groupMbrsData: any = [];

  // editPatientDetails(data, editFormTempo) {
  //   this.modalService.open(editFormTempo, { centered: true, size: "lg" });
  // }

  record123(viewModal, row) {

    var data = {
      'group_id': row.id,
    }
    this.showSpinner = true
    this.service.getpatientDiagnosticTests(data).subscribe((res) => {
      this.showSpinner = false
      this.groupMbrsData = res.data


    })
    this.modalService.open(viewModal, { centered: true, size: 'lg' })
  }


  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  dismiss() {
    this.modalService.dismissAll();
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


  exportTable(i, organizer_name) {
    TableUtil.exportTableToExcel(i, organizer_name);
  }



  getTotalCost() {
    var grandTotal = 0;
    this.diagData.map((res) => {
      grandTotal += parseInt(res.after_discount_total) || 0;
    })
    return grandTotal;
  }


}
