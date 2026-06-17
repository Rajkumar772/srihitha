import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PharmaserviceService } from '../pharmaservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-purchasereport',
  templateUrl: './purchasereport.component.html',
  styleUrls: ['./purchasereport.component.scss']
})
export class PurchasereportComponent {

  natureofcomplaintform: FormGroup;
  editform: FormGroup;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'purchase_bill_no', 'supplier_name', 'supplier_gst', 'invoice_number', 'invoice_date',
    'total_gross', 'discount_percent', 'total_wth_discount',
    'cgst_amount', 'sgst_amount', 'no_of_items', 'grandtotal', 'p_members', 'view',
    'purchase_payment_date', 'purchase_payment_mode', 'purchase_transcation_id',
    'purchase_check_number', 'purchase_payment_ind', 'edit']
  selectColumns: string[] = ['select1', 'selectBillno', 'select2', 'select3', 'select4', 'select5', 'select6',
    'select11', 'select12', 'select13', 'select14', 'select15', 'select16', 'select17', 'select24', 'select25', 'select7', 'select8', 'select9', 'select10',];
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

  showSpinner: boolean = false;

  submitt: boolean = false

  updateTabForm: FormGroup
  nowCurrentDate: any;
  updatepaymentstatusForm: FormGroup
  petition_form: any;
  cdRef: any;
  currentDate: any;

  constructor(
    private service: PharmaserviceService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router, public datePipe: DatePipe,
  ) {

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.updateTabForm = this.formBuilder.group({
      medicine_name: ['', [Validators.required]],
      batch_no: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      total_tabs: ['', [Validators.required]],
      gst_per: ['', [Validators.required]],
      expirydate: ['', [Validators.required]],
      id: [''],
      record_id: ['']
    })

    this.updatepaymentstatusForm = this.formBuilder.group({
      record_id: ['', [Validators.required]],
      payment_mode: ["", [Validators.required]],
      payment_ind: ["", [Validators.required]],
      transcation_id: ["",],
      check_number: ["",],
      purchase_payment_date: [this.currentDate, [Validators.required]]
    })

    this.nowCurrentDate = new Date().toISOString().split('T')[0];
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }


  suppyrdata: any;

  ngOnInit(): void {
    this.gotPurchaseReportsAll()
    this.service.getsupplierdata().subscribe((res) => {
      this.suppyrdata = res.data;
    });
  }

  selectedArraySupplyrs: any = []
  changepns(data) {
    const testExists = this.selectedArraySupplyrs.some(
      (element) => element.supplier_id === data.medicine_id
    );
    if (testExists) {
      Swal.fire('Supplier Already Added.');
    } else {
      this.selectedArraySupplyrs.push({ supplier_id: data.medicine_id, supplier_name: data.name })
      this.HitApi()
    }
  }

  HitApi() {
    const supplierIds = this.selectedArraySupplyrs.map(supplier => supplier.supplier_id);
    if (supplierIds.length) {
      this.showSpinner = true
      this.service.getEachSupplierdata(supplierIds).subscribe((res) => {
        this.showSpinner = false
        var id = 0;
        res.data.map((res) => {
          res.i = id + 1;
          id++;
        });
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
    else {
      this.gotPurchaseReportsAll();
    }
  }

  removeItem(index) {
    this.selectedArraySupplyrs.splice(index, 1)
    this.HitApi()
  }

  functionToGetRange() {
    const from_date = document.getElementById('from_date') as HTMLInputElement;
    const to_date = document.getElementById('to_date') as HTMLInputElement;

    if (from_date.value && to_date.value) {

      var data = {
        from_date: from_date.value,
        to_date: to_date.value
      }
      this.showSpinner = true
      this.service.getpharmacyreports(data).subscribe((res: any) => {
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
    } else {
      Swal.fire({
        position: 'top-end',
        title: 'Please select both dates.',
        icon: 'error',
        timer: 1500
      })
    }

  }


  printData: any = [];

  getTotalCost() {
    var grandTotal = 0;
    this.printData = this.dataSource?.filteredData;
    const filteredData = this.dataSource?.filteredData;
    filteredData?.map((res) => {
      grandTotal += parseInt(res.grandtotal) || 0;
    })
    return grandTotal;
  }

  gotPurchaseReportsAll() {
    this.showSpinner = true
    this.service.getPurchaseReportsAll().subscribe((res) => {
      this.showSpinner = false
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  modalDismiss() {
    this.modalService.dismissAll();
  }

  modalDis() {
    this.modalService.dismissAll();
  }

  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }

  eachPurchaseItems: any = [];
  showAllpurchaseItems(tempoForItemsList, row) {
    var data = {
      supplierid: row.id
    }
    this.showSpinner = true
    this.eachPurchaseItems = []
    this.service.getAllitemsofPurchase(data).subscribe((res) => {
      this.showSpinner = false

      this.eachPurchaseItems = res.data
    })

    this.modalService.open(tempoForItemsList, { size: 'xl', centered: true })
  }

  gotopurchase() {
    this.router.navigate(['/pharmacy/purchaseitems'])
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


  submitted: boolean = false;
  get validTab() {
    return this.updateTabForm.controls;
  }



  updateTabsinBatchMed(row, editFormTempo) {

    this.updateTabForm.patchValue({
      medicine_name: row.medicine_name,
      batch_no: row.batch_no,
      quantity: row.quantity,
      total_tabs: row.total_tabs,
      id: row.supplierid,
      gst_per: row.gst_per,
      expirydate: row.expirydate,
      record_id: row.id
    })
    this.modalService.open(editFormTempo, { size: 'lg', centered: false })
  }

  updateTabs(tempoForItemsList) {
    this.submitted = true
    if (this.updateTabForm.invalid) {
      alert("Please fill all details")
    }
    else {
      this.service.updateTabsofAmedicine(this.updateTabForm.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Upadted",
            showConfirmButton: false,
            timer: 1000,
          });
          this.submitted = false;
          this.modalService.dismissAll();
          this.showAllpurchaseItems(tempoForItemsList, this.updateTabForm.value)
          this.updateTabForm.reset();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }

  printPurchases() {
    sessionStorage.setItem('purchaseReports', JSON.stringify(this.printData))
    this.router.navigate(['purchasereports-prints']);
  }


  paymentloadUPI: boolean = false;
  paymentloadCHECK: boolean = false;

  modifyPtntdts(updatepaymentstatusTempo, row) {
    this.updatepaymentstatusForm.patchValue({
      record_id: '',
      payment_mode: '',
      payment_ind: '',
      transcation_id: '',
      check_number: '',
      purchase_payment_date: ''
    })
    if (row.payment_mode == 'CASH') {
      this.paymentloadUPI = false
      this.paymentloadCHECK = false
    }
    else if (row.payment_mode == 'UPI') {
      this.paymentloadUPI = true
      this.paymentloadCHECK = false
    }
    else if (row.payment_mode == 'CHEQUE') {
      this.paymentloadCHECK = true
      this.paymentloadUPI = false
    }
    else if (row.payment_mode == 'NET BANKING') {
      this.paymentloadUPI = true
      this.paymentloadCHECK = false
    }
    this.updatepaymentstatusForm.patchValue({
      record_id: row.id,
      payment_mode: row.purchase_payment_mode,
      payment_ind: row.purchase_payment_ind,
      transcation_id: row.purchase_transcation_id,
      check_number: row.purchase_check_number,
      purchase_payment_date: row.purchase_payment_date
    })
    this.modalService.open(updatepaymentstatusTempo, { centered: true, size: "lg" });
  }

  paymentslot(event: any) {
    var as = event
    this.updatepaymentstatusForm.patchValue({
      payment_mode: '',
      payment_ind: '',
      transcation_id: '',
      check_number: '',
    })
    this.updatepaymentstatusForm.get('transcation_id').clearValidators();
    this.updatepaymentstatusForm.get('check_number').clearValidators();
    if (as == 'UPI') {
      this.paymentloadUPI = true
      this.paymentloadCHECK = false
      this.updatepaymentstatusForm.get('transcation_id').setValidators([Validators.required]);
      this.updatepaymentstatusForm.patchValue({
        payment_mode: 'UPI',
      })
    } else if (as == 'CHEQUE') {
      this.paymentloadUPI = false
      this.paymentloadCHECK = true
      this.updatepaymentstatusForm.get('check_number').setValidators([Validators.required]);
      this.updatepaymentstatusForm.patchValue({
        payment_mode: 'CHEQUE',
      })
    } else if (as == 'CASH') {
      this.paymentloadUPI = false
      this.paymentloadCHECK = false
      this.updatepaymentstatusForm.patchValue({
        payment_mode: 'CASH',
      })
    }
    else if (as == 'NET BANKING') {
      this.paymentloadUPI = true
      this.paymentloadCHECK = false
      this.updatepaymentstatusForm.get('transcation_id').setValidators([Validators.required]);
      this.updatepaymentstatusForm.patchValue({
        payment_mode: 'NET BANKING',
      })
    }
    this.updatepaymentstatusForm.get('check_number').updateValueAndValidity();
    this.updatepaymentstatusForm.get('transcation_id').updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  updatePatientdts() {
    if (this.updatepaymentstatusForm.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'please fill Details',
        icon: 'error',
        timer: 1500
      })
    }
    else {
      this.service.updatePaymentStatus(this.updatepaymentstatusForm.value).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            title: 'Updated',
            icon: 'success',
            timer: 1500
          })
          this.updatepaymentstatusForm.reset();
          this.gotPurchaseReportsAll();
          this.modalService.dismissAll();
        }
      })
    }
  }


}
