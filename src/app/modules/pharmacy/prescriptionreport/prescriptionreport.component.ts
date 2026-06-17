import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PharmaserviceService } from '../pharmaservice.service';

import { forkJoin, of } from 'rxjs';
import { catchError, map as rxMap } from 'rxjs/operators';

@Component({
  selector: 'app-prescriptionreport',
  templateUrl: './prescriptionreport.component.html',
  styleUrls: ['./prescriptionreport.component.scss']
})
export class PrescriptionreportComponent implements OnInit {

  medicine_data: any[] = [];

dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'i_ts', 'uh_id', 'name', 'phone_number',
    'view'];
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


  showSpinner: boolean = false

  doctor_search: FormGroup
  submitt: boolean = false
  constructor(public formBuilder: FormBuilder, public service: PharmaserviceService,
    public router: Router, public modalservice: NgbModal, public myservice: PharmaserviceService) {
    this.doctor_search = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
  }

  patients_data: any = [];

ngOnInit(): void {
  this.getPharmacyMedicineList();
  this.service.getDoctorVsitPtntList().subscribe((res: any) => {
    this.patients_data = res.data || [];
  });

  const today = this.formatDateForInput(new Date());

  this.doctor_search.patchValue({
    from_date: today,
    to_date: today
  });

  this.SearchDATE();
}

