import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PharmaserviceService } from '../pharmaservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';


@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.scss']
})
export class PurchaseReturnsComponent implements OnInit {


  supplierdtsform: FormGroup;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'invoice_date', 'invoice_number', 'supplier_name', 'supplier_number', 'no_of_items', 'grandtotal', 'view'];




  selectColumns: string[] = ['select1'];
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
    'backgroundColor': 'dodgerblue',
    'color': 'white'
  };


  constructor(private formBuilder: FormBuilder, private router: Router,
    private service: PharmaserviceService, public modalService: NgbModal) { }

  currentDate: any;

  nowCurrentDate: any;

  medicinePurchsForm: FormGroup
  showSpinner: boolean = false

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.getsupplierdata();
    this.getmedicinename();

    this.gotOTreturnsData();

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
      noi: [0,],
      total_grandtotal: [0,]
    });



    this.medicinePurchsForm = this.formBuilder.group({
      hsncode: ['',],
      medicine_name: ["", [Validators.required]],
      schedule_drugs: ['',],
      medicine_id: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      expiry_date: ["", [Validators.required]],
      availability_tabs: [""],
      mrp_rate_per_tab: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      gst_percentage_each_drug: ["", [Validators.required]],
    });


    this.nowCurrentDate = new Date().toISOString().split('T')[0];


  }



  clcick() {
    this.router.navigate(['/pharmacy/pharmacystock'])
  }

  submitted: boolean = false;
  get valid() {
    return this.supplierdtsform.controls;
  }


  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
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



  allMedicinesData: any;
  medicine: any;

  getmedicinename() {
    this.showSpinner = true
    this.service.getMedicinesWithPurchaseDetails().subscribe((res) => {
      this.showSpinner = false
      this.allMedicinesData = res.data;
    });
  }

  typesubmit2: boolean = false

  get type2() {
    return this.medicinePurchsForm.controls;
  }


  medicineBatchData: any;
  selectedMedicne(e) {
    this.medicinePurchsForm.patchValue({
      hsncode: e.hsncode,
      batch_no: "",
      expiry_date: "",
      availability_tabs: "",
      mrp_rate_per_tab: "",
      quantity: "",
      total_amount: "",
      gst_percentage_each_drug: "",
      schedule_drugs: e.schedule_drugs
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
      this.medicinePurchsForm.patchValue({
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      });

      var data = {
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      }
      this.showSpinner = true
      this.service.getAmedicineAllBatchNos(data).subscribe((res) => {
        this.showSpinner = false
        this.medicineBatchData = res.data
      })
    }
  }






  gotDataByBatch: any;
  selectedBatchnoMedicine(b) {
    this.medicinePurchsForm.patchValue({
      expiry_date: "",
      availability_tabs: "",
      mrp_rate_per_tab: "",
      quantity: "",
      total_amount: "",
      gst_percentage_each_drug: "",
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
      this.service.getThatMedicineDataByBatchwise(data).subscribe((res) => {
        this.showSpinner = false
        this.gotDataByBatch = res.data[0]
        this.medicinePurchsForm.patchValue({
          batch_no: this.gotDataByBatch.batch_no,
          expiry_date: this.gotDataByBatch.expirydate,
          availability_tabs: this.gotDataByBatch.available_quantity,
          mrp_rate_per_tab: this.gotDataByBatch.eachcost,
          gst_percentage_each_drug: this.gotDataByBatch.gst_per,
        })
      })
    }
  }




  medicinearr: any = [];



  calculateRintoQnty(event) {
    var each_tab_mrp_rate = this.medicinePurchsForm.value.mrp_rate_per_tab;
    var userINputQnty = event.target.value;

    if (!isNaN(userINputQnty) && !isNaN(each_tab_mrp_rate) && each_tab_mrp_rate !== 0 && each_tab_mrp_rate !== '') {
      var availabilityQuantity = parseInt(this.medicinePurchsForm.value.availability_tabs);
      if (userINputQnty > availabilityQuantity) {
        Swal.fire({
          position: "top-end",
          icon: "question",
          title: `Quantity cannot exceed the available quantity of tabs:  ${availabilityQuantity}`,
          showConfirmButton: false,
          timer: 1500,
        });
        var total = 0;
        this.medicinePurchsForm.patchValue({
          total_amount: total,
        });
        return;
      }
      var total = each_tab_mrp_rate * 1 * (userINputQnty * 1);

      this.medicinePurchsForm.patchValue({
        total_amount: parseFloat(total.toFixed(2)),
      });
    }


  }



  evetn() {
    this.typesubmit2 = true;
    if (this.medicinePurchsForm.invalid) {
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
      element.medicine_id === this.medicinePurchsForm.value.medicine_id &&
      element.batch_no === this.medicinePurchsForm.value.batch_no
    );
    if (testExists) {
      Swal.fire({
        title: "Input Error",
        html: `<div style="text-align: left;">
                    <p><strong>Same Medicine Item with Same Batch No</strong> cannot be added <strong>Twice !</strong></p>
                </div>`,
        icon: "question"
      });
    }
    else {
      this.medicinearr.push({
        hsncode: this.medicinePurchsForm.value.hsncode,
        medicine_name: this.medicinePurchsForm.value.medicine_name,
        schedule_drugs: this.medicinePurchsForm.value.schedule_drugs,
        medicine_id: this.medicinePurchsForm.value.medicine_id,
        batch_no: this.medicinePurchsForm.value.batch_no,
        expiry_date: this.medicinePurchsForm.value.expiry_date,
        availability_tabs: this.medicinePurchsForm.value.availability_tabs,
        mrp_rate_per_tab: this.medicinePurchsForm.value.mrp_rate_per_tab,
        quantity: this.medicinePurchsForm.value.quantity,
        total_amount: this.medicinePurchsForm.value.total_amount,
        gst_percentage_each_drug: this.medicinePurchsForm.value.gst_percentage_each_drug,
      });
      this.callthisFunctforSumming();
      this.medicinePurchsForm.reset();
      this.typesubmit2 = false;
    }
  }


  delete(i) {
    this.medicinearr.splice(i, 1);
    this.callthisFunctforSumming()
  }

  grandtotal: any

  callthisFunctforSumming() {
    let sum = 0;
    this.medicinearr.forEach((element) => {
      var num = element.total_amount;
      sum += parseFloat(num.toFixed(2));
    });
    this.grandtotal = sum;
    var roundOff = 0;
    roundOff = Math.round(this.grandtotal)
    this.supplierdtsform.patchValue({
      total_grandtotal: roundOff,
      noi: this.medicinearr.length
    })

  }




  typeSubmitInventory() {
    this.submitted = true;
    if (this.supplierdtsform.invalid) {
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
    else {
      var data = {
        supplyDts: this.supplierdtsform.value,
        medicinearr: this.medicinearr,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      };
      this.showSpinner = true
      this.service.submtPrchsRetrnBack(data).subscribe((res: any) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Submitted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submitted = false;
          this.supplierdtsform.reset();
          this.medicinearr = [];
          this.typesubmit2 = false;
          this.grandtotal = 0;
          this.gotOTreturnsData();
        } else {
          Swal.fire("Failed");
        }
      });

    }
  }


  //////////////////////////////////////////////////////

  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
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
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
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



  gotOTreturnsData() {
    this.service.getPurchaseRetnsBills().subscribe((res: any) => {
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


  eachPurchaseItems: any = [];

  showAllpurchaseItems(tempoForItemsList, row) {
    var data = {
      id: row.id
    }
    this.showSpinner = true
    this.eachPurchaseItems = []
    this.service.getPurchaseRtrnLists(data).subscribe((res) => {
      this.showSpinner = false
      this.eachPurchaseItems = res.data
    })

    this.modalService.open(tempoForItemsList, { size: 'xl', centered: true })
  }

}


