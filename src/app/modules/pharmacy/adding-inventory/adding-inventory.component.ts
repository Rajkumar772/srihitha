import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import Swal from "sweetalert2";
import { PharmaserviceService } from "../pharmaservice.service";
import { DatePipe } from '@angular/common';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TableUtil } from "src/app/tableUtil";




@Component({
  selector: 'app-adding-inventory',
  templateUrl: './adding-inventory.component.html',
  styleUrls: ['./adding-inventory.component.scss']
})
export class AddingInventoryComponent {

  sourceForm: FormGroup;

  medicineSalesForm: FormGroup;
  currentDate: any;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'invoice_date', 'invoice_number', 'supplier_name', 'no_of_items', 'grandtotal', 'view'];
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




  constructor(
    public formBuilder: FormBuilder,
    private myservice: PharmaserviceService,

    public route: ActivatedRoute,
    private router: Router, private datePipe: DatePipe, private modalService: NgbModal
  ) {

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.sourceForm = this.formBuilder.group({
      source_of_inventory: ["", [Validators.required]],
      invoice_date: [this.currentDate, [Validators.required]],
      noi: [0,],
      total_grandtotal: [0,]
    })



    this.medicineSalesForm = this.formBuilder.group({
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



  }

  showSpinner: boolean = false

  allMedicinesData: any;

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.myservice.getmedicinename().subscribe((res) => {
      this.allMedicinesData = res.data;
    });

    this.gotOTreturnsData();
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

  }








  submitted: boolean = false;

  get valid() {
    return this.sourceForm.controls;
  }


  typesubmit2: boolean = false

  get type2() {
    return this.medicineSalesForm.controls;
  }




  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }



  clcick() {
    this.router.navigate(['/pharmacy/pharmacystock'])
  }



  medicineBatchData: any;
  selectedMedicne(e) {

    this.medicineSalesForm.patchValue({
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
      this.medicineSalesForm.patchValue({
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      });

      var data = {
        medicine_name: e.medicine_name,
        medicine_id: e.medicine_id,
      }
      this.showSpinner = true
      this.myservice.getAmedicineEveryBatchNosOT(data).subscribe((res) => {
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



  medicinearr: any = [];



  calculateRintoQnty(event) {
    var each_tab_mrp_rate = this.medicineSalesForm.value.mrp_rate_per_tab;
    var userINputQnty = event.target.value;

    if (!isNaN(userINputQnty) && !isNaN(each_tab_mrp_rate) && each_tab_mrp_rate !== 0 && each_tab_mrp_rate !== '') {

      var total = each_tab_mrp_rate * 1 * (userINputQnty * 1);

      this.medicineSalesForm.patchValue({
        total_amount: parseFloat(total.toFixed(2)),
      });

    }
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
    else {
      this.medicinearr.push({
        hsncode: this.medicineSalesForm.value.hsncode,
        medicine_name: this.medicineSalesForm.value.medicine_name,
        schedule_drugs: this.medicineSalesForm.value.schedule_drugs,
        medicine_id: this.medicineSalesForm.value.medicine_id,
        batch_no: this.medicineSalesForm.value.batch_no,
        expiry_date: this.medicineSalesForm.value.expiry_date,
        availability_tabs: this.medicineSalesForm.value.availability_tabs,
        mrp_rate_per_tab: this.medicineSalesForm.value.mrp_rate_per_tab,
        quantity: this.medicineSalesForm.value.quantity,
        total_amount: this.medicineSalesForm.value.total_amount,
        gst_percentage_each_drug: this.medicineSalesForm.value.gst_percentage_each_drug,
      });

      this.callthisFunctforSumming();
      this.medicineSalesForm.reset();
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

    this.sourceForm.patchValue({
      total_grandtotal: roundOff,
      noi: this.medicinearr.length
    })

  }


  typeSubmitInventory() {
    this.submitted = true;
    if (this.sourceForm.invalid) {
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
        supplyDts: this.sourceForm.value,
        medicinearr: this.medicinearr,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      };
      this.showSpinner = true

      this.myservice.submitOTstockdata(data).subscribe((res: any) => {
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
          this.sourceForm.reset();
          this.medicinearr = [];
          this.typesubmit2 = false;
          this.grandtotal = 0;
        } else {
          Swal.fire("Failed");
        }
      });
    }
  }




  ///////////////////////////////////// Get call Reports EveryDay 


  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }


  getTotalCost() {
    var grandTotal = 0;
    this.masterdata.map((res) => {
      grandTotal += parseInt(res.grandtotal) || 0;
    })
    return grandTotal;
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


  /////////////////////////////////////



  gotOTreturnsData() {
    this.myservice.getOTreturnsData().subscribe((res: any) => {
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

  otItemsdata: any = [];

  showAllpurchaseItems(tempoForItemsList, row) {
    var data = {
      supplierid: row.id
    }
    this.showSpinner = true
    this.otItemsdata = []
    this.myservice.getOtreturnsitemsEach(data).subscribe((res) => {
      this.showSpinner = false
      this.otItemsdata = res.data
    })
    this.modalService.open(tempoForItemsList, { size: 'xl', centered: true })
  }



  otitemsList() {
    this.modalService.dismissAll()
    sessionStorage.setItem('otitemslist', JSON.stringify(this.otItemsdata))
    this.router.navigate(['otitemslist_print']);
  }



  changeDates(e) {
    var data = {
      invoice_date: e.target.value
    }
    this.showSpinner = true
    this.myservice.getOTreturnsDatewise(data).subscribe((res: any) => {
      this.showSpinner = false
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



  otReturnPrints() {
    sessionStorage.setItem('otreturnprints', JSON.stringify(this.masterdata))
    this.router.navigate(['otreturn_print']);
  }







}
