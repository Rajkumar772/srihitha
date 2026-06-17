import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { InPatienrservicesService } from '../in-patienrservices.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';

@Component({
  selector: 'app-ipdreports',
  templateUrl: './ipdreports.component.html',
  styleUrls: ['./ipdreports.component.scss']
})
export class IpdreportsComponent implements OnInit {
  checkinform: FormGroup;
  checkoutform: FormGroup;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'uh_id', 'ip_number', 'name', 'age', 'gender', 'phone_number', 'occupation', 'address',
    'complaint', 'doctor_name', 'room_number', 'bed_no', 'price', 'amount'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any;
  age: any;
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };
  showSpinner: boolean = false
  //////////////////////////////////////////////////////////////mat2/////////////////////////////

  dataSource2: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator2: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort2: MatSort;                     // Mat Table Sorting selector

  nextdisplayedColumns2: string[] = ['i', 'uh_id', 'ip_number', 'name', 'age', 'gender', 'phone_number', 'occupation', 'address', 'complaint', 'doctor_name', 'room_number', 'bed_no', 'price',
    'amount', 'discharge_date', 'discharge_amount'];
  selectColumns2: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6'];
  hideselect2: boolean = false;
  reset2: any = ''
  masterdata2: any = [];
  clonedata2: any[] = [];

  constructor(private formBuilder: FormBuilder, private service: InPatienrservicesService, private router: Router) { }

  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }

  ngOnInit(): void {
    this.checkinform = this.formBuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],

    });
    this.checkoutform = this.formBuilder.group({
      from_dates: ['', [Validators.required]],
      to_dates: ['', [Validators.required]],

    });
    this.todaycheckindata();
    this.todaycheckoutdata();
  
  }

  radioSubmit() {
    if (this.checkinform.invalid) {
      alert("Please enter details");
    } else {
      this.showSpinner = true;
      var data = {
        from_date: this.checkinform.value.from_date,
        to_date: this.checkinform.value.to_date
      }
      this.service.checkinreports(data).subscribe((res: any) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.todaycheckin = res.data;
        this.grandtotalcheckin = 0;
        this.todaycheckin.forEach((item) => {
          const total = parseInt(item.amount) || 0;
          this.grandtotalcheckin += total;
        });

        res.data.forEach((item, index) => {
          item.i = index + 1;
        });
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => {
          this.showSpinner = false;
        });
    }
  }

  checkoutsubmit() {
    if (this.checkoutform.invalid) {
      alert("Please enter details");
    } else {
      this.showSpinner = true;
      var data = {
        from_dates: this.checkoutform.value.from_dates,
        to_dates: this.checkoutform.value.to_dates
      }
      this.service.checkoutreports(data).subscribe((res: any) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.todaycheckout = res.data;
        this.grandtotalcheckout = 0;
        this.todaycheckout.forEach((item) => {
          const total = parseInt(item.discharge_amount) || 0;
          this.grandtotalcheckout += total;
        });

        res.data.forEach((item, index) => {
          item.i = index + 1;
        });
        this.masterdata2 = res.data;
        this.clonedata2 = this.masterdata2;
        this.dataSource2 = new MatTableDataSource(res.data);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
      },
        error => {
          this.showSpinner = false;
        });
    }
  }
  //table code Star
  applyFilter(event: any) {
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

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.headerclass['background-color'] = event.target.value;
  }


  //////////////////////////////////////////////mat2///////////////
  applyFilter2(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggle2(index) {
    if (index) {
      this.hideselect = !this.hideselect;
    } else {
      this.hideselect = false;
      this.headerclass['background-color'] = '#a86669';
      this.reset2 = '';
    }
    this.clonedata2 = this.masterdata2;
    this.dataSource2 = new MatTableDataSource(this.clonedata);
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = null;
    this.dataSource2.sort = this.sort;
  }

  columnfilterdata2(object, index) {
    if (object == undefined) {
      this.clonedata2 = this.masterdata2;
      this.reset = '';
    } else {
      if (index == 0) {
        this.clonedata2 = this.clonedata2.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSource2 = new MatTableDataSource(this.clonedata);
  }


  data1Chckin: any

  data2Chckin: any
  grandtotalcheckin: any

  todaycheckin: any;

  todaycheckindata() {
    this.showSpinner = true;
    this.service.todaycheckindata().subscribe(res => {
      this.showSpinner = false;
      this.todaycheckin = res.data;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NO DATA FOUND'
        })
      }
      this.todaycheckin = res.data;
      this.grandtotalcheckin = 0;
      this.todaycheckin.forEach((item) => {
        const total = parseInt(item.amount) || 0;
        this.grandtotalcheckin += total;
      });

      res.data.forEach((item, index) => {
        item.i = index + 1;
      });
      this.data1Chckin = []
      this.data1Chckin = res.data;
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      error => {
        this.showSpinner = false;
      })
  }

  grandtotalcheckout: any;
  todaycheckout: any

  todaycheckoutdata() {
    this.showSpinner = true;
    this.service.todaycheckoutdata().subscribe(res => {
      this.showSpinner = false;
      this.todaycheckout = res.data;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NO DATA FOUND'
        })
      }
      this.todaycheckout = res.data;
      this.grandtotalcheckout = 0;
      this.todaycheckout.forEach((item) => {
        const total = parseInt(item.discharge_amount) || 0;
        this.grandtotalcheckout += total;
      });
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });
      this.data2Chckin = []
      this.data2Chckin = res.data;
      this.masterdata2 = res.data;
      this.clonedata2 = this.masterdata2;
      this.dataSource2 = new MatTableDataSource(res.data);
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    },
      error => {
        this.showSpinner = false;
      });
  }

  addIpcasesheet(row) {
    Swal.fire({
      title: 'Do You Want to create IP Case sheet',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.addIPnewCaseSheetforpatient(row).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Ok',
              text: 'IP Sheet Created',
              timer: 1000
            })
            setTimeout(() => {
              this.router.navigate(['/in-patients/ip-patient-management']);
            }, 1000);
          }
        })
      }
    })
  }

  getTotalCost() {
    var grandTotal = 0;
    this.data1Chckin?.map((res) => {
      grandTotal += parseInt(res.amount) || 0;
    })
    return grandTotal;
  }

  getTotalCost2() {
    var grandTotal = 0;
    this.data2Chckin?.map((res) => {
      grandTotal += parseInt(res.discharge_amount) || 0;
    })
    return grandTotal;
  }
 
}
