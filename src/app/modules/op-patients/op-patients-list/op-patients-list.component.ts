import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver';

import { OpServicesService } from '../op-services.service';



@Component({
  selector: 'app-op-patients-list',
  templateUrl: './op-patients-list.component.html',
  styleUrls: ['./op-patients-list.component.scss']
})
export class OpPatientsListComponent {

  
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

  restOfColumns: string[] = [];

  nextdisplayedColumns: string[] = ['i',  'patient_type', 'uh_id',
    'name', 'age', 'gender', 'phone_number', 'marital_status', 'address', 'doctor_name', 'card_type', 'card_appointment_type', 'consultant_fee',
    'payment_types', 'payment_way','expiry_date', 'after_discount_total', 'i_ts','print', 'date',];
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

  let fromDate = this.op_patientsSrch.value.from_date;
  let toDate = this.op_patientsSrch.value.to_date;

  if (!fromDate || !toDate) {
    const currentDate = new Date();
    fromDate = fromDate || currentDate;
    toDate = toDate || currentDate;
  }

  const formattedFromDate = this.formatDateToDDMMYYYY(fromDate);
  const formattedToDate = this.formatDateToDDMMYYYY(toDate);

  const headers = [
    'S.No',
    'Booking Date',
    'OP Patient ID',
    'Patient Type',
    'Patient Name',
    'Age',
    'Gender',
    'Mobile No',
    'Marital Status',
    'Doctor Name',
    'Card Type',
    'Appointment Type',
    'Consultant Fee',
    'Payment Type',
    'Payment Way',
    'Total After Discount',
    'Posted Date'
  ];

  const exportData = this.masterdata_main.map((row: any, index: number) => [
    index + 1,
    this.formatDate(row.date) || '-',
    row.uh_id || '-',
    row.patient_type || '-',
    row.name || '-',
    row.age ? `${row.age} ${row.yandm || ''}` : '-',
    row.gender || '-',
    row.phone_number || '-',
    row.marital_status || '-',
    row.doctor_name || '-',
    row.card_type || '-',
    row.card_appointment_type || '-',
    row.consultant_fee || 0,
    row.payment_types || '-',
    row.payment_way || 'FREE',
    row.after_discount_total || 0,
    row.i_ts ? this.formatDate(row.i_ts) : '-'
  ]);

  exportData.push([]);
  exportData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Cash Total', this.cash || 0]);
  exportData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'UPI Total', this.upi || 0]);
  exportData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Grand Total', this.grandTotal || 0]);

const allData = [
  ['SRIHITHA CHILDREN\'S HOSPITAL'],
  ['OP PATIENT REPORT'],
  [`From Date : ${formattedFromDate}`, '', '', '', `To Date : ${formattedToDate}`],
  [],
  headers,
  ...exportData
];
  const worksheet = XLSX.utils.aoa_to_sheet(allData);

worksheet['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }
];

worksheet['A1'].s = {
  font: {
    bold: true,
    sz: 18
  },
  alignment: {
    horizontal: 'center'
  }
};

worksheet['A2'].s = {
  font: {
    bold: true,
    sz: 14
  },
  alignment: {
    horizontal: 'center'
  }
};

  worksheet['!cols'] = [
    { wch: 8 },
    { wch: 14 },
    { wch: 18 },
    { wch: 14 },
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 24 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'OP Patient Report');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array'
  });

  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(excelBlob, `OP Patient Report ${formattedFromDate} to ${formattedToDate}.xlsx`);
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

  // downloadPdf(dataSource) {
  //   this.masterdata_main = dataSource._data._value;
  //   if (this.isDownloading) {
  //     return;
  //   }
  //   this.isDownloading = true;
  //   const pdf = new jsPDF();
  //   const headers = [
  //     'S.NO',
  //     'Booking Date',
  //     'Card Type',
  //     'Patient Name',
  //     'Address',
  //     'Payment Way',
  //     'Total After Discount',
  //   ];
  //   const exportData = this.masterdata_main.map((table: any) => [
  //     table.i,
  //     this.formatDate(table.date) || '-',
  //     table.card_appointment_type || '-',
  //     table.name || '-',
  //     table.address || '-',
  //     table.payment_way || 'FREE',
  //     table.after_discount_total + '/-' || '-',
  //   ]);

  //   exportData.push([
  //     '',
  //     '',
  //     '',
  //     '',
  //     '',
  //     'Total Cash', // Label for the total row
  //     this.cash + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);

  //   exportData.push([
  //     '',
  //     '',
  //     '',
  //     '',
  //     '',
  //     'Total UPI', // Label for the total row
  //     this.upi + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);

  //   exportData.push([
  //     '',
  //     '',
  //     '',
  //     '',
  //     '',
  //     'Total BOTH (Cash & UPI)', // Label for the total row
  //     this.both + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);

  //   exportData.push([
  //     '',
  //     '',
  //     '',
  //     '',
  //     '',
  //     'Total Amount', // Label for the total row
  //     this.grandTotal + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);

  //   // Get the current date if the dates are not selected
  //   let fromDate = this.op_patientsSrch.value.from_date;
  //   let toDate = this.op_patientsSrch.value.to_date;

  //   // If fromDate or toDate is not selected, set it to today's date
  //   if (!fromDate || !toDate) {
  //     const currentDate = new Date();
  //     fromDate = fromDate || currentDate;
  //     toDate = toDate || currentDate;
  //   }

  //   const formattedFromDate = this.formatDateToDDMMYYYY(fromDate);
  //   const formattedToDate = this.formatDateToDDMMYYYY(toDate);

  //   // Title (left aligned)
  //   pdf.setFontSize(16);
  //   pdf.setFont("helvetica", "bold");
  //   pdf.text("Dr. Chandanas La Skin 360", 14, 20); // Left align title at x=14

  //   // Dates (right aligned)
  //   pdf.setFontSize(12);
  //   pdf.setFont("helvetica", "normal");

  //   const pageWidth = pdf.internal.pageSize.width; // Get the page width
  //   const rightAlignX = pageWidth - 14; // Set right-aligned X position with a small margin

  //   pdf.text(`From Date: ${formattedFromDate}`, rightAlignX, 30, { align: "right" }); // Right align the From Date
  //   pdf.text(`To Date: ${formattedToDate}`, rightAlignX, 40, { align: "right" }); // Right align the To Date

  //   // Generate the table
  //   autoTable(pdf, {
  //     startY: 50, // Start Y position after the title and date section
  //     head: [headers],
  //     body: exportData,
  //     styles: {
  //       lineWidth: 0.5,
  //       lineColor: [0, 0, 0],
  //     },
  //     tableLineColor: [0, 0, 0],
  //     tableLineWidth: 0.5,
  //   });

  //   // Save the PDF
  //   pdf.save('OP Report.pdf');
  //   this.isDownloading = false;
  // }


}



