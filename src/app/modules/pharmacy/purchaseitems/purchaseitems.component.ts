import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PharmaserviceService } from '../pharmaservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchaseitems',
  templateUrl: './purchaseitems.component.html',
  styleUrls: ['./purchaseitems.component.scss']
})


export class PurchaseitemsComponent implements OnInit {


  // form: FormGroup;
  addMedicineForm: FormGroup;

  addNew: FormGroup;

  showSpinner: boolean = false;

  supplierdtsform: FormGroup;
  ngSelectControl = new FormControl();
  nowCurrentDate: any;
  updatepaymentstatusForm: any;
  cdRef: any;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private service: PharmaserviceService, public modalService: NgbModal) {

  }


  LastBillNoCount: any = 0;
  currentDate: any

  medicineEditForm: FormGroup;
  addNewEntry: FormGroup;

  user_id: any
  usr_nm: any

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.getsupplierdata();
    this.getmedicinename();
    this.getentrydata();

    this.service.purchasenextItemCount().subscribe((res: any) => {
      this.LastBillNoCount = res.data[0].purchase_bill_no
      this.startCounting()
    })

    const datePipe = new DatePipe('en-Us');
    this.currentDate = datePipe.transform(new Date(), 'yyyy-MM-dd');


    this.supplierdtsform = this.formBuilder.group({
      supplier_id: ["", [Validators.required]],
      supplier_name: ["", [Validators.required]],
      supplier_number: ["", [Validators.required]],
      supp_landline_no: [''],
      supp_dl_no1: ['', [Validators.required]],
      supp_dl_no2: ['', [Validators.required]],
      supplier_gst: ["", [Validators.required]],
      invoice_number: ["", [Validators.required]],
      invoice_date: [this.currentDate, [Validators.required]],
      payment_mode: ["", [Validators.required]],
      payment_ind: ["", [Validators.required]],
      transcation_id: ["",],
      check_number: ["",],
      total_sum_without_discount: [""],
      total_sum_discount: [""],
      discount_percent: [""],
      cgst_amount: [""],
      sgst_amount: [""],
      grandtotal_after_all: [""],
      p_members: ['', [Validators.required]]
    });

    this.addMedicineForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      category_name: ['', [Validators.required]],
      schedule_drugs: ['', [Validators.required]],
      medicine_name: ["", [Validators.required]],
      medicine_id: ['', [Validators.required]],
      batch_no: ["", [Validators.required]],
      company_name: ["", [Validators.required]],
      composition_name: ['',],
      hsncode: ["", [Validators.required]],
      mrp_rate: ["", [Validators.required]],
      value: ["", [Validators.required]],
      gst_per: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      with_gst_price: ["", [Validators.required]],
      expirydate: ["", [Validators.required]],
      pack: [""],
      eachcost: [""],
      total_tabs: [""],
      free_tabs: [""],
      saveInitialMedicinePrice: [""],
      without_gst_medicine_price: [""],
      purchase_eachcost: ['']
    });

    this.addNew = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    });

    this.medicineEditForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      category_name: ['', [Validators.required]],
      schedule_drugs: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      medicine_name: ["", [Validators.required]],
      composition_name: [''],
      medicine_id: ['', [Validators.required]],
      batch_no: ["", [Validators.required]],
      hsncode: ["", [Validators.required]],
      mrp_rate: ["", [Validators.required]],
      value: ["", [Validators.required]],
      gst_per: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      with_gst_price: ["", [Validators.required]],
      expirydate: ["", [Validators.required]],
      pack: [""],
      eachcost: [""],
      total_tabs: [""],
      free_tabs: [""],
      saveInitialMedicinePrice: [""],
      without_gst_medicine_price: [""],
      indexValue: []
    });

    this.nowCurrentDate = new Date().toISOString().split('T')[0];
    this.nowCurrentDate = new Date().toISOString().split('T')[0].slice(0, 7);


    this.addNewEntry = this.formBuilder.group({
      new_entry_by: ['']
    })

  }

  clcick() {
    this.router.navigate(['/pharmacy/purchasereport'])
  }

  submitted: boolean = false;
  get valid() {
    return this.supplierdtsform.controls;
  }

  submittTwo: boolean = false;
  get validTwo() {
    return this.addMedicineForm.controls;
  }

  suppyrdata: any;
  getsupplierdata() {
    this.service.getsupplierdata().subscribe((res) => {
      this.suppyrdata = res.data;
    });
  }

  changepns(data) {
    this.suppyrdata.map((res) => {
      if (res.id == data.id) {
        this.supplierdtsform.patchValue({
          supplier_id: res.id,
          supplier_name: res.supplier_name,
          supplier_number: res.supplier_number,
          supplier_gst: res.supplier_gst,
          supp_landline_no: res.supp_landline_no,
          supp_dl_no1: res.dl_no1,
          supp_dl_no2: res.dl_no2,
        });
      }
    })
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  numericAndApha(event): boolean {
    const pattern = /^[a-zA-Z0-9]$/;
    const result = pattern.test(event.key);
    return result;
  }

  data: any;
  medicine: any;

  getmedicinename() {
    this.showSpinner = true
    this.service.getMedicinesWithPurchaseDetails().subscribe((res) => {
      this.showSpinner = false
      this.data = res.data;
    });
  }

  changeMedicineName(e) {
    this.addMedicineForm.patchValue({
      medicine_name: e.medicine_name,
      medicine_id: e.medicine_id,
      hsncode: e.hsncode,
      category_id: e.category_id,
      category_name: e.category_name,
      company_name: e.company_name,
      composition_name: e.composition_name,
      schedule_drugs: e.schedule_drugs,
      pack: e.pack,
      eachcost: e.eachcost,
      mrp_rate: e.mrp_rate
    });
  }

  packChange(event) {
    this.addMedicineForm.patchValue({
      eachcost: '',
      mrp_rate: '',
      value: '',
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittTwo = true
  }

  changeIfRate(event) {
    this.addMedicineForm.patchValue({
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittTwo = true
  }

  eachquantity(event) {
    this.medicineEditForm.patchValue({
      value: '',
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittTwo = true
    var mrp_rate = event.target.value;
    var quantity = this.addMedicineForm.value.pack;
    if (!isNaN(mrp_rate) && !isNaN(quantity) && quantity !== 0) {
      var eachCost = mrp_rate / quantity;
      this.addMedicineForm.patchValue({
        eachcost: eachCost
      });
    }
  }

  totalmedicine(event) {
    var medicine_price_sheet = this.addMedicineForm.value.value
    var userINputQnty = event.target.value
    if (!isNaN(userINputQnty) && !isNaN(medicine_price_sheet) && medicine_price_sheet !== 0) { }
    var total = medicine_price_sheet * 1 * (userINputQnty * 1);
    this.addMedicineForm.patchValue({
      without_gst_medicine_price: parseFloat(total.toFixed(2)),
      saveInitialMedicinePrice: parseFloat(total.toFixed(2))
    });
  }

  gstCalculation(event) {
    var getWithoutgst = this.addMedicineForm.value.saveInitialMedicinePrice
    const gstAmount = (getWithoutgst * event) / 100;
    const totalPrice = getWithoutgst + gstAmount;
    this.addMedicineForm.patchValue({
      with_gst_price: parseFloat(totalPrice.toFixed(2)),
    });
  }

  grandtotal: any = 0;
  medicinearr: any = [];
  evetn() {
    this.submittTwo = true;
    if (this.addMedicineForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Medicine Details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      var gettingFrretabs = this.addMedicineForm.value.free_tabs * this.addMedicineForm.value.pack
      var geetingTotaltabs = this.addMedicineForm.value.pack * this.addMedicineForm.value.quantity
      var fullTabs = gettingFrretabs + geetingTotaltabs
      this.addMedicineForm.patchValue({
        total_tabs: fullTabs
      })
      var purchase_eachcost = this.addMedicineForm.value.value / this.addMedicineForm.value.pack

      var tol_wih_gst = (purchase_eachcost * this.addMedicineForm.value.gst_per) / 100;

      var atlasaatValue = purchase_eachcost + tol_wih_gst

      this.medicinearr.push({
        batch_no: this.addMedicineForm.value.batch_no,
        category_id: this.addMedicineForm.value.category_id,
        category_name: this.addMedicineForm.value.category_name,
        medicine_name: this.addMedicineForm.value.medicine_name,
        company_name: this.addMedicineForm.value.company_name,
        composition_name: this.addMedicineForm.value.composition_name,
        schedule_drugs: this.addMedicineForm.value.schedule_drugs,
        value: this.addMedicineForm.value.value,
        quantity: this.addMedicineForm.value.quantity,
        with_gst_price: this.addMedicineForm.value.with_gst_price,
        gst_per: this.addMedicineForm.value.gst_per,
        expirydate: this.addMedicineForm.value.expirydate,
        hsncode: this.addMedicineForm.value.hsncode,
        medicine_id: this.addMedicineForm.value.medicine_id,
        pack: this.addMedicineForm.value.pack,
        eachcost: this.addMedicineForm.value.eachcost,
        mrp_rate: this.addMedicineForm.value.mrp_rate,
        total_tabs: this.addMedicineForm.value.total_tabs,
        free_tabs: this.addMedicineForm.value.free_tabs,
        saveInitialMedicinePrice: this.addMedicineForm.value.saveInitialMedicinePrice,
        without_gst_medicine_price: this.addMedicineForm.value.without_gst_medicine_price,
        purchase_eachcost: atlasaatValue
      });
      this.callthisFunctforSumming();
      this.addDiscountToeveryProducT(0, "add");
      this.addMedicineForm.reset();
      this.submittTwo = false;
    }
  }

  callthisFunctforSumming() {
    let sum = 0;
    this.medicinearr.forEach((element) => {
      sum += element.without_gst_medicine_price;
    });
    this.grandtotal = parseFloat(sum.toFixed(2));
  }

  delete(i) {
    this.medicinearr.splice(i, 1);
    this.callthisFunctforSumming()
    this.addDiscountToeveryProducT(0, "dlt");
  }

  initialDiscount: any = 0;
  discountAmount: any;
  totalAmountAftrDscnt: any;

  addDiscountToeveryProducT(event, passArg) {
    this.callthisFunctforSumming()
    this.initialDiscount = 0
    this.discountAmount = 0
    this.totalAmountAftrDscnt = 0;
    this.ngSelectControl.setValue(0);
    if (event == 0 && passArg == "dlt" || event == 0 && passArg == "add") {
      this.totalAmountAftrDscnt = this.grandtotal;
    }
    else if (event == 0 && passArg == 0) {
      this.totalAmountAftrDscnt = this.grandtotal;
    }
    else {
      this.ngSelectControl.setValue(event);
      this.initialDiscount = event;
      this.discountAmount = this.grandtotal * event / 100;
      this.totalAmountAftrDscnt = this.grandtotal - (this.grandtotal * event / 100)
      this.totalAmountAftrDscnt = parseFloat(this.totalAmountAftrDscnt.toFixed(2));
    }
    this.groupingFunctionForGST()
  }

  groupedItemsWithTax: any;
  totalTaxAmount: any = 0;
  TotalCGST: any = 0;
  TotalSGST: any = 0;
  MegaGrandTotal: any = 0;

  groupingFunctionForGST() {
    const groupedItems = this.medicinearr.reduce((acc, obj) => {
      const key = obj.gst_per; // Get 'gst_per' value as the key
      if (!acc[key]) {
        acc[key] = []; // Initialize an array if key doesn't exist
      }
      acc[key].push(obj); // Push object to the corresponding key array
      return acc;
    }, {});
    this.groupedItemsWithTax = []
    this.totalTaxAmount = 0;
    this.TotalCGST = 0;
    this.TotalSGST = 0;
    this.MegaGrandTotal = 0;
    this.groupedItemsWithTax = Object.keys(groupedItems).map(key => {
      const group = groupedItems[key];
      var sum2 = group.reduce((total, item) => total + item.without_gst_medicine_price, 0);
      const a = sum2 * (this.initialDiscount / 100);
      const sum = sum2 - a;
      const taxAmount = sum * (parseFloat(key) / 100);
      return { gst_per: parseFloat(key), tax_amount: taxAmount };
    });

    this.totalTaxAmount = this.groupedItemsWithTax.reduce((total, group) => total + group.tax_amount, 0);
    var divideByTwo = this.totalTaxAmount / 2
    this.TotalCGST = parseFloat(divideByTwo.toFixed(2));
    this.TotalSGST = parseFloat(divideByTwo.toFixed(2));
    var completeSummingAmountGrand = this.totalAmountAftrDscnt + this.TotalCGST + this.TotalSGST
    this.MegaGrandTotal = Math.round(completeSummingAmountGrand)

  }

  typeSubmitPurchase() {
    this.submitted = true;
    if (this.supplierdtsform.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter all details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (this.medicinearr.length == 0) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter the Medicines",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      this.supplierdtsform.patchValue({
        total_sum_without_discount: this.grandtotal,
        total_sum_discount: this.totalAmountAftrDscnt,
        discount_percent: this.initialDiscount,
        cgst_amount: this.TotalCGST,
        sgst_amount: this.TotalSGST,
        grandtotal_after_all: this.MegaGrandTotal
      })
      if (this.supplierdtsform.value.grandtotal_after_all == 0) {
        Swal.fire({
          title: "Grand Total is ZERO",
          text: "Give Discount %",
          icon: "question"
        });
      }
      else {
        var data = {
          supplierdeatils: this.supplierdtsform.value,
          medicinearr: this.medicinearr,
          user_id: localStorage.getItem('user_id'),
          usr_nm: localStorage.getItem('usr_nm'),
        };
        var InvValue = this.supplierdtsform.get('invoice_number').value;
        InvValue = InvValue.trimStart().trimEnd();
        var data1 = {
          Invoice_no: InvValue
        };
        this.showSpinner = true
        this.service.checkInvoiceNumber(data1).subscribe((res: any) => {
          this.showSpinner = false
          if (res.status == 200 && res.data.length == 0) {
            this.showSpinner = true
            this.service.submitpurchasedata(data).subscribe((res: any) => {
              this.showSpinner = false
              if (res.status == 200) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Successfully Submitted",
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.medicinearr = [];
                this.grandtotal = 0;
                this.initialDiscount = 0;
                this.discountAmount = 0;
                this.totalAmountAftrDscnt = 0;
                this.groupedItemsWithTax = [];
                this.totalTaxAmount = 0;
                this.TotalCGST = 0;
                this.TotalSGST = 0;
                this.MegaGrandTotal = 0;
                this.submitted = false;
                this.ngOnInit();
              } else {
                Swal.fire("Failed");
              }
            });
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Invoice Number Exists",
              text: "Please change the invoice number",
              confirmButtonText: "OK"
            });
          }
        });
      }
    }
  }

  submitNew() {
    if (this.addNew.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter Type",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.service.addNewmedicineType(this.addNew.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Submitted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.addNew.reset();
          this.modalService.dismissAll()
          this.getmedicinename()

        } else {
          Swal.fire("Failed");
        }
      })
    }
  }

  // changeType(e: any, openPopforNew) {
  //   if (e == 'ADD') {
  //     this.addnewtype(openPopforNew)
  //   }
  // }

  // addnewtype(openPopforNew) {
  // this.modalService.open(openPopforNew, { centered: true, size: "l" });
  // }

  dis() {
    this.modalService.dismissAll()
  }

  // The number to count to
  currentNumber = 0; // The current number
  interval: any;     // Variable to hold the interval

  startCounting() {
    this.interval = setInterval(() => {
      if (this.currentNumber < this.LastBillNoCount) {
        this.currentNumber++;
      } else {
        clearInterval(this.interval); // Stop when target is reached
      }
    }, 5); // Speed of counting
  }

  /////////////////////////////////////////////////////// Invoice Number Checking 

  CheckInvoiceNumber() {
    var InvValue = this.supplierdtsform.get('invoice_number').value;
    if (InvValue) {
      InvValue = InvValue.trimStart().trimEnd();
      var data = {
        Invoice_no: InvValue
      };
      this.service.checkInvofPurchseBillExists(data).subscribe((res) => {
        if (res.status === 200 && res.data.length) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Already an Invoice Exists",
            showConfirmButton: true,
            html: `
            <div style="text-align: left;">
                <p><strong>Invoice Details</strong></p>
                <table>
                    <tr>
                        <td>Invoice Date: <strong>${res.data[0].invoice_date}</strong></td>
                    </tr>
                    <tr>
                        <td>Purchase Bill No: <strong>${res.data[0].purchase_bill_no}</strong></td>
                    </tr>
                    <tr>
                        <td>Supplier Name: <strong>${res.data[0].supplier_name}</strong></td>
                    </tr>
                    <tr>
                        <td>Grand Total: <strong>${res.data[0].grandtotal}</strong></td>
                    </tr>
                    <tr>
                        <td>No of Items: <strong>${res.data[0].no_of_items}</strong></td>
                    </tr>
                </table>
            </div>`,
          });
        } else {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "No Invoice Found",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter Invoice No",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }




  ////////////////////////////////////////////////////// Update Row 

  updateArow(row, index, editFormTempo) {
    this.medicineEditForm.patchValue({
      category_id: row.category_id,
      category_name: row.category_name,
      schedule_drugs: row.schedule_drugs,
      company_name: row.company_name,
      composition_name: row.composition_name,
      medicine_name: row.medicine_name,
      medicine_id: row.medicine_id,
      batch_no: row.batch_no,
      hsncode: row.hsncode,
      mrp_rate: row.mrp_rate,
      value: row.value,
      gst_per: row.gst_per,
      quantity: row.quantity,
      with_gst_price: row.with_gst_price,
      expirydate: row.expirydate,
      pack: row.pack,
      eachcost: row.eachcost,
      total_tabs: row.total_tabs,
      free_tabs: row.free_tabs,
      saveInitialMedicinePrice: row.saveInitialMedicinePrice,
      without_gst_medicine_price: row.without_gst_medicine_price,
      indexValue: index
    })
    this.modalService.open(editFormTempo, { size: 'xl', centered: true })
  }

  submittThree: boolean = false;
  get validThree() {
    return this.medicineEditForm.controls;
  }

  packChangetWO(event) {
    this.medicineEditForm.patchValue({
      eachcost: '',
      mrp_rate: '',
      value: '',
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittThree = true
  }


  eachquantitTwo(event) {
    this.medicineEditForm.patchValue({
      value: '',
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittThree = true
    var mrp_rate = parseFloat(event.target.value);
    var quantity = parseFloat(this.medicineEditForm.value.pack);
    if (!isNaN(mrp_rate) && !isNaN(quantity) && quantity !== 0) {
      var eachCost = mrp_rate / quantity;
      this.medicineEditForm.patchValue({
        eachcost: eachCost
      });
    }
  }


  changeIfRateTwo(event) {
    this.medicineEditForm.patchValue({
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittThree = true
  }

  totalmedicinetWO(event) {
    var medicine_price_sheet = this.medicineEditForm.value.value
    var userINputQnty = event.target.value
    if (!isNaN(userINputQnty) && !isNaN(medicine_price_sheet) && medicine_price_sheet !== 0) { }
    var total = medicine_price_sheet * 1 * (userINputQnty * 1);
    this.medicineEditForm.patchValue({
      without_gst_medicine_price: parseFloat(total.toFixed(2)),
      saveInitialMedicinePrice: parseFloat(total.toFixed(2))
    });
  }

  gstCalculationtWO(event) {
    var getWithoutgst = this.medicineEditForm.value.saveInitialMedicinePrice
    const gstAmount = (getWithoutgst * event) / 100;
    const totalPrice = getWithoutgst + gstAmount;
    this.medicineEditForm.patchValue({
      with_gst_price: parseFloat(totalPrice.toFixed(2)),
    });

  }

  stopEntering: boolean = false
  atlasaatValue: any = 0;

  updatetherowandinsert() {
    this.submittThree = true;
    if (this.medicineEditForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Medicine Details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      var gettingFrretabs = this.medicineEditForm.value.free_tabs * this.medicineEditForm.value.pack
      var geetingTotaltabs = this.medicineEditForm.value.pack * this.medicineEditForm.value.quantity
      var fullTabs = gettingFrretabs + geetingTotaltabs
      this.medicineEditForm.patchValue({
        total_tabs: fullTabs
      })
      this.medicinearr.splice(this.medicineEditForm.value.indexValue, 1);

      let formValues = this.medicineEditForm.value;

      let value = parseFloat(formValues.value);
      let pack = parseFloat(formValues.pack);
      let gst_per = parseFloat(formValues.gst_per);

      // Check if all values are valid numbers
      if (!isNaN(value) && !isNaN(pack) && pack !== 0 && !isNaN(gst_per)) {
        let purchase_eachcost = value / pack;
        let tol_with_gst = (purchase_eachcost * gst_per) / 100;
        this.atlasaatValue = purchase_eachcost + tol_with_gst;
      } else {
        
      }
      this.medicinearr.push({
        batch_no: this.medicineEditForm.value.batch_no,
        category_id: this.medicineEditForm.value.category_id,
        category_name: this.medicineEditForm.value.category_name,
        medicine_name: this.medicineEditForm.value.medicine_name,
        schedule_drugs: this.medicineEditForm.value.schedule_drugs,
        company_name: this.medicineEditForm.value.company_name,
        composition_name: this.medicineEditForm.value.composition_name,
        value: this.medicineEditForm.value.value,
        quantity: this.medicineEditForm.value.quantity,
        with_gst_price: this.medicineEditForm.value.with_gst_price,
        gst_per: this.medicineEditForm.value.gst_per,
        expirydate: this.medicineEditForm.value.expirydate,
        hsncode: this.medicineEditForm.value.hsncode,
        medicine_id: this.medicineEditForm.value.medicine_id,
        pack: this.medicineEditForm.value.pack,
        eachcost: this.medicineEditForm.value.eachcost,
        mrp_rate: this.medicineEditForm.value.mrp_rate,
        total_tabs: this.medicineEditForm.value.total_tabs,
        free_tabs: this.medicineEditForm.value.free_tabs,
        saveInitialMedicinePrice: this.medicineEditForm.value.saveInitialMedicinePrice,
        without_gst_medicine_price: this.medicineEditForm.value.without_gst_medicine_price,
        purchase_eachcost: this.atlasaatValue
      });
      this.callthisFunctforSumming();
      this.addDiscountToeveryProducT(0, "add");
      this.medicineEditForm.reset();
      this.modalService.dismissAll();
      this.submittThree = false;
    }
  }

  changeEntryType(e: any, opennewfee) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewentry(opennewfee)
    }
  }

  addnewentry(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  removeLeadingSpace(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.trimStart();
    this.addNewEntry.get('new_entry_by').setValue(inputElement.value, { emitEvent: false });
  }

  Entry_By: any[];

  getentrydata() {
    this.service.getentrydata().subscribe((res: any) => {
      this.Entry_By = res.data;
    });
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
    this.service.addNewEntry(data).subscribe((res) => {
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


  deletedata(a) {
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
        this.deletentrydata(a);
      }
    })
  }

  deletentrydata(data) {
    this.showSpinner = true;
    this.service.deletentrydata(data).subscribe(res => {
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


  paymentloadUPI: boolean = false;
  paymentloadCHECK: boolean = false;

  paymentslot(event: any) {
    var as = event
    this.supplierdtsform.patchValue({
      payment_mode: '',
      payment_ind: '',
      transcation_id: '',
      check_number: '',
    })
    this.supplierdtsform.get('transcation_id').clearValidators();
    this.supplierdtsform.get('check_number').clearValidators();
    if (as == 'UPI') {
      this.paymentloadUPI = true
      this.paymentloadCHECK = false
      this.supplierdtsform.get('transcation_id').setValidators([Validators.required]);
      this.supplierdtsform.patchValue({
        payment_mode: 'UPI',
      })
    } else if (as == 'CHEQUE') {
      this.paymentloadUPI = false
      this.paymentloadCHECK = true
      this.supplierdtsform.get('check_number').setValidators([Validators.required]);
      this.supplierdtsform.patchValue({
        payment_mode: 'CHEQUE',
      })
    } else if (as == 'CASH') {
      this.paymentloadUPI = false
      this.paymentloadCHECK = false
      this.supplierdtsform.patchValue({
        payment_mode: 'CASH',
      })
    }
    this.supplierdtsform.get('check_number').updateValueAndValidity();
    this.supplierdtsform.get('transcation_id').updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  disableKeyboardInput(event: KeyboardEvent) {
    event.preventDefault();
  }

}
