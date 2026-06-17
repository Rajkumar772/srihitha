
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { OpServicesService } from '../op-services.service';


// import 'jspdf-autotable';


@Component({
  selector: 'app-procedures-reports',
  templateUrl: './procedures-reports.component.html',
  styleUrls: ['./procedures-reports.component.scss']
})
export class ProceduresReportsComponent {

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  restOfColumns: string[] = ['cash_amount', 'upi_amount'];
  nextdisplayedColumns: string[] = ['i', 'date', 'procedure_bill_no', 'old_uhid_no',
    'name', 'age', 'phone_number', 'gender', 'address', 'd_name',
    'grandtotal', 'payment_mode', 'cash_amount', 'upi_amount', 'gst_amount', 'gst_percentage', 'totalAmountAftrgst', 'entry_name', 'view', 'print']
  selectColumns: string[] = ['selectSlo', 'select0', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8',
    'select9', 'select10', 'select11', 'select12', 'select13', 'select14', 'select15', 'select16'];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = '';
  category: any;
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

  procedureSrchForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private service: OpServicesService,
    public route: ActivatedRoute, private router: Router, public datePipe: DatePipe, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.procedureSrchForm = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
    this.getoverallproceduredata()
  }

  proceduredata: any;
  showSpinner: boolean = false;

  getoverallproceduredata() {
    this.showSpinner = true
    this.service.getoverallproceduredata().subscribe((res: any) => {
      this.showSpinner = false;
      this.proceduredata = res.data;
      this.grandtotal = 0;
      this.cash = 0;
      this.upi = 0;
      this.both = 0;
      this.proceduredata.forEach((item) => {
        const total = parseInt(item.totalAmountAftrgst) || 0;
        this.grandtotal += total;
        if (item.payment_mode === 'CASH') {
          this.cash += total;
        } else if (item.payment_mode === 'UPI') {
          this.upi += total;
        }
        else if (item.payment_mode === 'BOTH') {
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

  submitt: boolean = false;
  get validDate() {
    return this.procedureSrchForm.controls;
  }


  grandtotal: any;
  upi: any;
  cash: any;
  both: any;

  SearchDATE() {
    this.submitt = true
    if (this.procedureSrchForm.invalid) {
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
      this.service.getproceduresrchdata(this.procedureSrchForm.value).subscribe((res) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.grandtotal = 0;
        this.cash = 0;
        this.upi = 0;
        this.both = 0;
        res.data.forEach((item) => {
          const total = parseInt(item.totalAmountAftrgst) || 0;
          this.grandtotal += total;
          if (item.payment_mode === 'CASH') {
            this.cash += total;
          } else if (item.payment_mode === 'UPI') {
            this.upi += total;
          } else if (item.payment_mode === 'BOTH') {
            this.both += total;
          }
        });
        res.data.forEach((item, index) => {
          item.i = index + 1;
        });

        this.proceduredata = []
        this.proceduredata = res.data
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
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
      this.headerclass['background-color'] = 'black';
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

  exportTable(i, date) {
    TableUtil.exportTableToExcel(i, date);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.headerclass['background-color'] = event.target.value;
  }

  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  proceduredetailsdata: any;
  record123(viewModal, row) {
    var data = {
      'procedure_id': row.id,
    }
    this.service.getproceduredetailsdata(data).subscribe((res) => {
      this.proceduredetailsdata = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'lg' })
  }

  Printproceduredata(row) {
    sessionStorage.setItem('procedure-reports-print', JSON.stringify(row))
    this.router.navigate(['procedure-reports-print']);
  }


  Printmedicinewise(dataSource) {
    sessionStorage.setItem('procedure-reports-overall-print', JSON.stringify(dataSource.filteredData));
    this.router.navigate(['procedure-reports-overall-print']);
  }

}
