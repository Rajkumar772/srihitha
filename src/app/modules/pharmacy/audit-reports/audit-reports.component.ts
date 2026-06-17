import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PharmaserviceService } from '../pharmaservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-audit-reports',
  templateUrl: './audit-reports.component.html',
  styleUrls: ['./audit-reports.component.scss']
})
export class AuditReportsComponent implements OnInit {

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;
  // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'each_day', 'total_bills_generated', 'cash_amount', 'upi_amount', 'both_cash_amount', 'both_upi_amount',
    'credit_amount', 'without_reduction', 'ot_returns', 'day_grandtotal']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4'];
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

  dateSearchForAudit: FormGroup

  gettingUserId: any;

  showSpinner: boolean = false;


  dateSearchForAuditTwo: FormGroup;


  dataSourceTwo: MatTableDataSource<any>;     // Datasource For Mable to assign array

  @ViewChild('paginatorTwo') paginatorTwo: MatPaginator;      // Mat Table Pagination selector
  @ViewChild('sortTwo') sortTwo: MatSort; // Mat Table Sorting selector

  restOfColumns: string[] = ['total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent'];

  nextdisplayedColumnsTwo: string[] = ['i', 'sale_and_purchase_date', 'total_bills_generated', 'total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent', 'net_total'];



  ///////////////////////////////// Month wise
  dataSource2: MatTableDataSource<any>;

  restOfColumnsMonth: string[] = ['i', 'sale_and_purchase_month', 'total_bills_generated',
    'total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent'
  ]
  nextdisplayedColumnsMonth: string[] = [
    'i', 'sale_and_purchase_month', 'total_bills_generated', 'total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent', 'net_total'
  ]






  constructor(
    private service: PharmaserviceService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal, private datePipe: DatePipe, private router: Router

  ) {

    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.gettingUserId = localStorage.getItem('user_id');

    this.dateSearchForAudit = this.formBuilder.group({
      from_date: [this.datePipe.transform(firstDay, 'yyyy-MM-dd'), [Validators.required]],
      to_date: [this.datePipe.transform(lastDay, 'yyyy-MM-dd'), [Validators.required]]
    })

    const currentDateTwo = new Date();
    const firstDayTwo = new Date(currentDateTwo.getFullYear(), currentDateTwo.getMonth(), 1);
    const lastDayTwo = new Date(currentDateTwo.getFullYear(), currentDateTwo.getMonth() + 1, 0);

    this.dateSearchForAuditTwo = this.formBuilder.group({
      from_date: [this.datePipe.transform(firstDayTwo, 'yyyy-MM-dd'), [Validators.required]],
      to_date: [this.datePipe.transform(lastDayTwo, 'yyyy-MM-dd'), [Validators.required]]
    })

  }

  currentDate: any;

  ngOnInit(): void {
    this.gotSaleAuditReport()
    this.gotSaleAuditReportTwo()
  }

  submitt: boolean = false

  get validDate() {
    return this.dateSearchForAudit.controls
  }

  AuditData: any;
  grandTotal: number = 0
  gotSaleAuditReport() {
    this.submitt = true
    if (this.dateSearchForAudit.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.showSpinner = true
      this.service.gettingSaleAuditReport(this.dateSearchForAudit.value).subscribe((res) => {
        this.showSpinner = false
        var id = 0;
        res.data.map((res) => {
          res.i = id + 1;
          id++;
        });
        this.AuditData = res.data
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      });

    }


  }


  getTotalCost() {
    var grandTotal = 0;
    this.AuditData?.map((res) => {
      grandTotal += res.day_grandtotal
    })
    return grandTotal;
  }

  getSalesTotl() {
    var grandTotal = 0;
    this.AuditData?.map((res) => {
      grandTotal += res.without_reduction
    })
    return grandTotal;
  }



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



  discountEdit(discount) {
    var data = {
      discount_percentage: discount,
      month_dates: this.dateSearchForAudit.value
    }
    Swal.fire({
      title: "You r updating Sales Bills Disc (%) ?",
      text: `From Date : ${this.dateSearchForAudit.value.from_date}
      To Date : ${this.dateSearchForAudit.value.to_date}
      Discount Percentage : ${discount} %`,
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.showSpinner = true
        this.service.changeCurrentMonthbillsDisc(data).subscribe((res) => {
          this.showSpinner = false
          if (res.status == 200) {
            Swal.fire({
              title: 'Successfull',
              position: 'top-end',
              text: 'Updated Successfully',
              icon: 'success',
              timer: 1000,
            })
            const currentDate = new Date();
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            this.dateSearchForAudit.get('from_date').setValue(this.datePipe.transform(firstDay, 'yyyy-MM-dd'));
            this.dateSearchForAudit.get('to_date').setValue(this.datePipe.transform(lastDay, 'yyyy-MM-dd'));
            this.gotSaleAuditReport();
            this.hideselect = false
          }
          else {
            Swal.fire({
              title: 'Unsuccess',
              position: 'top-end',
              text: 'Sorry Failed',
              icon: 'error',
              timer: 1000,
            })
          }
        })
      } else if (result.isDismissed) {
        Swal.fire({
          title: 'Cancel',
          position: 'top-end',
          text: 'Update Cancelled',
          icon: 'question',
          timer: 1000,
          showConfirmButton: false
        })
      }
    });
  }


  EveryMonthAuditReport() {
    sessionStorage.setItem('auditReportMonth', JSON.stringify(this.AuditData));
    this.router.navigate(['everyMonthPrint']);
  }

  ///////////////////////////////////////////////


  submitted: boolean = false

  get validDateTwo() {
    return this.dateSearchForAuditTwo.controls
  }

  AuditDataTwo: any = [];
  grandTotalTwo: number = 0
  gotSaleAuditReportTwo() {
    this.submitted = true
    if (this.dateSearchForAuditTwo.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.showSpinner = true
      this.AuditDataTwo = []
      setTimeout(() => {
        this.service.gettingSaleAuditReportGst(this.dateSearchForAuditTwo.value).subscribe((res) => {
          this.showSpinner = false
          var id = 0;
          res.data.map((res) => {
            res.i = id + 1;
            id++;
          }); 

          this.AuditDataTwo = res.data
          this.dataSourceTwo = new MatTableDataSource(res.data);
          this.dataSourceTwo.paginator = this.paginatorTwo;
          this.dataSourceTwo.sort = this.sortTwo;
          this.functionForTotalMonth(this.AuditDataTwo)
          
        });
      }, 1000);

    }
  }

  MonthlyDataTotal: any = []

  functionForTotalMonth(data) {

    function getMonthNameAndYear(dateString) {
      const date = new Date(dateString);
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return { month, year };
    }
    this.MonthlyDataTotal = []
    this.MonthlyDataTotal = data.reduce((acc, obj) => {
      acc.total_bills_generated += obj.total_bills_generated || 0;
      acc.total_5_percent += obj.total_5_percent || 0;
      acc.total_8_percent += obj.total_8_percent || 0;
      acc.total_12_percent += obj.total_12_percent || 0;
      acc.total_18_percent += obj.total_18_percent || 0;
      acc.total_28_percent += obj.total_28_percent || 0;
      acc.tax_5_percent += obj.tax_5_percent || 0;
      acc.tax_8_percent += obj.tax_8_percent || 0;
      acc.tax_12_percent += obj.tax_12_percent || 0;
      acc.tax_18_percent += obj.tax_18_percent || 0;
      acc.tax_28_percent += obj.tax_28_percent || 0;
      acc.net_total += (obj.net_total) || 0;
      acc.i = 1

      const { month, year } = getMonthNameAndYear(obj.sale_and_purchase_date);
      acc.sale_and_purchase_month = month;
      acc.sale_and_purchase_year = year;

      return acc;

    }, {
      total_bills_generated: 0,
      total_5_percent: 0,
      total_8_percent: 0,
      total_12_percent: 0,
      total_18_percent: 0,
      total_28_percent: 0,
      tax_5_percent: 0,
      tax_8_percent: 0,
      tax_12_percent: 0,
      tax_18_percent: 0,
      tax_28_percent: 0,
      net_total: 0,
      sale_and_purchase_month: '',
      sale_and_purchase_year: 0,
      i: 0
    }); // Initial accumulator with all fields set to zero
    this.grandTotalTwo = 0;
    this.grandTotalTwo = this.MonthlyDataTotal.net_total
    this.MonthlyDataTotal = [this.MonthlyDataTotal]
    this.dataSource2 = new MatTableDataSource(this.MonthlyDataTotal);

  }


}
