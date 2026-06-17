import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LabsServicesService } from '../labs-services.service';

@Component({
  selector: 'app-labtestpurchaseitems',
  templateUrl: './labtestpurchaseitems.component.html',
  styleUrls: ['./labtestpurchaseitems.component.scss']
})
export class LabtestpurchaseitemsComponent implements OnInit {

  labtestsupplierdtsForm: FormGroup;
  addlabkitForm: FormGroup;
  labkitEditForm: FormGroup;
  showSpinner: boolean = false;
  ngSelectControl = new FormControl();
  nowCurrentDate: any;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private service: LabsServicesService, public modalService: NgbModal) {

  }

  currentDate: any;
  LastBillNoCount: any = 0;

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

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.getlabtestSupplierdata();
    this.getlabItmsdata();

    this.service.LabpurchasenextItemCount().subscribe((res: any) => {
      this.LastBillNoCount = res.data[0].purchase_bill_no
      this.startCounting()
    })

    const datePipe = new DatePipe('en-Us');
    this.currentDate = datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.nowCurrentDate = new Date().toISOString().split('T')[0];

    this.labtestsupplierdtsForm = this.formBuilder.group({
      supplier_id: ["", [Validators.required]],
      supplier_name: ["", [Validators.required]],
      supplier_number: ["", [Validators.required]],
      supp_landline_no: [''],
      supp_dl_no1: ['', [Validators.required]],
      supp_dl_no2: ['', [Validators.required]],
      supplier_gst: ["", [Validators.required]],
      invoice_number: ["", [Validators.required]],
      invoice_date: [this.currentDate, [Validators.required]],
      total_sum_without_discount: [""],
      total_sum_discount: [""],
      discount_percent: [""],
      cgst_amount: [""],
      sgst_amount: [""],
      grandtotal_after_all: [""],
    });

    this.addlabkitForm = this.formBuilder.group({
      // category_id: ['', [Validators.required]],
      // category_name: ['', [Validators.required]],
      // lab_product_name: ["", [Validators.required]],
      // lab_product_id: ['', [Validators.required]],
      kit_name: ['', [Validators.required]],
      kit_id: ['', [Validators.required]],
      hsncode: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      expirydate: ["", [Validators.required]],
      without_gst_medicine_price: [""],
      gst_per: ["", [Validators.required]],
      mrp_rate: ["", [Validators.required]],
      value: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      with_gst_price: ["", [Validators.required]],
      pack: [""],
      eachcost: [""],
      total_tabs: [""],
      free_tabs: [""],
      saveInitialMedicinePrice: [""],
    });

    this.labkitEditForm = this.formBuilder.group({
      // category_id: ['', [Validators.required]],
      // category_name: ['', [Validators.required]],
      // lab_product_name: ["", [Validators.required]],
      // lab_product_id: ['', [Validators.required]],
      kit_name: ['', [Validators.required]],
      kit_id: ['', [Validators.required]],
      hsncode: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
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
  }

  suppyrdata: any;
  getlabtestSupplierdata() {
    this.service.getlabtestSupplierdata().subscribe((res) => {
      this.suppyrdata = res.data;
    });
  }

  changepns(data) {
    this.suppyrdata.map((res) => {
      if (res.id == data.id) {
        this.labtestsupplierdtsForm.patchValue({
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

  submitted: boolean = false;
  get valid() {
    return this.labtestsupplierdtsForm.controls;
  }

  submittTwo: boolean = false;
  get validTwo() {
    return this.addlabkitForm.controls;
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

  labitemsdata: any = []
  getlabItmsdata() {
    this.service.getlabItmsdata().subscribe((res) => {
      this.showSpinner = false
      this.labitemsdata = res.data;
    });
  }

  changeProductName(e) {
    this.addlabkitForm.patchValue({
      kit_name: e.kit_name,
      kit_id: e.kit_id,
      // lab_product_name: e.lab_product_name,
      // lab_product_id: e.lab_product_id,
      // category_id: e.category_id,
      // category_name: e.category_name,
      hsncode: e.hsncode,
      pack: e.pack,
      eachcost: e.eachcost,
      mrp_rate: e.mrp_rate
    });
  }

  packChange(event) {
    this.addlabkitForm.patchValue({
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

  eachquantity(event) {
    this.labkitEditForm.patchValue({
      value: '',
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittTwo = true
    var mrp_rate = parseFloat(event.target.value);
    var quantity = parseFloat(this.addlabkitForm.value.pack);
    if (!isNaN(mrp_rate) && !isNaN(quantity) && quantity !== 0) {
      var eachCost = mrp_rate / quantity;
      this.addlabkitForm.patchValue({
        eachcost: eachCost
      });
    }
  }

  changeIfRate(event) {
    this.addlabkitForm.patchValue({
      quantity: '',
      without_gst_medicine_price: '',
      saveInitialMedicinePrice: '',
      gst_per: '',
      with_gst_price: '',
      free_tabs: ''
    });
    this.submittTwo = true
  }

  totalmedicine(event) {
    var medicine_price_sheet = this.addlabkitForm.value.value
    var userINputQnty = event.target.value
    if (!isNaN(userINputQnty) && !isNaN(medicine_price_sheet) && medicine_price_sheet !== 0) { }
    var total = medicine_price_sheet * 1 * (userINputQnty * 1);
    this.addlabkitForm.patchValue({
      without_gst_medicine_price: parseFloat(total.toFixed(2)),
      saveInitialMedicinePrice: parseFloat(total.toFixed(2))
    });
  }

  gstCalculation(event) {
    var getWithoutgst = this.addlabkitForm.value.saveInitialMedicinePrice
    const gstAmount = (getWithoutgst * event) / 100;
    const totalPrice = getWithoutgst + gstAmount;
    this.addlabkitForm.patchValue({
      with_gst_price: parseFloat(totalPrice.toFixed(2)),
    });
  }

  checkLabpurchaseInvoiceNumber() {
    var InvValue = this.labtestsupplierdtsForm.get('invoice_number').value;
    if (InvValue) {
      InvValue = InvValue.trimStart().trimEnd();
      var data = {
        Invoice_no: InvValue
      };
      this.service.checkInvofLabPurchseBillExists(data).subscribe((res) => {
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


  productarr: any = []
  addlabdetails() {
    this.submittTwo = true
    if (this.addlabkitForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Lab Kit Details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      var gettingFrretabs = this.addlabkitForm.value.free_tabs * this.addlabkitForm.value.pack
      var geetingTotaltabs = this.addlabkitForm.value.pack * this.addlabkitForm.value.quantity
      var fullTabs = gettingFrretabs + geetingTotaltabs
      this.addlabkitForm.patchValue({
        total_tabs: fullTabs
      })
      this.productarr.push({
        batch_no: this.addlabkitForm.value.batch_no,
        // category_id: this.addlabkitForm.value.category_id,
        // category_name: this.addlabkitForm.value.category_name,
        // lab_product_name: this.addlabkitForm.value.lab_product_name,
        // lab_product_id: this.addlabkitForm.value.lab_product_id,
        kit_name: this.addlabkitForm.value.kit_name,
        kit_id: this.addlabkitForm.value.kit_id,
        value: this.addlabkitForm.value.value,
        quantity: this.addlabkitForm.value.quantity,
        with_gst_price: this.addlabkitForm.value.with_gst_price,
        gst_per: this.addlabkitForm.value.gst_per,
        expirydate: this.addlabkitForm.value.expirydate,
        hsncode: this.addlabkitForm.value.hsncode,
        pack: this.addlabkitForm.value.pack,
        eachcost: this.addlabkitForm.value.eachcost,
        mrp_rate: this.addlabkitForm.value.mrp_rate,
        total_tabs: this.addlabkitForm.value.total_tabs,
        free_tabs: this.addlabkitForm.value.free_tabs,
        saveInitialMedicinePrice: this.addlabkitForm.value.saveInitialMedicinePrice,
        without_gst_medicine_price: this.addlabkitForm.value.without_gst_medicine_price
      });

    }
    this.callthisFunctforSumming();
    this.addDiscountToeveryProducT(0, "add");
    this.addlabkitForm.reset();
    this.submittTwo = false;
  }

  grandtotal: any = 0;

  dis() {
    this.modalService.dismissAll()
  }

  callthisFunctforSumming() {
    let sum = 0;
    this.productarr.forEach((element) => {
      sum += element.without_gst_medicine_price;
    });
    this.grandtotal = parseFloat(sum.toFixed(2));
  }

  delete(i) {
    this.productarr.splice(i, 1);
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

    const groupedItems = this.productarr.reduce((acc, obj) => {
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
    if (this.labtestsupplierdtsForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter all details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (this.productarr.length == 0) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter the Medicines",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      this.labtestsupplierdtsForm.patchValue({
        total_sum_without_discount: this.grandtotal,
        total_sum_discount: this.totalAmountAftrDscnt,
        discount_percent: this.initialDiscount,
        cgst_amount: this.TotalCGST,
        sgst_amount: this.TotalSGST,
        grandtotal_after_all: this.MegaGrandTotal
      })
      if (this.labtestsupplierdtsForm.value.grandtotal_after_all == 0) {
        Swal.fire({
          title: "Grand Total is ZERO",
          text: "Give Discount %",
          icon: "question"
        });
      }
      else {
        var data = {
          supplierdeatils: this.labtestsupplierdtsForm.value,
          productarr: this.productarr,
          user_id: localStorage.getItem('user_id'),
          usr_nm: localStorage.getItem('usr_nm'),
        };
        var InvValue = this.labtestsupplierdtsForm.get('invoice_number').value;
        InvValue = InvValue.trimStart().trimEnd();
        var data1 = {
          Invoice_no: InvValue
        };
        this.showSpinner = true
        this.service.checkLabpurchaseInvoiceNumber(data1).subscribe((res: any) => {
          this.showSpinner = false
          if (res.status == 200 && res.data.length == 0) {
            this.showSpinner = true
            this.service.submitLabpurchasedata(data).subscribe((res: any) => {
              this.showSpinner = false
              if (res.status == 200) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Successfully Submitted",
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.productarr = [];
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

  ////////////////update row

  submittThree: boolean = false;
  get validThree() {
    return this.labkitEditForm.controls;
  }

  updateArow(row, index, editFormTempo) {
    this.labkitEditForm.patchValue({
      // category_id: row.category_id,
      // category_name: row.category_name,
      // lab_product_name: row.lab_product_name,
      // lab_product_id: row.lab_product_id,
      kit_name: row.kit_name,
      kit_id: row.kit_id,
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

  packChangetWO(event) {
    this.labkitEditForm.patchValue({
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
    this.labkitEditForm.patchValue({
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
    var quantity = parseFloat(this.labkitEditForm.value.pack);
    if (!isNaN(mrp_rate) && !isNaN(quantity) && quantity !== 0) {
      var eachCost = mrp_rate / quantity;
      this.labkitEditForm.patchValue({
        eachcost: eachCost
      });
    }
  }

  changeIfRateTwo(event) {
    this.labkitEditForm.patchValue({
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
    var medicine_price_sheet = this.labkitEditForm.value.value
    var userINputQnty = event.target.value
    if (!isNaN(userINputQnty) && !isNaN(medicine_price_sheet) && medicine_price_sheet !== 0) { }
    var total = medicine_price_sheet * 1 * (userINputQnty * 1);
    this.labkitEditForm.patchValue({
      without_gst_medicine_price: parseFloat(total.toFixed(2)),
      saveInitialMedicinePrice: parseFloat(total.toFixed(2))
    });
  }

  gstCalculationtWO(event) {
    var getWithoutgst = this.labkitEditForm.value.saveInitialMedicinePrice
    const gstAmount = (getWithoutgst * event) / 100;
    const totalPrice = getWithoutgst + gstAmount;
    this.labkitEditForm.patchValue({
      with_gst_price: parseFloat(totalPrice.toFixed(2)),
    });

  }

  stopEntering: boolean = false

  updatetherowandinsert() {
    this.submittThree = true;
    if (this.labkitEditForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Enter All Medicine Details",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      var gettingFrretabs = this.labkitEditForm.value.free_tabs * this.labkitEditForm.value.pack
      var geetingTotaltabs = this.labkitEditForm.value.pack * this.labkitEditForm.value.quantity
      var fullTabs = gettingFrretabs + geetingTotaltabs
      this.labkitEditForm.patchValue({
        total_tabs: fullTabs
      })
      this.productarr.splice(this.labkitEditForm.value.indexValue, 1);
      this.productarr.push({
        // category_id: this.labkitEditForm.value.category_id,
        // category_name: this.labkitEditForm.value.category_name,
        // lab_product_name: this.labkitEditForm.value.lab_product_name,
        // lab_product_id: this.labkitEditForm.value.lab_product_id,
        value: this.labkitEditForm.value.value,
        quantity: this.labkitEditForm.value.quantity,
        with_gst_price: this.labkitEditForm.value.with_gst_price,
        gst_per: this.labkitEditForm.value.gst_per,
        expirydate: this.labkitEditForm.value.expirydate,
        hsncode: this.labkitEditForm.value.hsncode,
        batch_no: this.labkitEditForm.value.batch_no,
        kit_name: this.labkitEditForm.value.kit_name,
        kit_id: this.labkitEditForm.value.kit_id,
        pack: this.labkitEditForm.value.pack,
        eachcost: this.labkitEditForm.value.eachcost,
        mrp_rate: this.labkitEditForm.value.mrp_rate,
        total_tabs: this.labkitEditForm.value.total_tabs,
        free_tabs: this.labkitEditForm.value.free_tabs,
        saveInitialMedicinePrice: this.labkitEditForm.value.saveInitialMedicinePrice,
        without_gst_medicine_price: this.labkitEditForm.value.without_gst_medicine_price
      });
      this.callthisFunctforSumming();
      this.addDiscountToeveryProducT(0, "add");
      this.labkitEditForm.reset();
      this.modalService.dismissAll();
      this.submittThree = false;
    }
  }

}
