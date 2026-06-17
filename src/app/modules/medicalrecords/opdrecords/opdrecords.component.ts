// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import autoTable from 'jspdf-autotable';
// import { OpServicesService } from '../op-services.service';
import { from } from 'rxjs';
import { left } from '@popperjs/core';
import { OpServicesService } from '../../op-patients/op-services.service';

@Component({
  selector: 'app-opdrecords',
  templateUrl: './opdrecords.component.html',
  styleUrls: ['./opdrecords.component.scss']
})
export class OpdrecordsComponent implements OnInit {

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

  restOfColumns: string[] = [];

  nextdisplayedColumns: string[] = ['i', 'print', 'date', 'patient_type', 'uh_id',
    'name', 'age', 'gender', 'phone_number', 'marital_status', 'address', 'doctor_name', 'card_type', 'card_appointment_type', 'consultant_fee',
    'payment_types', 'payment_way',
    'expiry_date', 'after_discount_total', 'i_ts'];
  selectColumns: string[] = [];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

  editForm: any;
  op_patientsSrch: FormGroup
  submitted: boolean = false
  showSpinner: boolean = false
  user_id: any
  usr_nm: any;


  constructor(private modalService: NgbModal, private router: Router,
    public formBuilder: FormBuilder, private myservice: OpServicesService) {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.editForm = this.formBuilder.group({
      // sur_name: [""],
      name: ["", [Validators.required]],
      age: ["", [Validators.required]],
      phone_number: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      occupation: [""],
      guardian: [""],
      // aadhar: [""],
      address: [""],
      payment: [""],
      transcation_id: [""],
      description: ['']
    })

    this.op_patientsSrch = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
  }

  submitt: boolean = false;
  get validDate() {
    return this.op_patientsSrch.controls;
  }

  ngOnInit(): void {
    this.get()
  }

  hideme: boolean[] = [];
  patientsdata: any = [];

  SearchDATE() {
    this.submitt = true
    if (this.op_patientsSrch.invalid) {
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
      this.myservice.getbookingsrchdata(this.op_patientsSrch.value).subscribe((res) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.grandTotal = 0;
        this.cash = 0;
        this.upi = 0;
        this.both = 0;
        res.data.forEach((item) => {
          const total = parseInt(item.after_discount_total) || 0;
          this.grandTotal += total;
          if (item.payment_way === 'CASH') {
            this.cash += total;
          } else if (item.payment_way === 'UPI') {
            this.upi += total;
          }
          else if (item.payment_way === 'BOTH') {
            this.both += total;
          }
        });
        res.data.forEach((item, index) => {
          item.i = index + 1;
        });

        this.patientsdata = []
        this.patientsdata = res.data
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
  }

  cash: any;
  upi: any;
  both: any;
  grandTotal: any;

  get() {
    this.showSpinner = true
    this.myservice.getbookingdata().subscribe((res: any) => {
      this.showSpinner = false
      this.patientsdata = []
      this.patientsdata = res.data;
      this.grandTotal = 0;
      this.cash = 0;
      this.upi = 0;
      this.both = 0;
      this.patientsdata.forEach((item) => {
        const total = parseInt(item.after_discount_total) || 0;
        this.grandTotal += total;
        if (item.payment_way === 'CASH') {
          this.cash += total;
        } else if (item.payment_way === 'UPI') {
          this.upi += total;
        }
        else if (item.payment_way === 'BOTH') {
          this.both += total;
        }
      });

      for (let i = 0; i < this.patientsdata.length; i++) {
        this.hideme.push(true);
      }

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

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  printData(row) {
    sessionStorage.setItem('opprint', JSON.stringify(row))
    this.router.navigate(['op-print']);
  }

  print(row) {
    sessionStorage.setItem('vitalprint', JSON.stringify(row))
    this.router.navigate(['vital-print']);
  }

  patient_id: any;
  editPatientDetails(data, editFormTempo) {
    this.patient_id = data.id;
    this.editForm.patchValue({
      // sur_name: data.sur_name,
      name: data.name,
      age: data.age,
      phone_number: data.phone_number,
      gender: data.gender,
      address: data.address,
      description: data.description
    });

    this.modalService.open(editFormTempo, { centered: true, size: "lg" });
  }

  editData() {
    this.submitted = true
    if (this.editForm.invalid) {
      alert("Please fill all details")
    }
    else {
      this.editForm.value.patient_id = this.patient_id;
      this.myservice.EditPatient(this.editForm.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Upadted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submitted = false;
          this.editForm.reset();
          this.get()
          this.modalService.dismissAll();
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

  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }

  numericOnly(event): boolean {
    let patt = /^([0-9,/,.,])$/;
    let result = patt.test(event.key);
    return result;
  }

  get valid() {
    return this.editForm.controls;
  }

  rowData: any;

  viewDetails(row, viewTemplate) {
    this.rowData = [row]
    this.modalService.open(viewTemplate, { centered: true, size: "lg" });
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
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

  masterdata_main: any;
  forshowdisplay1: any = [];

  exportexcel(dataSource) {
    this.masterdata_main = dataSource._data._value;

    const headers = [
      'S.NO',
      'Booking Date',
      'Card Type',
      'Patient Name',
      'Address',
      'Payment Way',
      'Total After Discount',
    ];

    const exportData = this.masterdata_main.map((table: any) => [
      table.i,
      this.formatDate(table.date) || '-',
      table.card_appointment_type || '-',
      table.name || '-',
      table.address || '-',
      table.payment_way || 'FREE',
      table.after_discount_total + '/-' || '-',
    ]);
    let fromDate = this.op_patientsSrch.value.from_date;
    let toDate = this.op_patientsSrch.value.to_date;
    if (!fromDate || !toDate) {
      const currentDate = new Date();
      fromDate = fromDate || currentDate;
      toDate = toDate || currentDate;
    }
    const formattedFromDate = this.formatDateToDDMMYYYY(fromDate);
    const formattedToDate = this.formatDateToDDMMYYYY(toDate);
    const title = [['Hospital Managemet']];
    const dateInfo = [
      [`From Date: ${formattedFromDate}`],
      [`To Date: ${formattedToDate}`]
    ];
    const allData = [...title, ...dateInfo, headers, ...exportData];
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OP Report');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'OP Report.xlsx');
  }
  formatDate(date: any): string {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0'); // Ensures two-digit day
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based, so add 1
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  formatDateToDDMMYYYY(date: any): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

}
