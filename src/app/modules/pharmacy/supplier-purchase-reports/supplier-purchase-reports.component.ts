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
  selector: 'app-supplier-purchase-reports',
  templateUrl: './supplier-purchase-reports.component.html',
  styleUrls: ['./supplier-purchase-reports.component.scss']
})

export class SupplierPurchaseReportsComponent implements OnInit {

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'supplier_name', 'supplier_gst', 'invoice_number', 'invoice_date',
    'purchase_bill_no', 'grandtotal','purchase_payment_date', 'purchase_payment_mode', 'purchase_transcation_id',
    'purchase_check_number', 'purchase_payment_ind',]
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7','select8','select9','select10','select11'];
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
    'backgroundColor': 'blue',
    'color': 'white'
  };

  showSpinner: boolean = false;


  constructor(
    private service: PharmaserviceService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router, public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.gotsupplierPurchaseReports();
    this.getsupplierdata();
  }

  cleared: any;
  notcleared: any;
  grandTotal: any;

  gotsupplierPurchaseReports() {
    this.showSpinner = true
    this.service.gotsupplierPurchaseReports().subscribe((res) => {
      this.showSpinner = false
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.grandTotal = 0;
      this.cleared = 0;
      this.notcleared = 0;
      res.data.forEach((item) => {
        const total = parseInt(item.grandtotal) || 0;
        this.grandTotal += total;
        if (item.purchase_payment_ind === 'CLEARED') {
          this.cleared += total;
        } else if (item.purchase_payment_ind === 'NOT CLEARED') {
          this.notcleared += total;
        }
      });
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });

      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  suppyrdata: any = []
  getsupplierdata() {
    this.service.getsupplierdata().subscribe((res: any) => {
      this.suppyrdata = res.data
    })
  }

  changepns(event) {
    this.showSpinner = true;
    this.service.supplierdatafilter(event).subscribe(res => {
      this.showSpinner = false;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NO DATA FOUND'
        })
      }
      this.grandTotal = 0;
      this.cleared = 0;
      this.notcleared = 0;
      res.data.forEach((item) => {
        const total = parseInt(item.grandtotal) || 0;
        this.grandTotal += total;
        if (item.purchase_payment_ind === 'CLEARED') {
          this.cleared += total;
        } else if (item.purchase_payment_ind === 'NOT CLEARED') {
          this.notcleared += total;
        }
      });
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });

      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  supplierBydatefilter() {
    const from_date = document.getElementById('from_date') as HTMLInputElement;
    const to_date = document.getElementById('to_date') as HTMLInputElement;
    if (from_date.value && to_date.value) {
      var data = {
        from_date: from_date.value,
        to_date: to_date.value
      }      
      this.showSpinner = true
      this.service.supplierBydatefilter(data).subscribe((res: any) => {        
        this.showSpinner = false
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.grandTotal = 0;
        this.cleared = 0;
        this.notcleared = 0;
        res.data.forEach((item) => {
          const total = parseInt(item.grandtotal) || 0;
          this.grandTotal += total;
          if (item.purchase_payment_ind === 'CLEARED') {
            this.cleared += total;
          } else if (item.purchase_payment_ind === 'NOT CLEARED') {
            this.notcleared += total;
          }
        });
        res.data.forEach((item, index) => {
          item.i = index + 1;
        });        
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


  gotopurchase() {
    this.router.navigate(['/pharmacy/purchaseitems'])
  }

  modalDismiss() {
    this.modalService.dismissAll();
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

  exportTable(id, supplier_name) {
    TableUtil.exportTableToExcel(id, supplier_name);
  }

  printsupplierPurchases() {
    sessionStorage.setItem('supplier-purchase-reports-print', JSON.stringify(this.printData))
    this.router.navigate(['supplier-purchase-reports-print']);
  }

}
