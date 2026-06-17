import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { PharmaserviceService } from "../pharmaservice.service";
import { DatePipe } from '@angular/common';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-saleitems',
  templateUrl: './saleitems.component.html',
  styleUrls: ['./saleitems.component.scss']
})
export class SaleitemsComponent {
  breadCrumbItems: any;
  view: any;
  patientdetails: any = {};
  medicinearrs: any[] = [];
  ngSelectControl = new FormControl();
  batch_no: any;
  patients_data: any;
  showSpinner: boolean = false
  constructor(
    public formBuilder: FormBuilder,
    private myservice: PharmaserviceService,

    public route: ActivatedRoute,
    private router: Router, private datePipe: DatePipe, private modalService: NgbModal
  ) {

  }

  Patientdtsform: FormGroup;
  medicineSalesForm: FormGroup;
  currentDate: any;

  medicineEditForm: FormGroup;

  addNewEntry: FormGroup;
  patientDraftForm: FormGroup;
  SalesDraftForm: FormGroup;

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.Patientdtsform = this.formBuilder.group({
      uh_id: [""],
      patient_type: ["1"],
      name: ["", [Validators.required]],
      age: ["",],
      gender: ["",],
      phonenumber: ["",],
      payment_mode: ["", [Validators.required]],
      p_members: ['', [Validators.required]],
      transcation_id: [''],
      cash_amount: [''],
      upi_amount: [''],
      date: [this.currentDate, [Validators.required]],
      sale_without_discount_total: [''],
      sale_gst_amount: [''],
      sale_disc_percnt: [''],
      sale_grandtotal: [''],
      pymnt_mode_ind: ['0'],
      d_name: ['', [Validators.required]],
    });

    this.medicineSalesForm = this.formBuilder.group({
      hsncode: ['',],
      medicine_name: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      composition_name: ["",],
      schedule_drugs: ['',],
      medicine_id: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      expiry_date: ["", [Validators.required]],
      availability_tabs: [""],
      mrp_rate_per_tab: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      gst_percentage_each_drug: ["", [Validators.required]],
      cgst_on_medicine: ["", [Validators.required]],
      sgst_on_medicine: ["", [Validators.required]],
      gross_amount: ["", [Validators.required]]
    });

    this.get();
    this.getentrydata();
    this.getdoctorname();

    this.medicineEditForm = this.formBuilder.group({
      medicine_name: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      medicine_id: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      composition_name: ['',],
      expiry_date: ["", [Validators.required]],
      availability_tabs: [""],
      mrp_rate_per_tab: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      gst_percentage_each_drug: ["", [Validators.required]],
      cgst_on_medicine: ["", [Validators.required]],
      sgst_on_medicine: ["", [Validators.required]],
      gross_amount: ["", [Validators.required]],
      indexValue: []
    });

    this.addNewEntry = this.formBuilder.group({
      new_entry_by: ['']
    })

    this.patientDraftForm = this.formBuilder.group({
      uh_id: [""],
      patient_type: ["1"],
      name: ["", [Validators.required]],
      age: ["",],
      gender: ["",],
      phonenumber: ["",],
      payment_mode: ["", [Validators.required]],
      transcation_id: [''],
      cash_amount: [''],
      upi_amount: [''],
      date: [this.currentDate, [Validators.required]],
      sale_without_discount_total: [''],
      sale_gst_amount: [''],
      sale_disc_percnt: [''],
      sale_grandtotal: [''],
      p_members: ['', [Validators.required]],
      d_name: ['', [Validators.required]]
    });


    this.SalesDraftForm = this.formBuilder.group({
      hsncode: ['',],
      composition_name: ["",],
      medicine_name: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      schedule_drugs: ['',],
      medicine_id: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      expiry_date: ["", [Validators.required]],
      availability_tabs: [""],
      mrp_rate_per_tab: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      gst_percentage_each_drug: ["", [Validators.required]],
      cgst_on_medicine: ["", [Validators.required]],
      sgst_on_medicine: ["", [Validators.required]],
      gross_amount: ["", [Validators.required]]
    });

    var DraftMain = sessionStorage?.getItem('DraftMainbill')
    var DraftItems = sessionStorage?.getItem('DraftItems')

