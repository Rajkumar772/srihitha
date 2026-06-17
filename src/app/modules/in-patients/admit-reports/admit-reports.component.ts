import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admit-reports',
  templateUrl: './admit-reports.component.html',
  styleUrls: ['./admit-reports.component.scss']
})
export class AdmitReportsComponent implements OnInit {

  patientManagementSrch: FormGroup;
  showSpinner: boolean = false;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  restOfColumns: string[] = ['cash', 'upi'];

  nextdisplayedColumns: string[] = ['i', 'uh_id', 'ip_number', 'date_of_admit', 'date_of_discharge', 'name', 'final_bill_no',
    'grandTotal', 'paymentMode', 'cash', 'upi', 'transactionId', 'initialDiscount', 'discountAmount', 'totalAmountAftrDscnt', 'gstRate', 'gstAmount', 'totalamount'];

  selectColumns: string[] = ['select1', 'select2','select3','select4','select5','select6','select7','select8',
    'select9','select10','select11','select12','select13','select14','select15','select16','select17','select18'];

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

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private service: InPatienrservicesService,
    private router: Router, private datePipe: DatePipe) {

    this.patientManagementSrch = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })

  }

  ngOnInit(): void {
    this.mainGetcall()
  }

  Patientreportdata: any;
  grandtotal: any;
  upi: any;
  cash: any;
  both: any;

  mainGetcall() {
    this.showSpinner = true
    this.service.getpatientsAdmitreports().subscribe((res: any) => {
      this.showSpinner = false
      this.Patientreportdata = res.data;
      this.grandtotal = 0;
      this.cash = 0;
      this.upi = 0;
      this.both = 0;
      this.Patientreportdata.forEach((item) => {
        const total = parseInt(item.totalamount) || 0;
        this.grandtotal += total;
        if (item.paymentMode === 'CASH') {
          this.cash += total;
        } else if (item.paymentMode === 'UPI') {
          this.upi += total;
        }
        else if (item.paymentMode === 'BOTH') {
          this.both += total;
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

  submitted: boolean = false;
  get validDate() {
    return this.patientManagementSrch.controls;
  }

  patientdata: any;

  SearchDATE() {
    this.submitted = true
    if (this.patientManagementSrch.invalid) {
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
      this.service.getPatientSearchData(this.patientManagementSrch.value).subscribe((res) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.Patientreportdata = res.data;
        this.grandtotal = 0;
        this.cash = 0;
        this.upi = 0;
        this.both = 0;
        this.Patientreportdata.forEach((item) => {
          const total = parseInt(item.totalamount) || 0;
          this.grandtotal += total;
          if (item.paymentMode === 'CASH') {
            this.cash += total;
          } else if (item.paymentMode === 'UPI') {
            this.upi += total;
          }
          else if (item.paymentMode === 'BOTH') {
            this.both += total;
          }
        });

        res.data.forEach((item, index) => {
          item.i = index + 1;
        });
        this.patientdata = []
        this.patientdata = res.data;
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    }
  }

  ////////////
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

  exportTable(i, uh_id) {
    TableUtil.exportTableToExcel(i, uh_id);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }

   Printmedicinewise(dataSource) {
    sessionStorage.setItem('admit-reports-print', JSON.stringify(dataSource.filteredData));
    this.router.navigate(['admit-reports-print']);
  }

}