changepn(uh_id: any) {
  const data = { uh_id: uh_id };

  this.showSpinner = true;

  this.service.getAllHistoryOfPtnDctr(data).subscribe((res: any) => {
    this.showSpinner = false;

    const rows = res?.data || [];
    this.loadOnlyPrescriptionPatients(rows);
  });
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
  getDoctor() {
    this.service.getDoctordetails().subscribe((res) => {
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
  const data = {
    pharma_id: row.id
  };

  this.patient_details = row;
  this.medicalData = [];
  this.showSpinner = true;

  this.service.getmedicalFields(data).subscribe((res) => {
    this.showSpinner = false;

  this.medicalData = (res.data || []).map((item: any) => {
  const processed = this.processMedicineName(item);

  const stockMed = this.findMedicineFromStock(
    processed.medicine_name || processed.composition || ''
  );

  console.log('DOCTOR MEDICINE:', processed.medicine_name);
  console.log('MATCHED STOCK MED:', stockMed);

  return {
    ...processed,

    selected_medicine: stockMed || null,
    medicine_id: stockMed?.id || stockMed?.medicine_id || null,

    company_name: stockMed?.company_name || stockMed?.mfg || '-',
    hsncode: stockMed?.hsncode || stockMed?.hsn_code || '-',
    batch_no: '-',
    expirydate: '-',
    schedule_drugs: stockMed?.schedule_drugs || stockMed?.sch || processed.composition_name || '-',
    stock_qty: '-',
    bin_location: '-',
    eachcost: 0,
    gst_per: 0,

prescribed_qty: this.getAutoSaleQty(processed),
sale_qty: this.getAutoSaleQty(processed),
shortage_qty: 0,
stock_status: '',    pharmacy_remarks: processed.pharmacy_remarks || ''
  };
});

this.medicalData.forEach((item: any) => {
  if (item.selected_medicine && item.medicine_id) {
    this.selectedPharmacyMedicine(item.selected_medicine, item);
  } else {
    console.warn('NO MEDICINE ID FOUND:', item.medicine_name);
  }
});
    this.medicalData.forEach((item: any) => {
  if (item.selected_medicine && item.medicine_id) {
    this.selectedPharmacyMedicine(item.selected_medicine, item);
  } else {
    console.warn('NO MEDICINE ID FOUND:', item.medicine_name);
  }
});
  });

  this.modalservice.open(viewModal, {
    centered: true,
    size: 'xl',
    backdrop: 'static',
    windowClass: 'pharmacy-view-modal'
  });
}

findMedicineFromStock(medicineName: string): any {
  if (!medicineName) {
    return null;
  }

  const cleanName = String(medicineName)
    .replace(/"/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  return this.medicine_data.find((m: any) => {
    const name = String(
      m.medicine_name ||
      m.med_name ||
      m.item_name ||
      m.name ||
      ''
    )
      .replace(/"/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();

    return name === cleanName;
  });
}

getMedicineAmount(item: any): number {
  const qty = Number(item.sale_qty || 1);
  const rate = Number(item.eachcost || item.sale_price || item.rate || 0);
  return qty * rate;
}

selectedAlternativeMedicine(med: any, item: any) {
  this.selectedPharmacyMedicine(med, item);
  console.log('SELECTED MED:', med);
console.log('MEDICINE ID:', item.medicine_id);
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
  const validMedicines = this.medicalData.filter((m: any) =>
    m.medicine_name && Number(m.sale_qty || 0) > 0
  );

  if (!validMedicines.length) {
    Swal.fire('Warning', 'Please add at least one medicine', 'warning');
    return;
  }

  const billData = {
    patient: this.patient_details,
    medicines: validMedicines,
    bill_type: 'PRESCRIPTION_PHARMACY_BILL',
    payment_mode: 'CASH',
    invoice_date: new Date()
  };

  sessionStorage.setItem('prescription_pharmacy_bill', JSON.stringify(billData));

  this.modalservice.dismissAll();
  this.router.navigate(['/salesreportsPrint']);
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


    this.test_assign_date = table.date
    this.completed_date = table.completed_date
    this.data1 = {
      'uh_id': table.uh_id,
      'completed_date': table.completed_date,
      'id': table.id,
    }
    this.resultsLab = []
    this.showSpinner = true
    this.myservice.getLabResultsEach(this.data1).subscribe((res) => {
      this.showSpinner = false
      this.resultsLab = res.data;
    })
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
  formatDateForInput(d: Date): string {
const yyyy = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return `${yyyy}-${mm}-${dd}`;
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
SearchDATE() {
  this.submitt = true;

  if (this.doctor_search.invalid) {
    Swal.fire({
      title: 'please fill details',
      position: 'top-end',
      text: 'Fill Values',
      icon: 'question',
      timer: 1500
    });
    return;
  }

  this.showSpinner = true;

  this.service.getdoctorsrchdata(this.doctor_search.value).subscribe((res: any) => {
    this.showSpinner = false;

    const rows = res?.data || [];

    if (!rows.length) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'NO DATA FOUND' });
      this.dataSource = new MatTableDataSource([]);
      return;
    }

    this.loadOnlyPrescriptionPatients(rows);
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
  


  loadOnlyPrescriptionPatients(rows: any[]) {
  if (!rows || !rows.length) {
    this.masterdata = [];
    this.clonedata = [];
    this.dataSource = new MatTableDataSource([]);
    return;
  }

  const requests = rows.map((row: any) => {
    return this.service.getmedicalFields({ pharma_id: row.id }).pipe(
      rxMap((res: any) => {
        const medicines = res?.data || [];
        return medicines.length > 0 ? row : null;
      }),
      catchError(() => of(null))
    );
  });

  forkJoin(requests).subscribe((result: any[]) => {
    const filteredRows = result.filter((x: any) => x !== null);

    filteredRows.forEach((x: any, i: number) => {
      x.i = i + 1;
    });

    this.masterdata = filteredRows;
    this.clonedata = filteredRows;
    this.dataSource = new MatTableDataSource(filteredRows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
}

addMedicineRow() {
  this.medicalData.push({
    medicine_name: '',
    composition_name: '',
    compositionList: [],
    instruction: '',
    days: '',
    time_options: '',
    remarks: '',
    sale_qty: 1,
    pharmacy_remarks: '',
    isParsed: false,
    brands: [],
    is_pharmacy_added: true
  });
}

removeMedicine(index: number) {
  Swal.fire({
    title: 'Remove Medicine?',
    text: 'This medicine will be removed only from pharmacy sale list.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove'
  }).then((result) => {
    if (result.isConfirmed) {
      this.medicalData.splice(index, 1);
    }
  });
}

increaseQty(item: any) {
  const stock = Number(item.stock_qty || 0);
  const qty = Number(item.sale_qty || 0);

  if (stock > 0 && qty >= stock) {
    Swal.fire('Stock Limit', 'Available stock is only ' + stock, 'warning');
    return;
  }

  item.sale_qty = qty + 1;
}

decreaseQty(item: any) {
  const qty = Number(item.sale_qty || 1);

  if (qty > 1) {
    item.sale_qty = qty - 1;
  }
}


getPharmacyMedicineList() {
  this.service.getmedicinename().subscribe((res: any) => {
    console.log('MEDICINE API RESPONSE:', res);

    this.medicine_data =
      res?.data ||
      res?.result ||
      res?.medicine_data ||
      res ||
      [];

    console.log('MEDICINE LIST:', this.medicine_data);
  });
}

selectedPharmacyMedicine(med: any, item: any) {
  if (!med) return;

  item.selected_medicine = med;
  item.medicine_id = med.id || med.medicine_id;
  item.medicine_name = med.medicine_name || '';
  item.composition_name = med.company_name || med.composition_name || '';
  item.company_name = med.company_name || '-';
  item.hsncode = med.hsn_code || med.hsncode || '-';
  item.schedule_drugs = med.schedule_drugs || '-';

  item.stock_qty = '-';
  item.bin_location = '-';
  item.batch_no = '-';
  item.expirydate = '-';
  item.eachcost = 0;
  item.gst_per = 0;

  this.service.getAmedicineAllBatchNos({
    medicine_id: item.medicine_id
  }).subscribe((res: any) => {
    const batches = res?.data || [];

    if (!batches.length) return;

    const firstBatch = batches[0];

    this.service.getThatMedicineDataByBatchwise({
      medicine_id: item.medicine_id,
      batch_number: firstBatch.batch_no
    }).subscribe((res2: any) => {
      const d = res2?.data?.[0];
      if (!d) return;

      item.selected_medicine = d;
      item.batch_no = d.batch_no || '-';
      item.expirydate = d.expirydate || '-';
      item.eachcost = Number(d.eachcost || 0);
      item.gst_per = Number(d.gst_per || 0);
      item.stock_qty = d.available_quantity || d.total_tabs || '-';
      item.bin_location = d.bin_location || d.rack_no || d.rack_bin || '-';
      item.hsncode = d.hsncode || item.hsncode || '-';
this.applyStockLimit(item);    });
  });
}


instructionOptions: string[] = [
  'ONCE DAILY',
  'TWICE DAILY',
  'THRICE DAILY',
  'FOURTH HOURLY',
  'SIXTH HOURLY',
  'EIGHTH HOURLY',
  'TWELVTH HOURLY'
];

timingOptions: string[] = [
  'BEFORE BREAKFAST',
  'MORNING',
  'BEFORE LUNCH',
  'AFTERNOON',
  'BEFORE DINNER',
  'NIGHT',
  'MOR-NT',
  'MOR-AFT',
  'MOR-AFT-NT'
];

getAutoSaleQty(item: any): number {
  const days = Number(item.days || 1);
  const timings = String(item.time_options || '').toUpperCase();

  let timesPerDay = 1;

  if (timings.includes('MOR-AFT-NT')) timesPerDay = 3;
  else if (timings.includes('MOR-AFT') || timings.includes('MOR-NT')) timesPerDay = 2;
  else timesPerDay = 1;

  return days * timesPerDay;
}

validateSaleQty(item: any) {
  const stock = Number(item.stock_qty || 0);
  const qty = Number(item.sale_qty || 1);

  if (stock > 0 && qty > stock) {
    item.sale_qty = stock;
    Swal.fire('Stock Limit', 'Available stock is only ' + stock, 'warning');
  }

  if (qty < 1) {
    item.sale_qty = 1;
  }
}

applyStockLimit(item: any) {
  const stock = Number(item.stock_qty || 0);
  const prescribedQty = Number(item.prescribed_qty || item.sale_qty || 1);

  item.prescribed_qty = prescribedQty;

  if (stock > 0 && prescribedQty > stock) {
    item.sale_qty = stock;
    item.shortage_qty = prescribedQty - stock;
    item.stock_status = 'INSUFFICIENT';
  } else {
    item.sale_qty = prescribedQty;
    item.shortage_qty = 0;
    item.stock_status = 'AVAILABLE';
  }
}


submitPrescriptionSale() {
  const validMedicines = this.medicalData.filter((m: any) =>
    m.medicine_id &&
    m.batch_no &&
    Number(m.sale_qty || 0) > 0
  );

  if (!validMedicines.length) {
    Swal.fire('Warning', 'No valid medicines to submit', 'warning');
    return;
  }

  const medicinearr = validMedicines.map((m: any) => {
    const qty = Number(m.sale_qty || 0);
    const rate = Number(m.eachcost || 0);
    const gst = Number(m.gst_per || 0);

    const total = qty * rate;
    const gstAmount = total * gst / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
      hsncode: m.hsncode || '',
      composition_name: m.composition_name || '',
      medicine_name: m.medicine_name,
      schedule_drugs: m.schedule_drugs || '',
      company_name: m.company_name || '',
      medicine_id: m.medicine_id,
      batch_no: m.batch_no,
      expiry_date: m.expirydate,
      availability_tabs: m.stock_qty,
      mrp_rate_per_tab: rate,
      quantity: qty,
      total_amount: total,
      gst_percentage_each_drug: gst,
      cgst_on_medicine: cgst,
      sgst_on_medicine: sgst,
      gross_amount: total + gstAmount
    };
  });

  const grandTotal = medicinearr.reduce((sum, x) => sum + Number(x.total_amount || 0), 0);
  const gstTotal = medicinearr.reduce((sum, x) =>
    sum + Number(x.cgst_on_medicine || 0) + Number(x.sgst_on_medicine || 0), 0);

  const data = {
    patientdetail: {
      uh_id: this.patient_details?.uh_id || '',
      patient_type: '1',
      name: this.patient_details?.name || this.patient_details?.full_name || '',
      age: this.patient_details?.age || '',
      gender: this.patient_details?.gender || '',
      phonenumber: this.patient_details?.phone_number || this.patient_details?.mobile || '',
      payment_mode: 'CASH',
      p_members: '0',
      transcation_id: '',
      cash_amount: Math.round(grandTotal),
      upi_amount: '',
      date: this.formatDateForInput(new Date()),
      sale_without_discount_total: grandTotal,
      sale_gst_amount: gstTotal,
      sale_disc_percnt: 0,
      sale_grandtotal: Math.round(grandTotal),
      pymnt_mode_ind: '0',
      d_name: this.patient_details?.d_name || this.patient_details?.doctor_name || ''
    },
    medicinearr: medicinearr,
    user_id: localStorage.getItem('user_id') || localStorage.getItem('id'),
    usr_nm: localStorage.getItem('usr_nm') || localStorage.getItem('userName')
  };

  this.showSpinner = true;

  this.service.submitpatientmedicine(data).subscribe((res: any) => {
    this.showSpinner = false;

    if (res.status == 200) {
      Swal.fire('Success', 'Medicine sale submitted', 'success');

      sessionStorage.removeItem('salesReport');
      sessionStorage.setItem('salesReport', JSON.stringify(res.data[0]));

      this.modalservice.dismissAll();
      this.router.navigate(['/salesreportsPrint']);
    } else {
      Swal.fire('Failed', 'Sale submit failed', 'error');
    }
  });
}
}
