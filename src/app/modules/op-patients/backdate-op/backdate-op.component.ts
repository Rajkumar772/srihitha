import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { OpServicesService } from '../op-services.service';


@Component({
  selector: 'app-backdate-op',
  templateUrl: './backdate-op.component.html',
  styleUrls: ['./backdate-op.component.scss']
})



export class BackdateOpComponent {


  typeValidationForm: FormGroup;

  currentDate: any;



  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  nextdisplayedColumns: string[] = ['i', 'date', 'patient_type', 'uh_id',
    'name', 'age', 'gender', 'phone_number', 'consultant_fee', 'payment_types', 'payment_way',
    'cash_cashless', 'expiry_date', 'address', 'complaint' ,  'discount_per' , 'discount_amount' ,  'after_discount_total' ,];
  selectColumns: string[] = ['select1',
    'select2', 'select3', 'select4', 'select5', 'select6', 'select7',
    'select8', 'select9', 'select10', 'select11', 'select12', 'select13',
    'select14',];



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


  constructor(private modalService: NgbModal, private router: Router,
    public formBuilder: FormBuilder, public datePipe: DatePipe, private myservice: OpServicesService) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getDoctors();
   
    this.gotDataAllpatients();
    this.gotBackDatesOP();
    this.typeValidationForm = this.formBuilder.group({

      op_date: ['', [Validators.required]],
      appointment_type: ['', [Validators.required]],
      patient_type: ['', [Validators.required]],


      // sur_name: [''],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      guardian: [],
      aadhar: [],
      occupation: [],
      complaint: ['',],
      address: [],
      description: [''],

      payment_types: ['CASH',],
      consultant_fee: [500, [Validators.required]],
      days_to_expiry: [15, [Validators.required]],
      expiry_date: [''],




      dpt_name: [''],
      d_name: [''],


      old_uhid_no: [''],
      cash_cashless: [''],
      payment: [''],
      transcation_id: [''],

      discount_per: ['', [Validators.required]],
      discount_amount: [''],
      after_discount_total: ['']

    });

  }


  gotAllpatients: any;
  showSpinner: boolean = false;

  gotDataAllpatients() {
    this.showSpinner = true
    this.myservice.getAllPateintDtsfill().subscribe((res) => {
      this.showSpinner = false
      this.gotAllpatients = res.data;

    });
  }


  numericOnly(event): boolean {
    let patt = /^([0-9,/,.,])$/;
    let result = patt.test(event.key);
    return result;
  }


  typesubmit: boolean = false
  get type() {
    return this.typeValidationForm.controls;
  }



  insurance_data: any


  stopPmntMode: boolean = true;
  doctorData: any;

  getDoctors() {
    this.myservice.getDoctorsData().subscribe((res) => {
      this.doctorData = res.data;
    });
  }

  autoFdoctor(e) {
    this.doctorData.map((res) => {
      if (res.doctor_name == e) {
        this.typeValidationForm.patchValue({
          dpt_name: res.doctor_dept,
        });
      }
    });
  }



  patientTypeCond: boolean = false



  getPatientype(e: any) {
    this.typeValidationForm.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      // sur_name: '',
      phone_number: '',
    })

    this.typeValidationForm.get('consultant_fee').setValue(500);
    this.typeValidationForm.get('days_to_expiry').setValue(15);

    if (e == 'NEW') {
      this.patientTypeCond = false
      this.typeValidationForm.patchValue({
        patient_type: e
      })
    }
    else if (e == 'OLD') {
      this.patientTypeCond = true
      this.typeValidationForm.patchValue({
        patient_type: e
      })
    }
  }



  selectOpnumber(e) {

    this.typeValidationForm.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      // sur_name: '',
      patient_type: '',
      phone_number: ''
    })
    this.typeValidationForm.get('consultant_fee').setValue(500);
    this.typeValidationForm.get('days_to_expiry').setValue(15);

    var results = this.gotAllpatients.filter(item => item.uh_id === e);

    if (results.length) {
      this.typeValidationForm.patchValue({
        old_uhid_no: results[0].uh_id,
        name: results[0].name,
        age: results[0].age,
        gender: results[0].gender,
        // sur_name: results[0].sur_name,
        patient_type: 'OLD',
        phone_number: results[0].phone_number
      })
      this.getOldOp(results[0].uh_id);
    }

  }

  expiryDateIfOld: any;
  dated: any;
  checkingGotValue: any;



  getOldOp(e: any) {

    var data = { 'uh_id_no': e }
    this.myservice.checkCardRnwlforUho(data).subscribe((res) => {
      this.expiryDateIfOld = res.data[0].expiry_date;
      this.dated = this.datePipe.transform(new Date(), 'MM/dd/yyyy');

      var ated = this.datePipe.transform(res.data[0].expiry_date, 'MM/dd/yyyy');
      if (ated <= this.dated) {
        Swal.fire({
          icon: 'error',
          title: 'Do Card Renewal',
          text: 'Required',
          timer: 1500
        });
        this.stopPmntMode = true
        this.checkingGotValue = "CARD OVER";
        this.typeValidationForm.get('days_to_expiry').setValue(15);
        this.typeValidationForm.get('consultant_fee').setValue(500);

      } else {
        Swal.fire({
          icon: 'success',
          title: 'Card Still Exists',
          text: 'Required',
          timer: 1500
        });
        this.stopPmntMode = false;
        this.typeValidationForm.get('payment_types').setValue('No Payment Need');
        this.typeValidationForm.get('days_to_expiry').setValue(15);
        this.typeValidationForm.get('consultant_fee').setValue(0);
        this.typeValidationForm.get('discount_per').setValue(0);
        this.payment_type = false;
        this.cashorCashless = false;
        this.upi_type = '';
        this.checkingGotValue = "CARD EXISTS";

      }
    })
  }




  cashorCashless: Boolean = false
  payment_type: Boolean = true


  timeslot1(event: any) {
    var a = event.value;

    this.typeValidationForm.get('cash_cashless')?.reset();
    this.typeValidationForm.get('payment')?.reset();
    this.typeValidationForm.get('transcation_id')?.reset();

    if (a == "CASHLESS") {
      this.cashorCashless = true;
      this.payment_type = false;
      this.typeValidationForm.get('consultant_fee').setValue(0);
      this.typeValidationForm.get('days_to_expiry').setValue(15);
      this.typeValidationForm.get('discount_per').setValue(0);
      this.upi_type = 'CASH';
    } else if (a == "CASH") {
      this.payment_type = true;
      this.cashorCashless = false;
      this.typeValidationForm.get('consultant_fee').setValue(500);
      this.typeValidationForm.get('days_to_expiry').setValue(15);
    }



  }

  upi_type: any
  upidr(event) {
    this.upi_type = event;
  }



  functionFordates() {
    if (!this.typeValidationForm.get('patient_type')) {
      Swal.fire({ icon: 'question', title: 'Give Patient Type', text: 'Required', timer: 1500 });
    } else {
      var gotPatientType = this.typeValidationForm.get('patient_type').value;
      if (gotPatientType == 'NEW') {

        var DAYS = this.typeValidationForm.value.days_to_expiry;

        var givenDate = this.typeValidationForm.value.op_date;
        var date = new Date(givenDate);

        date.setDate(date.getDate() + DAYS * 1);

        this.typeValidationForm.value.expiry_date = date.toLocaleDateString();
      }
      else if (gotPatientType == 'OLD') {

        if (this.checkingGotValue == 'CARD EXISTS') {
          this.typeValidationForm.get('days_to_expiry').setValue(0)
          this.typeValidationForm.get('expiry_date').setValue(this.expiryDateIfOld)
          this.typeValidationForm.get('consultant_fee').setValue(0)
        }
        else if (this.checkingGotValue == 'CARD OVER') {

          var DAYS = this.typeValidationForm.value.days_to_expiry;

          var givenDate = this.typeValidationForm.value.op_date;

          var date = new Date(givenDate);
          date.setDate(date.getDate() + DAYS * 1);

          this.typeValidationForm.value.expiry_date = date.toLocaleDateString();

        }
      }
    }
  }




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
    }
    else if (this.typeValidationForm.value.payment_types == "No Payment Need") {
      this.typeValidationForm.value.payment_types = 'No Payment Need'
      this.typeValidationForm.value.cash_cashless = '-'
      this.typeValidationForm.value.payment = '-'
      this.typeValidationForm.value.transcation_id = '-'
      this.callthisFunctionToSubmit();
    }
    else {
      if (this.typeValidationForm.value.payment_types == '') {
        Swal.fire({
          position: 'top-end', icon: 'error', title: 'Select Mode of Payment',
          text: 'Required', showCancelButton: false, timer: 1500
        })
        this.showSpinner = false;
      } else if (this.typeValidationForm.value.payment_types == 'CASH' && (this.typeValidationForm.value.payment == '' ||
        this.typeValidationForm.value.payment == null)) { // cash
        Swal.fire({
          position: 'top-end', icon: 'error', title: 'Select Payment Way', text: 'Required',
          showCancelButton: false, timer: 1500
        })
        this.showSpinner = false;
      }
      else if (this.typeValidationForm.value.payment_types == 'CASH' && this.typeValidationForm.value.payment == 'UPI' &&
        (this.typeValidationForm.value.transcation_id == '' ||
          this.typeValidationForm.value.transcation_id == null)) { // cash
        Swal.fire({
          position: 'top-end', icon: 'error', title: 'Give Transcation ID', text: 'Required',
          showCancelButton: false, timer: 1500
        })
        this.showSpinner = false;
      }
      else if (this.typeValidationForm.value.payment_types == 'CASHLESS' && (this.typeValidationForm.value.cash_cashless == '' ||
        this.typeValidationForm.value.cash_cashless == null)) { // cash
        Swal.fire({
          position: 'top-end', icon: 'error', title: 'Select Insurance Type',
          text: 'Required', showCancelButton: false, timer: 1500
        })
        this.showSpinner = false;
      }
      else {
        this.callthisFunctionToSubmit();
      }
    }


  }



  callthisFunctionToSubmit() {
    this.functionFordates();
    this.showSpinner = true

    this.typeValidationForm.value.discount_amount = this.typeValidationForm.value.consultant_fee * this.typeValidationForm.value.discount_per / 100;

    this.typeValidationForm.value.after_discount_total = this.typeValidationForm.value.consultant_fee - (this.typeValidationForm.value.consultant_fee
      * this.typeValidationForm.value.discount_per / 100)

    this.typeValidationForm.value.after_discount_total = parseFloat(this.typeValidationForm.value.after_discount_total.toFixed(2));

    this.myservice.addpatients(this.typeValidationForm.value).subscribe((res: any) => {
      if (res.status == 200) {
        Swal.fire({
          position: "top-end", icon: "success", title: "Successfully Submitted",
          showConfirmButton: false, timer: 1500
        });
        this.showSpinner = false;
        this.typesubmit = false;
        this.typeValidationForm.reset();
        this.ngOnInit();
        this.checkingGotValue = ''
        this.expiryDateIfOld = ''
        this.stopPmntMode = true
        this.patientTypeCond = false;
      } else {
        Swal.fire("Failed");
        this.showSpinner = false;
      }
    });
  }


  clcick() {
    this.router.navigate(["/op-patients/op-patients-list"]);
  }






  gotBackDatesOP() {
    this.showSpinner = true
    this.myservice.getBackDatesOP().subscribe((res: any) => {
      this.showSpinner = false
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }


  exportTable(i, name_of_the_institutions) {
    TableUtil.exportTableToExcel(i, name_of_the_institutions);
  }

}