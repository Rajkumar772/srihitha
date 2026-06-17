import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PharmaserviceService } from '../pharmaservice.service';


import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';



@Component({
  selector: 'app-saleitems-reports',
  templateUrl: './saleitems-reports.component.html',
  styleUrls: ['./saleitems-reports.component.scss']
})
export class SaleitemsReportsComponent {

  data: any;
  grand_total: any;
  Sale_reports: FormGroup
  submitt: boolean = false


  showSpinner: boolean = false


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'sale_date', 'uh_id', 'patient_type', 'patient_name', 'patient_number',
    'payment_mode', 'sale_grandtotal', 'no_of_items', 'view', 'print', 'p_members', 'sale_bill_no'];
  selectColumns: string[] = ['select1', 'select2', 'select4'];
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

  mainBillform: FormGroup;

  medicineEditForm: FormGroup;

  otpForm: FormGroup;
  currentDate: any;

  patientCredentialsForm: any;

  isChecked = false;

  gettingUserId: any;

  constructor(
    public formBuilder: FormBuilder,
    private myservice: PharmaserviceService,
    public route: ActivatedRoute,
    private router: Router,
    public modalService: NgbModal, public datePipe: DatePipe,

  ) {


    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.Sale_reports = this.formBuilder.group({
      sale_date: [this.currentDate, [Validators.required]],
      to_date: [this.currentDate, [Validators.required]],
    })


    this.medicineEditForm = this.formBuilder.group({

      medicine_name: ["", [Validators.required]],
      medicine_id: ["", [Validators.required]],
      batch_no: ["", [Validators.required]],
      expiry_date: ["", [Validators.required]],
      availability_tabs: [""],
      mrp_rate_per_tab: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      total_amount: ["", [Validators.required]],
      gst_percentage_each_drug: ["", [Validators.required]],
      cgst_on_medicine: ["", [Validators.required]],
      sgst_on_medicine: ["", [Validators.required]],
      gross_amount: ["", [Validators.required]],
      indexValue: [],
      salepersonid: [],
      record_id: [],
      d_in: []
    });


    this.mainBillform = this.formBuilder.group({
      main_record_id: ['', [Validators.required]],
      sale_bill_no: ['', [Validators.required]],
      uh_id: ['', [Validators.required]],
      patient_type: ['', [Validators.required]],
      patient_name: ['', [Validators.required]],
      patient_number: ['', [Validators.required]],
      patient_age: ['', [Validators.required]],
      patient_gender: ['', [Validators.required]],
      payment_mode: ['', [Validators.required]],
      sale_date: ['', [Validators.required]],
      sale_without_discount_total: ['', [Validators.required]],
      sale_gst_amount: ['', [Validators.required]],
      sale_disc_percnt: ['', [Validators.required]],
      sale_grandtotal: ['', [Validators.required]],
      no_of_items: ['', [Validators.required]],
      initial_grandtotal: [],
      d_name: ['', [Validators.required]],
      return_amount: [],
      d_in: [],
      return_ind: [],

      bckup_disc_percnt: [''],
      bckup_cash_amount: [''],
      bckup_upi_amount: [''],
      bckup_sale_grandtotal: [''],
    })

    this.otpForm = this.formBuilder.group({
      number: ['9848822227', [Validators.required]],
      otp_number: ['', [Validators.required]]
    })

    this.patientCredentialsForm = this.formBuilder.group({
      record_id: ['', [Validators.required]],
      patient_type: ['1', [Validators.required]],
      uh_id: ['',],
      patient_name: ['', [Validators.required]],
      patient_number: ['', [Validators.required]],
      patient_age: ['',],
      patient_gender: ['',],
      payment_mode: ['', [Validators.required]],
      transcation_id: [''],
      cash_amount: [''],
      upi_amount: [''],
      initial_mode: [''],
      pymnt_mode_ind: [''],
      pymnt_mode_status: [''],
      pymnt_update_dt: [''],
      pymnt_update_only_dt: [''],
      bill_items_ind: [''],
      sale_date: [''],
      sale_bill_no: [''],
      sale_without_discount_total: [''],
      sale_gst_amount: [''],
      sale_disc_percnt: [''],
      sale_grandtotal: [''],
      sale_transcation_id: [''],
      sale_cash_amount: [''],
      sale_upi_amount: [''],
      no_of_items: [''],
      d_name: [''],

    })

    this.SearchDATE()
    this.patientsData();

    this.gettingUserId = localStorage.getItem('user_id');
  }

  changeFilters() {
    this.SearchDATE()
    this.gettingFullSaleBillDetails()
  }

  FullPatientsSalesBillDetails: any = [];
  gettingFullSaleBillDetails() {
    this.showSpinner = true
    this.myservice.FullSaleBillsDetails().subscribe((res) => {
      this.showSpinner = false
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.FullPatientsSalesBillDetails = res.data

      ///////////////// duplicates Remove (UH ID)
      this.NonDuplicateArray = Array.from(new Map(this.FullPatientsSalesBillDetails.map(item => [item.uh_id, item])).values());
    })
  }


  ///////////////////////////////// Range Picker Start

  from_date: any;
  to_date: any;

  rangePicker(totalBills, from_date, to_date) {
    return totalBills.filter(bill => {
      return bill.sale_date >= from_date && bill.sale_date <= to_date;
    });
  }

  functionToGetRange() {
    const from_date = document.getElementById('from_date') as HTMLInputElement;
    const to_date = document.getElementById('to_date') as HTMLInputElement;
    if (from_date.value && to_date.value) {
      const rangeBills = this.rangePicker(this.FullPatientsSalesBillDetails, from_date.value, to_date.value)
      this.dataSource = new MatTableDataSource(rangeBills);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      Swal.fire({
        position: 'top-end',
        title: 'Please select both dates.',
        icon: 'error',
        timer: 1500
      })
    }
  }

  ///////////////////////////////// Range Picker End

  //////////////////////////////// Bill No Start 

  BillNoFilter(totalBills, billNo) {
    return totalBills.filter(bill => {
      return bill.sale_bill_no == billNo;
    });
  }

  ParticularBillNo(e) {
    const BillNos = this.BillNoFilter(this.FullPatientsSalesBillDetails, e)
    this.dataSource = new MatTableDataSource(BillNos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //////////////////////////////// Bill No END 

  //////////////////////////////// UH ID No START  

  AllPatientBills(totalBills, uh_id) {
    return totalBills.filter(bill => {
      return bill.uh_id == uh_id;
    });
  }

  NonDuplicateArray: any = [];

  ParticularpatientSale(e) {

    const PatientUhids = this.AllPatientBills(this.FullPatientsSalesBillDetails, e)
    this.dataSource = new MatTableDataSource(PatientUhids);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //////////////////////////////// UH ID No END 

  //////////////////////////////// Mobile No Start  

  getMBnoDetails(e) {
    // Prevent space input
    if (e.key === ' ') {
      e.preventDefault();
      return;
    }
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();

    // Regex to check if input is valid (digits)
    const phoneOrUhIdRegex = /^\d*$/;
    // Only proceed if the input matches the regex
    if (phoneOrUhIdRegex.test(value)) {
      const MatchedNos = this.FullPatientsSalesBillDetails.filter(item =>
        item.patient_number.includes(value) // Change to includes for partial match
      );
      this.dataSource = new MatTableDataSource(MatchedNos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      // Optionally clear dataSource if input is invalid
      this.dataSource = new MatTableDataSource([]);
    }
  }


  //////////////////////////////// Mobile No END 

  ////////////////////////////////PYMNT  Mode No start 

  pymntmodeMatch(totalBills, no) {
    return totalBills.filter(bill => {
      return bill.payment_mode == no;
    });
  }


  payMode(e) {
    const pyMode = this.pymntmodeMatch(this.FullPatientsSalesBillDetails, e)
    this.dataSource = new MatTableDataSource(pyMode);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ////////////////////////////////PYMNT  Mode No end 

  get validDate() {
    return this.Sale_reports.controls
  }

  patients_data: any = [];
  patientsData() {
    this.showSpinner = true
    this.myservice.getpatientsOnlyphcy().subscribe((res: any) => {
      this.showSpinner = false
      this.patients_data = res.data;
    });
  }


  salesData: any = [];

  
  SearchDATE() {
  this.submitt = true;
  if (this.Sale_reports.invalid) {
    Swal.fire({
      position: 'top-end',
      title: 'please fill details',
      icon: 'error',
      timer: 1500
    });
  } else {
    this.showSpinner = true;
    this.myservice.getsalereports(this.Sale_reports.value).subscribe((res: any) => {
     
      this.showSpinner = false;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NO DATA FOUND'
        });
      }
      
      // Add index to each item
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });

      // Reset total before summing
      this.FullgrandTotal = 0;

      // Sum sale_grandtotal from all items safely
      res.data.forEach(item => {
        this.FullgrandTotal += parseFloat(item.sale_grandtotal) || 0;
      });

      this.salesData = res.data;
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // this.getTotalCost(this.masterdata); // if needed
    });
  }
}


  gotosale() {
    this.router.navigate(['/pharmacy/salesitems'])
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


  printSalesReports(row) {
    sessionStorage.setItem('salesReport', JSON.stringify(row))
    this.router.navigate(['salesreportsPrint']);
  }




  //////////// each box 

  medicinearr: any = [];


  salesPatientData: any;

  bill_return_ind: any;

  audit_disc_ind: any;

  getPatientEachsaledts(centerDataModal: any, row) {
    var data2 = {
      salepersonid: row.id,
    };

    this.showSpinner = true

    this.mainBillform = this.formBuilder.group({
      main_record_id: row.id,
      sale_bill_no: row.sale_bill_no,
      uh_id: row.uh_id,
      patient_type: row.patient_type,
      patient_name: row.patient_name,
      patient_number: row.patient_number,
      d_name: row.d_name,
      patient_age: row.patient_age,
      patient_gender: row.patient_gender,
      payment_mode: row.payment_mode,
      sale_date: row.sale_date,
      sale_without_discount_total: row.sale_without_discount_total,
      sale_gst_amount: row.sale_gst_amount,
      sale_disc_percnt: row.sale_disc_percnt,
      bckup_disc_percnt: row.bckup_disc_percnt,
      bckup_cash_amount: row.bckup_cash_amount,
      bckup_upi_amount: row.bckup_upi_amount,
      sale_grandtotal: row.sale_grandtotal,
      bckup_sale_grandtotal: row.bckup_sale_grandtotal,
      no_of_items: row.no_of_items,
      initial_grandtotal: Math.round(row.sale_grandtotal),
      return_amount: parseInt(row.sale_grandtotal) - parseInt(row.sale_grandtotal),
      return_ind: row.return_ind
    })

    this.bill_return_ind = row.return_ind

    this.audit_disc_ind = this.checkAuditDiscountEdit(row)

    this.medicinearr = []
    this.myservice.getparticularsalesdetials(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.salesPatientData = res.data;
      this.medicinearr = res.data;
    });

    this.modalService.open(centerDataModal, { centered: true, size: "xl" });
  }

  get isAuditDiscountApplicable(): boolean {
    return this.bill_return_ind == '0' && this.audit_disc_ind == true;
  }

  get isAlreadyModified(): boolean {
    return this.bill_return_ind == '1';
  }

  get isChangeDiscountVisible(): boolean {
    return this.bill_return_ind == '0' && this.audit_disc_ind == false && (this.gettingUserId == '18' || this.gettingUserId == '19');
  }

  checkAuditDiscountEdit(row) {
    if (parseInt(row.bckup_disc_percnt) === parseInt(row.sale_disc_percnt)) {
      return true
    }
    else {
      return false
    }
  }

  ReturnDone() {
    Swal.fire({
      position: 'top-end',
      text: 'Sorry Already Return Done',
      title: 'Unable to save',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false
    })
  }

  ///////////////////////////// CHANGE DISCOUNT PERCENT BACK TO ORIGINAL 

  suretoRechangeDiscount() {
    Swal.fire({
      title: "Change To Original Discount Percentage (%) ?",
      showDenyButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner = true
        this.myservice.BackToOrgnlDiscPercnt(this.mainBillform.value).subscribe((res) => {
          this.showSpinner = false
          Swal.fire("Bill Changed To Orginal Discount !");
          this.modalService.dismissAll()
          this.SearchDATE()
        })
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved !");
      }
    });
  }



  ///////////////////////////////////// END




  ///////////////////////// update row




  editFormTempo: any;


  updateArow(row, index, editFormTempo) {
    this.medicineEditForm.patchValue({
      medicine_name: row.medicine_name,
      medicine_id: row.medicine_id,
      batch_no: row.batch_no,
      expiry_date: row.expirydate,
      availability_tabs: row.total_tabs,
      mrp_rate_per_tab: row.eachcost,
      quantity: row.total_tabs,
      total_amount: row.sale_with_mrp_total,
      gst_percentage_each_drug: row.gst_per,
      cgst_on_medicine: row.sale_cgst_amount,
      sgst_on_medicine: row.sale_sgst_amount,
      gross_amount: row.sale_without_mrp_total,
      indexValue: index,
      salepersonid: row.salepersonid,
      record_id: row.id,
      d_in: row.d_in
    })
    this.editFormTempo = this.modalService.open(editFormTempo, { size: 'xl', centered: true })
  }


  stopEntering: boolean = false

  updatetherowandinsert() {

    if (this.stopEntering) {
      Swal.fire('Please update in Available Quantity Only')
      this.medicineEditForm.reset();
      this.closeSmallboxes(this.editFormTempo);
      this.stopEntering = false
    }
    else {
      this.medicinearr.splice(this.medicineEditForm.value.indexValue, 1);
      this.medicinearr.push({
        medicine_name: this.medicineEditForm.value.medicine_name,
        medicine_id: this.medicineEditForm.value.medicine_id,
        batch_no: this.medicineEditForm.value.batch_no,
        expirydate: this.medicineEditForm.value.expiry_date,
        eachcost: this.medicineEditForm.value.mrp_rate_per_tab,
        total_tabs: this.medicineEditForm.value.quantity,
        sale_with_mrp_total: this.medicineEditForm.value.total_amount,
        gst_per: this.medicineEditForm.value.gst_percentage_each_drug,
        sale_cgst_amount: this.medicineEditForm.value.cgst_on_medicine,
        sale_sgst_amount: this.medicineEditForm.value.sgst_on_medicine,
        sale_without_mrp_total: this.medicineEditForm.value.gross_amount,
        id: this.medicineEditForm.value.record_id,
        d_in: this.medicineEditForm.value.d_in,
        salepersonid: this.medicineEditForm.value.salepersonid
      });
      this.callthisFunctforSumming();
      this.medicineEditForm.reset();
      this.closeSmallboxes(this.editFormTempo);
    }

  }


  //////////////////////// eachclosebox
  closeSmallboxes(modal: any) {
    modal.dismiss();
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  calculateRintoQntyForUpdate(event) {
    this.stopEntering = false
    var each_tab_mrp_rate = this.medicineEditForm.value.mrp_rate_per_tab;
    var gstPercntg = this.medicineEditForm.value.gst_percentage_each_drug;
    var userINputQnty = event.target.value;
    if (!isNaN(userINputQnty) && !isNaN(each_tab_mrp_rate) && each_tab_mrp_rate !== 0 && each_tab_mrp_rate !== '') {
      var availabilityQuantity = parseInt(this.medicineEditForm.value.availability_tabs);
      if (userINputQnty > availabilityQuantity) {
        Swal.fire({
          position: "top-end",
          icon: "question",
          title: `Quantity cannot exceed the available quantity of tabs:  ${availabilityQuantity}`,
          showConfirmButton: false,
          timer: 1500,
        });
        this.stopEntering = true
        var total = 0;
        this.medicineEditForm.patchValue({
          total_amount: total,
        });
        this.splitFuncForGSTSUpdate(total, gstPercntg);
        return;
      }

      var total = each_tab_mrp_rate * 1 * (userINputQnty * 1);

      this.medicineEditForm.patchValue({
        total_amount: parseFloat(total.toFixed(2)),
      });

      this.splitFuncForGSTSUpdate(total, gstPercntg);
    }

  }


  splitFuncForGSTSUpdate(total, gstPercntg) {

    var calcualte = total * gstPercntg

    var fixedPercnt = 100
    var gstPLusFixed = fixedPercnt + gstPercntg

    var finalSplit = calcualte / gstPLusFixed

    var ForTwogsts = finalSplit / 2

    var forGrossAmount = total - parseFloat(finalSplit.toFixed(2))

    var num = ForTwogsts;
    var formattedNum = parseFloat(num.toFixed(2))

    this.medicineEditForm.patchValue({
      cgst_on_medicine: formattedNum,
      sgst_on_medicine: formattedNum,
      gross_amount: parseFloat(forGrossAmount.toFixed(2))
    });

  }

  delete(row) {
    var results = this.medicinearr.find((item) => item.id == row.id)
    if (results) {
      row.d_in = 1
    }
    this.callthisFunctforSumming();
  }

  grandtotal: any
  totalGSTAMNT: any;
  totalAmountAftrDscnt: any = 0;

  callthisFunctforSumming() {
    this.grandtotal = 0;
    this.totalGSTAMNT = 0
    this.totalAmountAftrDscnt = 0;
    let sum = 0;
    let sum1 = 0;
    var count = 0;
    this.medicinearr.forEach((element) => {
      if (element.d_in == 0) {
        var num = element.sale_with_mrp_total;
        var gstAmountEach = parseFloat(element.sale_cgst_amount)
        var bothGst = gstAmountEach * 2
        sum += parseFloat(num);
        sum1 += (bothGst);
        count++
      }
    });
    this.grandtotal = parseFloat(sum.toFixed(2));
    this.totalGSTAMNT = parseFloat(sum1.toFixed(2));

    this.totalAmountAftrDscnt = this.grandtotal - (this.grandtotal * this.mainBillform.value.sale_disc_percnt / 100)
    this.totalAmountAftrDscnt = Math.round(this.totalAmountAftrDscnt)

    this.functionTopatchValues(this.grandtotal, this.totalGSTAMNT, this.totalAmountAftrDscnt, count)
  }



  functionTopatchValues(a, b, c, d) {
    this.mainBillform.patchValue({
      sale_without_discount_total: a,
      sale_gst_amount: b,
      sale_grandtotal: c,
      no_of_items: d,
      return_amount: parseInt(this.mainBillform.value.initial_grandtotal) - c
    })


  }

  mainSubmit: boolean = false;
  get MainBillValid() {
    return this.mainBillform.controls
  }

  saveAndUpdate() {
    this.mainSubmit = true;
    this.mainBillform.value.d_in = 0;
    if (this.mainBillform.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'please fill Bill Details',
        icon: 'error',
        timer: 1500
      })
    }
    else {
      var count = 0;
      this.medicinearr.map((i) => {
        if (i.d_in !== 0) {
          count++
        }
      })
      if (this.medicinearr.length == count) {
        Swal.fire({
          title: "You have removed all the Medicine products",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Delete Bill"
        }).then((result) => {
          if (result.isConfirmed) {
            this.mainBillform.value.d_in = 1;
            this.GoupdateSaleBillpharma()
          }
          else {
            Swal.fire({
              position: 'top-end',
              title: 'Updation Cancelled',
              icon: 'error',
              timer: 1500
            })
            this.SearchDATE()
            this.isChecked = false
            this.mainSubmit = true
            this.medicinearr = []
            this.modalService.dismissAll()
            this.mainBillform.reset();
            this.medicineEditForm.reset();
            this.salesPatientData = []
          }
        });
      }
      else {
        this.GoupdateSaleBillpharma()
      }
    }

  }




  otpSubmit: boolean = false
  get otpValid() {
    return this.otpForm.controls;
  }






  otpTemplate: any;


  GoupdateSaleBillpharma() {

    var data = {
      'main_table_data': this.mainBillform.value,
      'items_table_data': this.medicinearr
    }
    this.showSpinner = true
    this.myservice.updateSaleBillpharma(data).subscribe((res) => {
      this.showSpinner = false
      if (res.status == 200) {
        Swal.fire({
          icon: 'success',
          position: 'top-end',
          title: 'Successfully Updated',
          timer: 1500,
          showConfirmButton: false
        })
        this.SearchDATE()
        this.isChecked = false
        this.mainSubmit = true
        this.medicinearr = []
        this.modalService.dismissAll()
        this.mainBillform.reset();
        this.medicineEditForm.reset();
        this.salesPatientData = []
      }
    })
  }


  PrintDayendpharma() {
    const dataToStore = {
      masterdata: this.masterdata,
      sale_date: this.Sale_reports.value.sale_date,
    };
    sessionStorage.setItem('pharmadayenddata', JSON.stringify(dataToStore));
    this.router.navigate(['pharmadayendprint']);
  }



  shouldHighlight(row) {
    return row.return_ind == '1'
  }



  FullgrandTotal: any = 0;

  otAmount: any = 0;



 


  dateBrkup: any

  brkupCash: any = 0;
  brkupUpi: any = 0;
  brkupCredit: any = 0;
  brkupBothCash: any = 0;
  brkupBothUpi: any = 0;
  brkupSaleReturn: any = 0;
  brkupOtreturns: any = 0;

  brkupNetBanking: any = 0;

  functionForBrkUp(mainData, currentDate) {
    this.dateBrkup = currentDate
    this.brkupCash = 0;
    this.brkupUpi = 0;
    this.brkupCredit = 0;
    this.brkupBothCash = 0;
    this.brkupBothUpi = 0;
    this.brkupSaleReturn = 0;
    this.brkupOtreturns = 0;
    this.brkupNetBanking = 0;

    mainData?.map((res) => {
      const saleDate = res.sale_date;
      if (saleDate === currentDate) {
        if (res.payment_mode === 'CASH') {
          this.brkupCash += parseFloat(res.sale_grandtotal)
        }
        if (res.payment_mode === 'UPI') {
          this.brkupUpi += parseFloat(res.sale_grandtotal)
        }
        if (res.payment_mode === 'E - CARD') {
          this.brkupNetBanking += parseFloat(res.sale_grandtotal)
        }
        if (res.payment_mode === 'BOTH') {
          this.brkupBothCash += parseFloat(res.sale_cash_amount)
          this.brkupBothUpi += parseFloat(res.sale_upi_amount)
        }
        if (res.payment_mode === 'CREDIT') {
          this.brkupCredit += parseFloat(res.sale_grandtotal)
        }
      }
      else if (saleDate !== currentDate) {
        if (res.payment_mode === 'CREDIT') {
          this.brkupSaleReturn += 0
        }
        else {
          this.brkupSaleReturn += parseFloat(res.return_amount)
        }
      }
    })
  }


  ptntSubmit: boolean = false

  get ptntValid() {
    return this.patientCredentialsForm.controls;
  }



  newORoldOne: boolean = false;


  timeslot(event: any) {
    var as = event.target.value
    if (as == '1') {
      this.newORoldOne = true
    }
    else if (as == '3') {
      this.newORoldOne = false
    }
  }


  modifyPtntdts(patientCredentialsTempo, row) {
    if (row.patient_type == '1') {
      this.newORoldOne = true
    }
    else if (row.patient_type == '3') {
      this.newORoldOne = false
    }
    if (row.payment_mode == 'CASH' || row.payment_mode == 'CREDIT') {
      this.paymentload = false
      this.showTwoAmounts = false
    }
    else if (row.payment_mode == 'UPI') {
      this.paymentload = true
      this.showTwoAmounts = false
    }
    else if (row.payment_mode == 'BOTH') {
      this.showTwoAmounts = true
      this.paymentload = true
    }

    this.patientCredentialsForm.patchValue({
      record_id: row.id,
      patient_type: row.patient_type,
      uh_id: row.uh_id,
      patient_name: row.patient_name,
      patient_number: row.patient_number,
      patient_age: row.patient_age,
      d_name: row.d_name,
      patient_gender: row.patient_gender,
      payment_mode: row.payment_mode,
      transcation_id: row.sale_transcation_id,
      cash_amount: row.sale_cash_amount,
      upi_amount: row.sale_upi_amount,
      initial_mode: row.payment_mode,
      pymnt_mode_ind: row.pymnt_mode_ind,
      pymnt_mode_status: row.pymnt_mode_status,
      pymnt_update_dt: row.pymnt_update_dt,
      bill_items_ind: row.id,
      sale_date: row.cts,
      sale_bill_no: row.sale_bill_no,
      sale_without_discount_total: row.sale_without_discount_total,
      sale_gst_amount: row.sale_gst_amount,
      sale_disc_percnt: row.sale_disc_percnt,
      sale_grandtotal: Math.round(row.sale_grandtotal),
      sale_transcation_id: row.sale_transcation_id,

      sale_cash_amount: row.sale_cash_amount,
      sale_upi_amount: row.sale_upi_amount,

      no_of_items: row.no_of_items
    })
    this.modalService.open(patientCredentialsTempo, { centered: true, size: "lg" });
  }


  changepn(uh_id) {
    var result = this.patients_data.find((o) => o.uh_id === uh_id);
    this.patientCredentialsForm.patchValue({
      patient_name: result.result.name,
      patient_age: result.age,
      patient_gender: result.gender,
      patient_number: result.phone_number,
    });
  }


  dis() {
    this.modalService.dismissAll()
  }

  updatePatientdts() {
    if (this.patientCredentialsForm.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'please fill Details',
        icon: 'error',
        timer: 1500
      })
    }
    else {
      const upiAmount = parseFloat(this.patientCredentialsForm.value.upi_amount);
      const cashAmount = parseFloat(this.patientCredentialsForm.value.cash_amount);
      const GrandTotal = parseFloat(this.patientCredentialsForm.value.sale_grandtotal);

      const transactionId = this.patientCredentialsForm.value.transcation_id;


      if (this.patientCredentialsForm.value.payment_mode == 'BOTH') {
        if (!upiAmount || !cashAmount || !transactionId) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Both Cash/Upi Amounts and Transcation Id",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else if (upiAmount + cashAmount < (GrandTotal - 5) || upiAmount + cashAmount > (GrandTotal + 5)) {
          Swal.fire({
            title: "Input Error",
            html: `
                  <div style="text-align: left;">
                      <p>The amount must be within <strong>5 Rps</strong> of the grand total.</p>
                      <p>Please pay at least <strong>${GrandTotal - 5} Rps</strong> or up to <strong>${GrandTotal + 5} Rps</strong> 
                      for the Grandtotal <strong>${GrandTotal} Rps</strong>.</p>
                  </div>`,
            icon: "warning"
          });
        }
        else {
          this.submitTheSale()
        }
      }
      else if (this.patientCredentialsForm.value.payment_mode == 'UPI' || this.patientCredentialsForm.value.payment_mode == 'E - CARD') {
        if (!transactionId) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Transcation Id",
            showConfirmButton: false,
            timer: 1500,
          });
        }
        else {
          this.patientCredentialsForm.value.cash_amount = ''
          this.patientCredentialsForm.value.upi_amount = ''
          this.submitTheSale()
        }
      }
      else if (this.patientCredentialsForm.value.payment_mode == 'CASH' || this.patientCredentialsForm.value.payment_mode == 'CREDIT') {
        this.patientCredentialsForm.value.transcation_id = ""
        this.patientCredentialsForm.value.cash_amount = ""
        this.patientCredentialsForm.value.upi_amount = ""
        this.submitTheSale()
      }
    }
  }


  submitTheSale() {
    if (this.patientCredentialsForm.value.patient_type == '3') {
      this.patientCredentialsForm.value.uh_id = ''
    }
    this.ptntSubmit = true
    this.showSpinner = true
    if (this.patientCredentialsForm.value.initial_mode == 'CREDIT' && this.patientCredentialsForm.value.pymnt_mode_ind == '1'
      && this.patientCredentialsForm.value.payment_mode != 'CREDIT') {

      var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
      var onlyDate = moment().utcOffset("+05:30").format("YYYY-MM-DD");

      this.patientCredentialsForm.get('pymnt_update_dt').setValue(date);
      this.patientCredentialsForm.get('pymnt_update_only_dt').setValue(onlyDate);

      if (this.patientCredentialsForm.value.payment_mode == 'CASH') {
        this.patientCredentialsForm.get('pymnt_mode_status').setValue('1');
      }
      else if (this.patientCredentialsForm.value.payment_mode == 'UPI' || this.patientCredentialsForm.value.payment_mode == 'E - CARD') {
        this.patientCredentialsForm.get('pymnt_mode_status').setValue('2');
      }
      else if (this.patientCredentialsForm.value.payment_mode == 'BOTH') {
        this.patientCredentialsForm.get('pymnt_mode_status').setValue('3');
      }
    }
    else {
      if (this.patientCredentialsForm.value.pymnt_mode_ind == '1' &&
        (this.patientCredentialsForm.value.initial_mode != this.patientCredentialsForm.value.payment_mode)) {

        var date = moment().utcOffset("+05:30").format("YYYY-MM-DD HH:mm:ss");
        this.patientCredentialsForm.get('pymnt_update_dt').setValue(date);

        if (this.patientCredentialsForm.value.payment_mode == 'CASH') {
          this.patientCredentialsForm.get('pymnt_mode_status').setValue('1');
        }
        else if (this.patientCredentialsForm.value.payment_mode == 'UPI' || this.patientCredentialsForm.value.payment_mode == 'E - CARD') {
          this.patientCredentialsForm.get('pymnt_mode_status').setValue('2');
        }
        else if (this.patientCredentialsForm.value.payment_mode == 'BOTH') {
          this.patientCredentialsForm.get('pymnt_mode_status').setValue('3');
        }
        this.patientCredentialsForm.get('pymnt_update_dt').setValue(this.patientCredentialsForm.value.pymnt_update_dt);
      }
      else if (this.patientCredentialsForm.value.pymnt_mode_ind == '1' &&
        (this.patientCredentialsForm.value.initial_mode == this.patientCredentialsForm.value.payment_mode)) {

        this.patientCredentialsForm.get('pymnt_mode_status').setValue(this.patientCredentialsForm.value.pymnt_mode_status);
        this.patientCredentialsForm.get('pymnt_update_dt').setValue(this.patientCredentialsForm.value.pymnt_update_dt);
      }
      else {
        this.patientCredentialsForm.get('pymnt_update_dt').setValue('');
        this.patientCredentialsForm.get('pymnt_update_only_dt').setValue('');
        this.patientCredentialsForm.get('pymnt_mode_status').setValue('0');
      }
    }
    this.myservice.submitPtntdstsalebill(this.patientCredentialsForm.value).subscribe((res) => {
      this.ptntSubmit = false
      this.showSpinner = false
      if (res.status == 200) {
        Swal.fire({
          position: 'top-end',
          title: 'Updated',
          icon: 'success',
          timer: 1500
        })
        this.patientCredentialsForm.reset()
        this.modalService.dismissAll()
        this.SearchDATE()
        this.isChecked = false
      }
    })
  }

  paymentload: boolean = false;

  showTwoAmounts: boolean = false;

  paymentslot(event: any) {
    var as = event
    if (as == 'UPI' || as == 'E - CARD') {
      this.paymentload = true
      this.showTwoAmounts = false
    } else if (as == 'CASH' || as == 'CREDIT') {
      this.paymentload = false
      this.showTwoAmounts = false
    }
    else if (as == 'BOTH') {
      this.showTwoAmounts = true
      this.paymentload = true
    }

  }

  deletedItems: any = [];

  deleteItemsbill(deleteitemTempo, row) {

    var data2 = {
      salepersonid: row.id,
    };

    this.showSpinner = true
    this.deletedItems = []
    this.myservice.getparticularsalesdetials(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.deletedItems = res.data
    });

    this.modalService.open(deleteitemTempo, { centered: true, size: "xl" });
  }

  viewBrkup(viewOpenBrkup) {
    this.modalService.open(viewOpenBrkup, { size: 'm', centered: true })
  }


  disBrkup() {
    this.modalService.dismissAll()
  }

}
