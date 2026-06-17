import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { OpServicesService } from '../op-services.service';
// import 'jspdf-autotable';

@Component({
  selector: 'app-procedures',
  templateUrl: './procedures.component.html',
  styleUrls: ['./procedures.component.scss']
})
export class ProceduresComponent {

  ProcedureForm: FormGroup;
  showSpinner: boolean = false;
  patientdetailsform: FormGroup;
  ngSelectControl = new FormControl();
  user_id: any;
  usr_nm: any;
  currentDate: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private service: OpServicesService, private router: Router, public datePipe: DatePipe,) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.patientdetailsform = this.formBuilder.group({
      old_uhid_no: [''],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      date: [this.currentDate, [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      d_name: ['', [Validators.required]],
      payment_mode: ['', [Validators.required]],
      transaction_id: [''],
      cash_amount: [''],
      upi_amount: ['']
    });

    this.ProcedureForm = this.formBuilder.group({
      procedure_type: ['', [Validators.required]],
      procedure_type_id: ['', [Validators.required]],
      der_aes_procedure_type: ['', [Validators.required]],
      der_aes_procedure_type_id: ['', [Validators.required]],
      sub_der_aes_procedure_type: [''],
      grandtotal: [''],
      gst_amount: [''],
      totalAmountAftrgst: [''],
      gst_percentage: [''],
      amount: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getdoctorname();
    this.gotDataAllpatients();
    this.gotprocceduretypedata();
    this.ngSelectControl.setValue(0);
  }

  gotdoctorname: any = [];

  getdoctorname() {
    this.showSpinner = true;
    this.service.getdoctorname().subscribe((res) => {
      this.showSpinner = false;
      this.gotdoctorname = res.data;
    })
  }

  gotAllpatients: any;
  gotDataAllpatients() {
    this.showSpinner = true
    this.service.getAllPateintDtsfill().subscribe((res) => {
      this.showSpinner = false
      this.gotAllpatients = res.data;
    });
  }

  selectOpnumber(e) {
    this.showSpinner = true
    this.patientdetailsform.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      patient_type: '',
      phone_number: '',
      address: ''
    })
    this.showSpinner = false
    var results = this.gotAllpatients.filter(item => item.uh_id === e);
    if (results.length) {
      this.patientdetailsform.patchValue({
        old_uhid_no: results[0].uh_id,
        name: results[0].name,
        age: results[0].age,
        gender: results[0].gender,
        phone_number: results[0].phone_number,
        address: results[0].address
      })
    }
  }


  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  addprocedurearray: any = []
  addproceduredata() {
    if (this.ProcedureForm.invalid) {
      Swal.fire('Please Give Details');
    } else {
      this.addprocedurearray.push({
        'procedure_type': this.ProcedureForm.value.procedure_type,
        'procedure_type_id': this.ProcedureForm.value.procedure_type_id,
        'der_aes_procedure_type': this.ProcedureForm.value.der_aes_procedure_type,
        'der_aes_procedure_type_id': this.ProcedureForm.value.der_aes_procedure_type_id,
        'sub_der_aes_procedure_type': this.ProcedureForm.value.sub_der_aes_procedure_type,
        'amount': this.ProcedureForm.value.amount
      })
      let sum = 0;
      this.addprocedurearray.forEach((element) => {
        sum += parseInt(element.amount);
      });
      this.grandtotal = sum;
      this.ProcedureForm.reset()
      this.addGSTToOverall(0, "add");
      this.showSubcategory = false
    }
  }

  grandtotal: any = 0;
  remove(i, cosmetic_price) {
    this.grandtotal = (parseInt(this.grandtotal) * 1) - parseInt(cosmetic_price);
    this.addprocedurearray.splice(i, 1);
    this.addGSTToOverall(0, "dlt");
  }

  gst_amount = 0
  gst_percentage: any = 0;
  totalAmountAftrgst = 0;

  addGSTToOverall(event, passArg) {
    this.gst_amount = 0
    this.gst_percentage = 0
    this.totalAmountAftrgst = 0;
    this.ngSelectControl.setValue(0);
    if (event == 0 && passArg == "dlt" || event == 0 && passArg == "add") {
      this.gst_amount = 0
      this.gst_percentage = 0
      this.ngSelectControl.setValue(0);
      this.totalAmountAftrgst = Math.round(this.grandtotal)
    }

    else if (event == 0 && passArg == 0) {
      this.gst_amount = 0
      this.gst_percentage = 0
      this.ngSelectControl.setValue(0);
      this.totalAmountAftrgst = Math.round(this.grandtotal)
    }

    else {
      this.ngSelectControl.setValue(event);
      this.gst_amount = event;
      var bothPlusGstSUMandGrandTotal = this.grandtotal
      this.gst_percentage = bothPlusGstSUMandGrandTotal * event / 100;
      this.totalAmountAftrgst = bothPlusGstSUMandGrandTotal + (bothPlusGstSUMandGrandTotal * event / 100)
      this.totalAmountAftrgst = Math.round(this.totalAmountAftrgst)
      this.ProcedureForm.patchValue({
        amount: this.grandtotal,
        grandtotal: Math.round(this.totalAmountAftrgst)
      })
    }
    this.ProcedureForm.reset()
  }

  typesubmit: boolean = false;
  get type() {
    return this.patientdetailsform.controls
  }

  submitForm() {
    this.typesubmit = true;
    if (this.patientdetailsform.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Details",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    } else if (this.addprocedurearray.length == 0) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter Medicines",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.ProcedureForm.value.grandtotal = parseInt(this.grandtotal);
      if (this.patientdetailsform.value.payment_mode == 'BOTH') {
        const cashAmount = parseFloat(this.patientdetailsform.value.cash_amount);
        const upiAmount = parseFloat(this.patientdetailsform.value.upi_amount);
        const grandtotal = parseFloat(this.ProcedureForm.value.grandtotal);
        if (isNaN(cashAmount) || isNaN(upiAmount)) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Both Cash and UPI Amounts",
            showConfirmButton: false,
            timer: 1500
          });
          return; // Exit the function if validation fails
        }
        const totalAmount = cashAmount + upiAmount;

        if (totalAmount !== grandtotal) {
          Swal.fire({
            title: "Error",
            html: `
                    <div style="text-align: left;">
                      <p>The total amount must be exactly equal to the total amount.</p>
                      <p>Please pay <strong>${grandtotal} Rps</strong> in total (Cash + UPI).</p>
                    </div>`,

            icon: "warning"
          });
          return; // Exit the function if validation fails
        }
      }
      var data = {
        patientdetail: this.patientdetailsform.value,
        addprocedurearray: this.addprocedurearray,
        grandtotal: this.grandtotal,
        gst_amount: this.gst_amount,
        totalAmountAftrgst: this.totalAmountAftrgst,
        gst_percentage: this.gst_percentage,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      };
      this.showSpinner = true
      this.service.addprocedurebilling(data).subscribe((res: any) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Submitted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.typesubmit = false;
          this.patientdetailsform.reset();
          this.addprocedurearray = [];
          this.grandtotal = 0;
          this.gst_amount = 0;
          this.gst_percentage = 0
          this.totalAmountAftrgst = 0;
        } else {
          Swal.fire("Failed");
        }
      });
    }
  }

  modalDismiss() {
    this.modalService.dismissAll();
  }

  upi_type: any
  showTwoAmounts: string;
  upidr(event: string) {
    this.upi_type = event;
    this.showTwoAmounts = event;

    // Reset the form fields based on the payment type
    if (event === 'CASH') {
      this.clearFields(['upi_amount', 'transcation_id']); // Clear UPI related fields
    }
    else if (event === 'UPI') {
      this.clearFields(['cash_amount', 'transcation_id']); // Clear CASH related fields
    }
    else if (event === 'BOTH') {
      this.clearFields(['cash_amount', 'upi_amount']); // Clear both CASH and UPI amounts
    }
  }

  clearFields(fields: string[]) {
    fields.forEach(field => {
      this.patientdetailsform.get(field)?.setValue('');
    });
  }

  gotprocceduredata: any = []
  der_aes_procedure_type: any
  sub_der_aes_procedure_type: any
  getsubdata: any = []
  getsubcatgorydata: any = []

  gotprocceduretypedata() {
    this.showSpinner = true;
    this.service.gotprocceduredata().subscribe((res) => {
      this.showSpinner = false;
      this.gotprocceduredata = res.data;
    })
  }

  selectproceduretype(event) {

    this.ProcedureForm.patchValue({
      der_aes_procedure_type: '',
      sub_der_aes_procedure_type: '',
      amount: ''
    })
    this.ProcedureForm.patchValue({
      procedure_type_id: event.procedure_type_id,
      procedure_type: event.procedure_type,
    })
    var data = {
      procedure_type_id: event.procedure_type_id
    }
    this.showSpinner = true;
    this.service.gotsubproceduredata(data).subscribe((res) => {
      this.showSpinner = false;
      this.getsubdata = res.data;
    })


  }

  showSubcategory: boolean = false;

  selectSubcatgoryproceduretype(event) {
    this.ProcedureForm.patchValue({
      der_aes_procedure_type: '',
      sub_der_aes_procedure_type: '',
      amount: ''
    })
    this.ProcedureForm.patchValue({
      der_aes_procedure_type_id: event.der_aes_procedure_type_id,
      der_aes_procedure_type: event.der_aes_procedure_type,
    })
    var data = {
      der_aes_procedure_type_id: event.der_aes_procedure_type_id
    }
    this.getsubcatgorydata = []
    this.showSpinner = true;
    this.service.gotsubcatgoryproceduredata(data).subscribe((res) => {
      this.showSpinner = false;
      this.getsubcatgorydata = res.data;
      this.showSubcategory = false
      if (this.getsubcatgorydata.length == 0) {
        this.showSubcategory = false
      } else {
        this.showSubcategory = true
      }
    })

  }

  selectDoublcatgoryproceduretype(event) {
    this.ProcedureForm.patchValue({
      amount: ''
    })
    this.ProcedureForm.patchValue({
      sub_der_aes_procedure_type: event
    })
  }


}
