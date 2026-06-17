import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorserviceService } from '../doctorservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LabsServicesService } from '../../labsmdl/labs-services.service';
// import { threadId } from 'worker_threads';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD-MM-YYYY' },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
@Component({

  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
nextdisplayedColumns: string[] = ['i', 'i_ts', 'uh_id', 'name', 'phone_number', 'patient_file'];
  selectColumns: string[] = ['select1', 'select4', 'select2', 'select5'];
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
  private formatYMD(d: any): string {
    if (!d) return '';
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // backend SQL friendly
  }


  showSpinner: boolean = false

  doctor_search: FormGroup
  submitt: boolean = false
  constructor(public formBuilder: FormBuilder, public service: DoctorserviceService,
    public router: Router, public modalservice: NgbModal, public myservice: LabsServicesService) {
    this.doctor_search = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
  }

  patients_data: any = [];

  ngOnInit(): void {

    // this.getDoctors()
    this.service.getDoctorVsitPtntList().subscribe((res: any) => {
      this.patients_data = res.data;
    })
    const today = this.formatDateForInput(new Date()); // yyyy-MM-dd

    this.doctor_search.patchValue({
      from_date: today,
      to_date: today
    });

    // optional: auto load today's data without clicking search
    this.SearchDATE();
  }

  changepn(uh_id) {
    var data = {
      uh_id: uh_id
    }
    this.showSpinner = true
    this.service.getAllHistoryOfPtnDctr(data).subscribe((res) => {
      this.showSpinner = false
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  get validDate() {
    return this.doctor_search.controls
  }

  hideme: boolean[] = [];
  data: any = [];

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  doctorData: any = [];


  SearchDATEs() {
    this.service.getDoctordetails(this.doctor_search.value).subscribe((res) => {

      this.doctorData = res.data;
      for (let i = 0; i < this.doctorData.length; i++) {
        this.hideme.push(true);
      }
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;

      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  // view
  patient_details: any;

  medicalData: any = []
  Pharma(viewModal, row) {
    var data = {
      'pharma_id': row.id
    }
    this.patient_details = ''
    this.patient_details = row
    this.medicalData = []
    this.showSpinner = true
    this.service.getmedicalFields(data).subscribe((res) => {
      this.showSpinner = false


      this.medicalData = res.data.map(item => this.processMedicineName(item));
    });
    this.modalservice.open(viewModal, { centered: true, size: 'lg' })
  }

  processMedicineName(item: any): any {
    let parsedData;
    try {
      // Check if medicine_name is a string that needs parsing
      if (typeof item.medicine_name === 'string' && this.isJsonString(item.medicine_name)) {
        parsedData = JSON.parse(item.medicine_name);
        if (Array.isArray(parsedData) && parsedData.length === 2) {
          return {
            ...item,
            isParsed: true,
            composition: parsedData[0],
            brands: parsedData[1]
          };
        }
      }
      // If not JSON, treat as plain string
      return {
        ...item,
        isParsed: false,
        composition: item.medicine_name,
        brands: []
      };
    } catch (e) {

      return {
        ...item,
        isParsed: false,
        composition: item.medicine_name,
        brands: []
      };
    }
  }

  isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  printPrescription() {
    this.modalservice.dismissAll()
    this.router.navigate(['doc-medicine-print'])
    sessionStorage.setItem('doctor-medicines', JSON.stringify(this.patient_details))
  }

  getFormattedBrands(brands): string {
    return brands.join(' / ');
  }


  /////////////////////////////////////

  totallabamount: any
  Labdata: any = []
  lab(view, row, amount) {
    this.totallabamount = amount
    this.showButton = true
    this.content = "Tests Not Assgined"
    var data = {
      'lab_id': row.id
    }
    this.showSpinner = true
    this.service.getLabfields(data).subscribe((res) => {
      this.showSpinner = false
      this.Labdata = res.data
    })
    this.modalservice.open(view, { centered: true, size: 'lg' })
    this.dynmcView(row)
  }


  content: string = "Tests Not Assgined"
  showButton: boolean = true
  patientLabTestDts: any;

  dynmcView(row) {
    this.showSpinner = true
    this.service.checkWhetherLabTestassigned(row).subscribe((res) => {
      this.showSpinner = false
      this.patientLabTestDts = []
      if (res.data.length != 0) {

        this.patientLabTestDts = res.data
        this.showButton = false
        this.content = "View Results"
      }
    })
  }

  getLabRprtsViaDctr(showResults) {
    if (this.patientLabTestDts[0].test_status == 'true') {
      this.showLabResults(this.patientLabTestDts[0], showResults)
    }
    else {
      Swal.fire({
        title: 'Test Not Completed',
        position: 'top-end',
        text: 'Please update Test Results',
        icon: 'question',
        timer: 1500,
      })
    }
  }




  test_assign_date: any;
  completed_date: any;
  data1: any;
  resultsLab: any = [];



showLabResults(table, showResults) {
  this.test_assign_date = table.date;
  this.completed_date = table.completed_date;

  this.data1 = {
    uh_id: table.uh_id,
    completed_date: table.completed_date,
    id: table.labtest_patient_id
  };

  console.log('LAB RESULT PAYLOAD:', this.data1);

  this.resultsLab = [];
  this.showSpinner = true;

  this.myservice.getLabResultsEach(this.data1).subscribe((res) => {
    this.showSpinner = false;
    console.log('LAB RESULT RESPONSE:', res);
    this.resultsLab = res.data || [];
  });

  this.modalservice.open(showResults, { centered: true, size: 'lg' });
}



showSingleLabResult(table, showResults) {
  this.test_assign_date = table.date;
  this.completed_date = table.completed_date;

  this.data1 = {
    uh_id: table.uh_id,
    completed_date: table.completed_date,
    id: table.labtest_patient_id
  };

  this.resultsLab = [];
  this.showSpinner = true;

  this.myservice.getLabResultsEach(this.data1).subscribe((res) => {
    this.showSpinner = false;

    const allResults = res.data || [];

    this.resultsLab = allResults.filter(x =>
      x.labtest_id == table.labtest_id ||
      x.labtest_name == table.labtest_name
    );
  });

  this.modalservice.open(showResults, { centered: true, size: 'lg' });
}
  //////////////////////////////
  totalprice: any
  Diagnostic_data: any = []
  Diagnostic(Modal, row, price) {
    this.totalprice = price
    var data = {
      'diagnostic_id': row.id
    }
    this.showSpinner = true
    this.service.getDiagnostic(data).subscribe((res) => {
      this.showSpinner = false
      this.Diagnostic_data = res.data
    })
    this.modalservice.open(Modal, { centered: true, size: 'lg' })
  }


  gotodoctorlist() {
    this.router.navigate(['/doctor/doctor-prescription'])
  }

  // SearchDATE() {
  //   this.submitt = true
  //   if (this.doctor_search.invalid) {
  //     Swal.fire({
  //       title: 'please fill details',
  //       position: 'top-end',
  //       text: 'Fill Values',
  //       icon: 'question',
  //       timer: 1500,
  //     })
  //   }
  //   else {
  //     this.showSpinner = true
  //     this.service.getdoctorsrchdata(this.doctor_search.value).subscribe((res) => {
  //       this.showSpinner = false
  //       if (res.data.length == 0) {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'NO DATA FOUND'
  //         })
  //       }
  //       res.data.map((res, index) => {
  //         res.i = ++index;
  //       })
  //       this.masterdata = res.data;
  //       this.clonedata = this.masterdata;
  //       this.dataSource = new MatTableDataSource(res.data);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     })
  //   }
  // }

  formatDateForInput(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // SearchDATE() {
  //   this.submitt = true;
  //   this.doctor_search.markAllAsTouched();

  //   if (this.doctor_search.invalid) {
  //     Swal.fire({
  //       title: 'please fill details',
  //       position: 'top-end',
  //       text: 'Fill Values',
  //       icon: 'question',
  //       timer: 1500,
  //     });
  //     return;
  //   }

  //   const from = this.formatYMD(this.doctor_search.value.from_date);
  //   const to = this.formatYMD(this.doctor_search.value.to_date);

  //   // optional: validate range
  //   if (from > to) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Dates',
  //       text: 'From Date should be less than or equal to To Date',
  //     });
  //     return;
  //   }

  //   const payload = { from_date: from, to_date: to };

  //   this.showSpinner = true;
  //   this.service.getdoctorsrchdata(payload).subscribe((res) => {
  //     this.showSpinner = false;

  //     if (!res?.data || res.data.length === 0) {
  //       Swal.fire({ icon: 'error', title: 'Oops...', text: 'NO DATA FOUND' });
  //       this.dataSource = new MatTableDataSource([]);
  //       return;
  //     }

  //     res.data.map((r, index) => r.i = index + 1);
  //     this.masterdata = res.data;
  //     this.clonedata = this.masterdata;
  //     this.dataSource = new MatTableDataSource(res.data);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   }, _err => {
  //     this.showSpinner = false;
  //     Swal.fire({ icon: 'error', title: 'Server Error', text: 'Please try again' });
  //   });
  // }
  SearchDATE() {
    this.submitt = true;

    if (this.doctor_search.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      });
      return; // ✅ important
    }

    this.showSpinner = true;
    this.service.getdoctorsrchdata(this.doctor_search.value).subscribe((res) => {
      this.showSpinner = false;

      if (!res.data || res.data.length === 0) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'NO DATA FOUND' });
        this.dataSource = new MatTableDataSource([]);
        return;
      }

      res.data.forEach((x, i) => x.i = i + 1);

      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
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


  selectedPatient: any = null;
patientTimeline: any[] = [];
activeTab: string = 'prescription';

fileMedicines: any[] = [];
fileLabs: any[] = [];
fileDiagnostics: any[] = [];

openPatientFile(patientFileModal: any, row: any) {
  this.selectedPatient = row;
  this.activeTab = 'prescription';

  this.fileMedicines = [];
  this.fileLabs = [];
  this.fileDiagnostics = [];

  this.loadPrescriptionRelatedData(row);

  this.modalservice.open(patientFileModal, {
    centered: true,
    size: 'xl',
    windowClass: 'patient-file-modal'
  });
}

loadPrescriptionRelatedData(row: any) {
  const prescriptionId = row.id;

  this.showSpinner = true;

  this.service.getmedicalFields({ pharma_id: prescriptionId }).subscribe((res: any) => {
    this.fileMedicines = (res.data || []).map(item => this.processMedicineName(item));
  });

this.service.getPatientAssignedLabTests({
  uh_id: row.uh_id,
  number: row.phone_number,
  name: row.name
}).subscribe((res: any) => {
  console.log('LAB RESPONSE:', res);
  this.fileLabs = res.data || [];
});

  this.service.getDiagnostic({ diagnostic_id: prescriptionId }).subscribe((res: any) => {
    this.fileDiagnostics = res.data || [];
    this.showSpinner = false;
  });
}

setPatientTab(tab: string) {
  this.activeTab = tab;
}
}
