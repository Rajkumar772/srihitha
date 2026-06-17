import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';
import { LabsServicesService } from '../labs-services.service';


@Component({
  selector: 'app-labtestpurchase-reports',
  templateUrl: './labtestpurchase-reports.component.html',
  styleUrls: ['./labtestpurchase-reports.component.scss']
})
export class LabtestpurchaseReportsComponent {


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'purchase_bill_no', 'supplier_name', 'supplier_gst', 'invoice_number', 'invoice_date',
    'total_gross', 'discount_percent', 'total_wth_discount', 'cgst_amount', 'sgst_amount', 'no_of_items', 'grandtotal', 'view']
  selectColumns: string[] = ['select1', 'selectBillno', 'select2', 'select3'];
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
  nowCurrentDate: any;

  constructor(private service: LabsServicesService, private formBuilder: FormBuilder, private modalService: NgbModal, public router: Router) {

    this.nowCurrentDate = new Date().toISOString().split('T')[0];

  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  suppyrdata: any
  ngOnInit(): void {
    this.gotPurchaseReportsAll()
    this.service.getlabtestSupplierdata().subscribe((res) => {
      this.suppyrdata = res.data
    });
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
      this.service.getlabpurchasereports(data).subscribe((res: any) => {
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

  gotPurchaseReportsAll() {
    this.showSpinner = true
    this.service.getlabPurchaseReportsAll().subscribe((res) => {
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

  selectedArraySupplyrs: any = []
  changepns(data) {
    const testExists = this.selectedArraySupplyrs.some(
      (element) => element.supplier_id === data.lab_product_id
    );
    if (testExists) {
      Swal.fire('Supplier Already Added.');
    } else {
      this.selectedArraySupplyrs.push({ supplier_id: data.lab_product_id, supplier_name: data.name })
      this.HitApi()
    }
  }

  eachPurchaseItems: any = [];
  showAllLabpurchaseItems(tempoForItemsList, row) {
    var data = {
      supplierid: row.id
    }
    this.showSpinner = true
    this.eachPurchaseItems = []
    this.service.getAllLabitemsofPurchase(data).subscribe((res) => {
      this.showSpinner = false

      this.eachPurchaseItems = res.data
    })

    this.modalService.open(tempoForItemsList, { size: 'xl', centered: true })
  }

  HitApi() {
    const supplierIds = this.selectedArraySupplyrs.map(supplier => supplier.supplier_id);
    if (supplierIds.length) {
      this.showSpinner = true
      this.service.getEachLabSupplierdata(supplierIds).subscribe((res) => {
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

  //////////////////


  modalDismiss() {
    this.modalService.dismissAll();
  }

  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }

  gotopurchase() {
    this.router.navigate(['/labsmdl/lab-test-purchase-items'])
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


}