    if (DraftMain && DraftItems) {
      this.patientDraftForm.patchValue(JSON.parse(DraftMain))
      this.draftArray = JSON.parse(DraftItems)
    }
    else {
      this.patientDraftForm.reset();
      this.draftArray = []
    }
  }

  clcick() {
    this.router.navigate(['/pharmacy/salesitemsreports'])
  }

  typesubmit: boolean;

  get type() {
    return this.Patientdtsform.controls;
  }

  typesubmit2: boolean;

  get type2() {
    return this.medicineSalesForm.controls;
  }

  data: any = [];
  allMedicinesData: any = [];
  assign_tabs: any = [];

  get() {
    this.myservice.getpatientsOnlyphcy().subscribe((res: any) => {
      this.patients_data = res.data;
    });

    this.myservice.getmedicinename().subscribe((res) => {
      this.allMedicinesData = res.data;
    });

    this.myservice.getdata_assign_tablets().subscribe((res) => {
      this.assign_tabs = res.data;
    });

  }

  medicinevalue: any;
  gstpercentage: any;
  medicinearr: any = [];

  grandtotal: any = 0;

  totalGSTAMNT: any = 0;

  avalibility: any;

  // Accept Input As a Number Only

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  newORoldOne: boolean = true;

  timeslot(event: any) {
    var as = event.target.value
    this.Patientdtsform.patchValue({
      uh_id: '',
      name: '',
      age: '',
      gender: '',
      phonenumber: ''
    });
    if (as == '1') {
      this.newORoldOne = true
    }
    else if (as == '3') {
      this.newORoldOne = false
    }
  }

  changepn(uh_id) {
    var result = this.patients_data.find((o) => o.uh_id === uh_id);
    this.Patientdtsform.patchValue({
      name: result.name,
      age: result.age,
      gender: result.gender,
      phonenumber: result.phone_number
    });
  }

  medicineBatchData: any;
  selectedMedicne(e) {
    this.medicineSalesForm.patchValue({
      hsncode: e.hsncode,
      composition_name: e.composition_name,
      batch_no: "",
      expiry_date: "",
      availability_tabs: "",
      mrp_rate_per_tab: "",
      quantity: "",
      total_amount: "",
      gst_percentage_each_drug: "",
      cgst_on_medicine: "",
      sgst_on_medicine: "",
      gross_amount: "",
      schedule_drugs: e.schedule_drugs,
      company_name: e.company_name,
    });
    if (e.medicine_name == undefined || e.medicine_name == null) {
      Swal.fire({
        icon: 'error',
        title: 'Please Enter Medicine Name',
        text: 'Required',
        timer: 1500
      });
    }
    else {
      this.medicineSalesForm.patchValue({
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      });
      var data = {
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      }
      this.showSpinner = true
      this.myservice.getAmedicineAllBatchNos(data).subscribe((res) => {
        this.showSpinner = false
        this.medicineBatchData = res.data
      })
    }

  }


  gotDataByBatch: any;
  selectedBatchnoMedicine(b) {
    this.medicineSalesForm.patchValue({
      expiry_date: "",
      availability_tabs: "",
      mrp_rate_per_tab: "",
      quantity: "",
      total_amount: "",
      gst_percentage_each_drug: "",
      cgst_on_medicine: "",
      sgst_on_medicine: "",
      gross_amount: ""
    });

    if (b == undefined || b == null) {
      Swal.fire({
        icon: 'error',
        title: 'Please Enter Batch no',
        text: 'Required',
        timer: 1500
      });
    }
    else {
      var data = {
        batch_number: b.medicine_batchno,
        medicine_name: b.medicine_name,
        medicine_id: b.medicine_id
      }      
      this.showSpinner = true
      this.myservice.getThatMedicineDataByBatchwise(data).subscribe((res) => {
        this.showSpinner = false
        this.gotDataByBatch = res.data[0]
        var current_date = new Date();
        current_date.setHours(23, 59, 59, 999);
        var expiryDateStr = res.data[0].expirydate;
        var parts = expiryDateStr.split("-");
        var expiryYear = parseInt(parts[0]);
        var expiryMonth = parseInt(parts[1]) - 1; // Zero-based month
        var expiryDay = parseInt(parts[2]);
        var expiryDateOfPatient = new Date(expiryYear, expiryMonth, expiryDay);
        expiryDateOfPatient.setHours(23, 59, 59, 999);
        if (current_date >= expiryDateOfPatient) {
          Swal.fire({
            icon: 'error',
            title: 'This Batch Medicines Expired',
            text: 'Required',
            timer: 1500
          });
        }
        else if (this.gotDataByBatch.available_quantity == 0) {
          Swal.fire({
            icon: 'error',
            title: 'NO Quantity Left in this Batch',
            text: 'Required',
            timer: 1500
          });
        }
        else {
          this.medicineSalesForm.patchValue({
            batch_no: this.gotDataByBatch.batch_no,
            expiry_date: this.gotDataByBatch.expirydate,
            availability_tabs: this.gotDataByBatch.available_quantity,
            mrp_rate_per_tab: this.gotDataByBatch.eachcost,
            gst_percentage_each_drug: this.gotDataByBatch.gst_per,
          })
        }
      })
    }

  }


  AddButtonArray: boolean = false

  calculateRintoQnty(event) {
    var each_tab_mrp_rate = this.medicineSalesForm.value.mrp_rate_per_tab;
    var gstPercntg = this.medicineSalesForm.value.gst_percentage_each_drug;
    var userINputQnty = event.target.value;

    if (!isNaN(userINputQnty) && !isNaN(each_tab_mrp_rate) && each_tab_mrp_rate !== 0 && each_tab_mrp_rate !== '') {
      var availabilityQuantity = parseInt(this.medicineSalesForm.value.availability_tabs);
      if (userINputQnty > availabilityQuantity) {
        Swal.fire({
          position: "top-end",
          icon: "question",
          title: `Quantity cannot exceed the available quantity of tabs:  ${availabilityQuantity}`,
          showConfirmButton: false,
          timer: 1500,
        });
        var total = 0;
        this.medicineSalesForm.patchValue({
          total_amount: total,
        });
        this.splitFuncForGSTS(total, gstPercntg);
        this.AddButtonArray = false;
        return;
      }

      var total = each_tab_mrp_rate * 1 * (userINputQnty * 1);

      this.medicineSalesForm.patchValue({
        total_amount: parseFloat(total.toFixed(2)),
      });

      this.splitFuncForGSTS(total, gstPercntg);
      this.AddButtonArray = true;
    }
  }


  splitFuncForGSTS(total, gstPercntg) {

    var calcualte = total * gstPercntg

    var fixedPercnt = 100
    var gstPLusFixed = fixedPercnt + gstPercntg

    var finalSplit = calcualte / gstPLusFixed

    var ForTwogsts = finalSplit / 2

    var forGrossAmount = total - parseFloat(finalSplit.toFixed(2))

    var num = ForTwogsts;
    var formattedNum = parseFloat(num.toFixed(2))
    // Output: "10.57"


    this.medicineSalesForm.patchValue({
      cgst_on_medicine: formattedNum,
      sgst_on_medicine: formattedNum,
      gross_amount: parseFloat(forGrossAmount.toFixed(2))
    });

  }


  evetn() {
    this.typesubmit2 = true;
    if (this.medicineSalesForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter all details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    // Check if the item with the same medicine_id and batch_no already exists
    const testExists = this.medicinearr.some((element) =>
      element.medicine_id === this.medicineSalesForm.value.medicine_id &&
      element.batch_no === this.medicineSalesForm.value.batch_no
    );
    if (testExists) {
      Swal.fire({
        title: "Input Error",
        html: `
              <div style="text-align: left;">
                  <p><strong>Same Medicine Item with Same Batch No</strong> cannot be added <strong>Twice !</strong></p>
              </div>`,
        icon: "question"
      });
    }
    else {
      this.medicinearr.push({
        hsncode: this.medicineSalesForm.value.hsncode,
        composition_name: this.medicineSalesForm.value.composition_name,
        medicine_name: this.medicineSalesForm.value.medicine_name,
        schedule_drugs: this.medicineSalesForm.value.schedule_drugs,
        company_name: this.medicineSalesForm.value.company_name,
        medicine_id: this.medicineSalesForm.value.medicine_id,
        batch_no: this.medicineSalesForm.value.batch_no,
        expiry_date: this.medicineSalesForm.value.expiry_date,
        availability_tabs: this.medicineSalesForm.value.availability_tabs,
        mrp_rate_per_tab: this.medicineSalesForm.value.mrp_rate_per_tab,
        quantity: this.medicineSalesForm.value.quantity,
        total_amount: this.medicineSalesForm.value.total_amount,
        gst_percentage_each_drug: this.medicineSalesForm.value.gst_percentage_each_drug,
        cgst_on_medicine: this.medicineSalesForm.value.cgst_on_medicine,
        sgst_on_medicine: this.medicineSalesForm.value.sgst_on_medicine,
        gross_amount: this.medicineSalesForm.value.gross_amount
      });
      this.addDiscountToOverall(0, "add");
      this.callthisFunctforSumming();
      this.medicineSalesForm.reset();
      this.typesubmit2 = false;
    }
  }



  callthisFunctforSumming() {

    let sum = 0;
    this.medicinearr.forEach((element) => {
      var num = element.total_amount;
      sum += parseFloat(num.toFixed(2));
    });
    this.grandtotal = sum;
    this.grandtotal


    let sum1 = 0;
    this.medicinearr.forEach((element) => {
      var bothGst = element.cgst_on_medicine + element.sgst_on_medicine
      sum1 += parseFloat(bothGst.toFixed(2));
    });
    this.totalGSTAMNT = parseFloat(sum1.toFixed(2));

  }

  delete(i) {
    this.medicinearr.splice(i, 1);
    this.callthisFunctforSumming()
    this.addDiscountToOverall(0, "dlt");
  }

  initialDiscount: any = 0;
  discountAmount: any = 0;
  totalAmountAftrDscnt: any = 0;

  addDiscountToOverall(event, passArg) {
    this.callthisFunctforSumming()

    this.initialDiscount = 0
    this.discountAmount = 0
    this.totalAmountAftrDscnt = 0;
    this.ngSelectControl.setValue(0);

    if (event == 0 && passArg == "dlt" || event == 0 && passArg == "add") {
      this.initialDiscount = 0
      this.discountAmount = 0
      this.ngSelectControl.setValue(0);
      this.totalAmountAftrDscnt = Math.round(this.grandtotal)
    }

    else if (event == 0 && passArg == 0) {
      this.initialDiscount = 0
      this.discountAmount = 0
      this.ngSelectControl.setValue(0);
      this.totalAmountAftrDscnt = Math.round(this.grandtotal)
    }

    else {
      this.ngSelectControl.setValue(event);
      this.initialDiscount = event;
      var bothPlusGstSUMandGrandTotal = this.grandtotal
      this.discountAmount = bothPlusGstSUMandGrandTotal * event / 100;
      this.totalAmountAftrDscnt = bothPlusGstSUMandGrandTotal - (bothPlusGstSUMandGrandTotal * event / 100)
      this.totalAmountAftrDscnt = Math.round(this.totalAmountAftrDscnt)
    }

    this.Patientdtsform.patchValue({
      sale_without_discount_total: this.grandtotal,
      sale_gst_amount: this.totalGSTAMNT,
      sale_disc_percnt: this.initialDiscount,
      sale_grandtotal: Math.round(this.totalAmountAftrDscnt)
    })

  }

  typeSubmit() {
    this.typesubmit = true;
    if (this.Patientdtsform.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Details",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    } else if (this.medicinearr.length == 0) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter Medicines",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else if (this.Patientdtsform.value.sale_grandtotal == 0) {
      Swal.fire({
        title: "Grand Total is ZERO",
        text: "Give Discount %",
        icon: "question"
      });
    }
    else {
      const upiAmount = parseFloat(this.Patientdtsform.value.upi_amount);
      const cashAmount = parseFloat(this.Patientdtsform.value.cash_amount);
      const GrandTotal = parseFloat(this.Patientdtsform.value.sale_grandtotal);
      const transactionId = this.Patientdtsform.value.transcation_id;
      if (this.Patientdtsform.value.payment_mode == 'BOTH') {
        if (!upiAmount || !cashAmount || !transactionId) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Both Cash/Upi Amounts and Transcation Id",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else if (upiAmount + cashAmount < (GrandTotal - 5) || upiAmount + cashAmount > (GrandTotal + 5)) {
          Swal.fire({
            title: "Input Error",
            html: `
                  <div style="text-align: left;">
                      <p>The amount must be within <strong>5 Rps</strong> of the grand total.</p>
                      <p>Please pay at least <strong>${GrandTotal - 5} Rps</strong> or up to <strong>${GrandTotal + 5} Rps</strong> for the Grandtotal <strong>${GrandTotal} Rps</strong>.</p>
                  </div>`,
            icon: "warning"
          });
        }
        else {
          this.submitTheSale()
        }
      }
      else if (this.Patientdtsform.value.payment_mode == 'UPI' || this.Patientdtsform.value.payment_mode == 'E - CARD') {
        if (!transactionId) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Transcation Id",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else {
          this.Patientdtsform.value.cash_amount = ''
          this.Patientdtsform.value.upi_amount = ''
          this.submitTheSale()
        }
      }
      else if (this.Patientdtsform.value.payment_mode == 'CASH' || this.Patientdtsform.value.payment_mode == 'CREDIT') {
        this.Patientdtsform.value.transcation_id = ""
        this.Patientdtsform.value.cash_amount = ""
        this.Patientdtsform.value.upi_amount = ""
        this.submitTheSale()
      }

    }
  }

  submitTheSale() {
    if (this.Patientdtsform.value.payment_mode == 'CREDIT') {
      this.Patientdtsform.get('pymnt_mode_ind').setValue('1');
    }
    else {
      this.Patientdtsform.get('pymnt_mode_ind').setValue('0');
    }
    var data = {
      patientdetail: this.Patientdtsform.value,
      medicinearr: this.medicinearr,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
    };
    this.showSpinner = true
    this.myservice.submitpatientmedicine(data).subscribe((res: any) => {
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
        this.Patientdtsform.reset();
        this.Patientdtsform.get('pymnt_mode_ind').setValue('0');
        this.medicinearr = [];
        this.typesubmit2 = false;
        this.grandtotal = 0;
        this.totalGSTAMNT = 0;
        this.paymentload = false;
        this.showTwoAmounts = false;
        this.initialDiscount = 0;
        this.discountAmount = 0;
        this.totalAmountAftrDscnt = 0;
        sessionStorage.removeItem('salesReport')
        sessionStorage.setItem('salesReport', JSON.stringify(res.data[0]))
        this.router.navigate(['salesreportsPrint']);
      } else {
        Swal.fire("Failed");
      }
    });
  }

  ///////////////////////// update row

  updateArow(row, index, editFormTempo) {
    this.medicineEditForm.patchValue({
      medicine_name: row.medicine_name,
      company_name: row.company_name,
      medicine_id: row.medicine_id,
      batch_no: row.batch_no,
      expiry_date: row.expiry_date,
      availability_tabs: row.availability_tabs,
      mrp_rate_per_tab: row.mrp_rate_per_tab,
      quantity: row.quantity,
      total_amount: row.total_amount,
      gst_percentage_each_drug: row.gst_percentage_each_drug,
      cgst_on_medicine: row.cgst_on_medicine,
      sgst_on_medicine: row.sgst_on_medicine,
      gross_amount: row.gross_amount,
      indexValue: index
    })
    this.modalService.open(editFormTempo, { size: 'xl', centered: true })
  }


  stopEntering: boolean = false

  updatetherowandinsert() {

    if (this.stopEntering) {
      Swal.fire('Please update in Available Quantity Only')
      this.medicineEditForm.reset();
      this.modalService.dismissAll();
      this.stopEntering = false
    }
    else {
      this.medicinearr.splice(this.medicineEditForm.value.indexValue, 1);
      this.medicinearr.push({
        medicine_name: this.medicineEditForm.value.medicine_name,
        company_name: this.medicineEditForm.value.company_name,
        medicine_id: this.medicineEditForm.value.medicine_id,
        batch_no: this.medicineEditForm.value.batch_no,
        expiry_date: this.medicineEditForm.value.expiry_date,
        availability_tabs: this.medicineEditForm.value.availability_tabs,
        mrp_rate_per_tab: this.medicineEditForm.value.mrp_rate_per_tab,
        quantity: this.medicineEditForm.value.quantity,
        total_amount: this.medicineEditForm.value.total_amount,
        gst_percentage_each_drug: this.medicineEditForm.value.gst_percentage_each_drug,
        cgst_on_medicine: this.medicineEditForm.value.cgst_on_medicine,
        sgst_on_medicine: this.medicineEditForm.value.sgst_on_medicine,
        gross_amount: this.medicineEditForm.value.gross_amount
      });
      this.addDiscountToOverall(0, "add");
      this.callthisFunctforSumming();
      this.medicineEditForm.reset();
      this.modalService.dismissAll();
    }

  }


  calculateRintoQntyForUpdate(event) {
    this.stopEntering = false
    var each_tab_mrp_rate = this.medicineEditForm.value.mrp_rate_per_tab;
    var gstPercntg = this.medicineEditForm.value.gst_percentage_each_drug;
    var userINputQnty = event.target.value;

    if (!isNaN(userINputQnty) && !isNaN(each_tab_mrp_rate) && each_tab_mrp_rate !== 0 && each_tab_mrp_rate !== '') {
      var availabilityQuantity = parseInt(this.medicineEditForm.value.availability_tabs);
      if (userINputQnty > availabilityQuantity) {
        Swal.fire({
          position: "top-end",
          icon: "question",
          title: `Quantity cannot exceed the available quantity of tabs:  ${availabilityQuantity}`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.stopEntering = true
        var total = 0;
        this.medicineEditForm.patchValue({
          total_amount: total,
        });
        this.splitFuncForGSTSUpdate(total, gstPercntg);
        return;
      }

      var total = each_tab_mrp_rate * 1 * (userINputQnty * 1);

      this.medicineEditForm.patchValue({
        total_amount: parseFloat(total.toFixed(2)),
      });

      this.splitFuncForGSTSUpdate(total, gstPercntg);
    }

  }


  splitFuncForGSTSUpdate(total, gstPercntg) {

    var calcualte = total * gstPercntg

    var fixedPercnt = 100
    var gstPLusFixed = fixedPercnt + gstPercntg

    var finalSplit = calcualte / gstPLusFixed

    var ForTwogsts = finalSplit / 2

    var forGrossAmount = total - parseFloat(finalSplit.toFixed(2))

    var num = ForTwogsts;
    var formattedNum = parseFloat(num.toFixed(2))
    // Output: "10.57"


    this.medicineEditForm.patchValue({
      cgst_on_medicine: formattedNum,
      sgst_on_medicine: formattedNum,
      gross_amount: parseFloat(forGrossAmount.toFixed(2))
    });

  }

  /////////////////////rajkumar/////////////////////////////////////////////////////////////








  paymentload: boolean = false;

  showTwoAmounts: boolean = false;

  paymentslot(event: any) {
    var as = event
    if (as == 'UPI' || as == 'E - CARD') {
      this.paymentload = true
      this.showTwoAmounts = false
    } else if (as == 'CASH' || as == 'CREDIT') {
      this.paymentload = false
      this.showTwoAmounts = false
    }
    else if (as == 'BOTH') {
      this.showTwoAmounts = true
      this.paymentload = true
    }

  }


  ////////////////////////////////////////////////////////////// Draft Functions 


  draftArray: any = [];

  saveAsDraft() {

    if (this.draftArray.length !== 0) {
      Swal.fire({
        title: "Unable to Save",
        text: "A Draft is Already Saved",
        icon: "error"
      });
    }
    else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do You Want to Save it As Draft",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Draft Saved",
            text: "Data Saved",
            icon: "success"
          });
          this.patientDraftForm.patchValue(this.Patientdtsform.value);
          this.draftArray = [...this.medicinearr]

          sessionStorage.setItem('DraftMainbill', JSON.stringify(this.patientDraftForm.value))
          sessionStorage.setItem('DraftItems', JSON.stringify(this.draftArray))

          this.Patientdtsform.reset()
          this.Patientdtsform.get('patient_type')?.setValue('1'); // Set value
          this.Patientdtsform.get('date')?.setValue(this.currentDate); // Set value
          this.newORoldOne = true;
          this.medicinearr = []
        }
      });
    }


  }



  viewdraft(draftview) {
    if (this.draftArray.length !== 0) {
      this.modalService.open(draftview, { size: 'xl', centered: false })
    } else {
      Swal.fire({
        title: "Draft is Empty",
        text: "No Data Found",
        icon: "question"
      });
    }
  }


  GetDraftBill() {
    if (this.medicinearr.length == 0) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do You Want to Get it as Bill",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Draft has been Empty",
            text: "Data Cleared",
            icon: "success"
          });

          if (this.patientDraftForm.value.patient_type == '3') {
            this.newORoldOne = false;
          }
          else {
            this.newORoldOne = true;
          }

          this.Patientdtsform.patchValue(this.patientDraftForm.value);
          this.medicinearr = [...this.draftArray]

          this.grandtotal = this.patientDraftForm.value.sale_without_discount_total

          this.totalGSTAMNT = this.patientDraftForm.value.sale_gst_amount

          this.initialDiscount = this.patientDraftForm.value.sale_disc_percnt

          this.totalAmountAftrDscnt = this.patientDraftForm.value.sale_grandtotal

          this.discountAmount = this.grandtotal * this.initialDiscount / 100;

          sessionStorage.removeItem('DraftMainbill')
          sessionStorage.removeItem('DraftItems')

          this.modalService.dismissAll();
          this.patientDraftForm.reset()
          this.draftArray = []
        }
      });
    } else {
      Swal.fire({
        title: "Submit Ongoing Bill",
        text: "Bill not empty",
        icon: "question"
      });
    }
  }

  Entry_By: any[];

  getentrydata() {
    this.myservice.getentrydata().subscribe((res: any) => {
      this.Entry_By = res.data;
    });
  }

  changeType(e: any, opennewfee) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewentry(opennewfee)
    }
  }

  addnewentry(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  dis() {
    this.modalService.dismissAll()
  }


  removeLeadingSpace(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.trimStart();
    this.addNewEntry.get('new_entry_by').setValue(inputElement.value, { emitEvent: false });
  }

  sub: boolean = false;
  get validaate() {
    return this.addNewEntry.controls
  }

  subs: boolean = false;
  submitNewEntry(): void {
    this.subs = true;
    const inputValue = this.addNewEntry.value.new_entry_by.trim();
    if (inputValue === '') {
      this.addNewEntry.get('new_entry_by').setErrors({ required: true });
    }
    if (this.addNewEntry.invalid) {
      alert('Please add details');
      return;
    }
    const data = {
      name: inputValue
    };
    this.showSpinner = true;
    this.myservice.addNewEntry(data).subscribe((res) => {
      this.showSpinner = false;
      if (res.status === 200) {
        Swal.fire({
          title: 'Done!',
          text: 'Entry By Added',
          icon: 'success'
        });
        this.modalService.dismissAll();
        this.addNewEntry.reset();
        this.getentrydata();
      }
      else if (res.status == 300) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Entry By already exist!',
          timer: 1500
        })
        this.getentrydata();
      }
    },
      (error) => {
        this.showSpinner = false;
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Entry By',
          icon: 'error'
        });
      }
    );
  }


  deletedata(data) {
    Swal.fire({
      title: 'Are you sure to Delete User?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deletentrydata(data);
      }
    })
  }

  deletentrydata(a) {
    this.showSpinner = true;
    this.myservice.deletentrydata(a).subscribe(res => {
      this.showSpinner = false;
      if (res.status == 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Deleted Successfully ",
          showConfirmButton: false,
          timer: 1500,
        });
        this.getentrydata()
      }
      else {
        alert("Failed")
      }
    });
  }

  gotdoctorname: any = [];
  getdoctorname() {
    this.myservice.getdoctorname().subscribe((res) => {
      this.gotdoctorname = res.data;
    })
  }

}
