import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableUtil } from 'src/app/tableUtil';
import { GstreportssesrviceService } from '../gstreportssesrvice.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-gst-reports',
  templateUrl: './gst-reports.component.html',
  styleUrls: ['./gst-reports.component.scss']
})
export class GstReportsComponent implements OnInit {

  showSpinner: boolean = false
  OpIpLabSrchForm: FormGroup;
  PharmacySrchForm: FormGroup;
  dateSearchForAuditTwo: FormGroup;
  HSNSrchForm: FormGroup;
  editForm: FormGroup;
  editIndividualForm: FormGroup;
  editHSNForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private service: GstreportssesrviceService, public modalService: NgbModal, private datePipe: DatePipe) {

    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.OpIpLabSrchForm = this.formBuilder.group({
      from_date: [this.datePipe.transform(firstDay, 'yyyy-MM-dd'), [Validators.required]],
      to_date: [this.datePipe.transform(lastDay, 'yyyy-MM-dd'), [Validators.required]],
    })

    this.PharmacySrchForm = this.formBuilder.group({
      fromdate: [this.datePipe.transform(firstDay, 'yyyy-MM-dd'), [Validators.required]],
      todate: [this.datePipe.transform(lastDay, 'yyyy-MM-dd'), [Validators.required]],
    })

    this.HSNSrchForm = this.formBuilder.group({
      from_date: [this.datePipe.transform(firstDay, 'yyyy-MM-dd'), [Validators.required]],
      to_date: [this.datePipe.transform(lastDay, 'yyyy-MM-dd'), [Validators.required]],
    })

    this.editForm = this.formBuilder.group({
      gst_sales: ["", [Validators.required]],
    })

    this.editIndividualForm = this.formBuilder.group({
      individual_gst_report: ["", [Validators.required]],
    })

    this.editHSNForm = this.formBuilder.group({
      hsn_gst_value: ["", [Validators.required]],
    })

    const currentDateTwo = new Date();
    const firstDayTwo = new Date(currentDateTwo.getFullYear(), currentDateTwo.getMonth(), 1);
    const lastDayTwo = new Date(currentDateTwo.getFullYear(), currentDateTwo.getMonth() + 1, 0);

    this.dateSearchForAuditTwo = this.formBuilder.group({
      from_date: [this.datePipe.transform(firstDayTwo, 'yyyy-MM-dd'), [Validators.required]],
      to_date: [this.datePipe.transform(lastDayTwo, 'yyyy-MM-dd'), [Validators.required]]
    })

  }

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

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


  dataSourceTwo: MatTableDataSource<any>;     // Datasource For Mable to assign array

  @ViewChild('paginatorTwo') paginatorTwo: MatPaginator;      // Mat Table Pagination selector
  @ViewChild('sortTwo') sortTwo: MatSort; // Mat Table Sorting selector

  restOfColumns: string[] = ['total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent'];

  nextdisplayedColumnsTwo: string[] = ['i', 'sale_and_purchase_date', 'total_bills_generated', 'total_5_percent', 'total_8_percent',
    'total_12_percent', 'total_18_percent', 'total_28_percent', 'tax_5_percent',
    'tax_8_percent', 'tax_12_percent', 'tax_18_percent', 'tax_28_percent', 'net_total'];

  ///////////////////////////////////////////////

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


  dataSourceThree: MatTableDataSource<any>;
  @ViewChild('paginatorThree') paginatorThree: MatPaginator;
  @ViewChild('sortThree') sortThree: MatSort;
  nextdisplayedColumns: string[] = ['i', 'hsncode', 'gst_per', 'total_units_sold', 'total_gross', 'tax_percent', 'cgst_amount',
    'sgst_amount', 'total_sum'];


  ///////////

  dataSourceFour: MatTableDataSource<any>;
  // @ViewChild('paginatorFour') paginatorFour: MatPaginator;
  // @ViewChild('sortFour') sortFour: MatSort;

  restOfColumnsFour: string[] = ['HsnGst5perGross',
    'HsnGst8perGross', 'HsnGst12perGross', 'HsnGst18perGross', 'HsnGst28perGross', 'HsnGst5perTax',
    'HsnGst8perTax', 'HsnGst12perTax', 'HsnGst18perTax', 'HsnGst28perTax'];

  nextdisplayedColumnsFour: string[] = ['i', 'totalHSNCodeCount', 'HsnGst5perGross',
    'HsnGst8perGross', 'HsnGst12perGross', 'HsnGst18perGross', 'HsnGst28perGross', 'HsnGst5perTax',
    'HsnGst8perTax', 'HsnGst12perTax', 'HsnGst18perTax', 'HsnGst28perTax', 'TotalHsnGrossPlusTaxSum'];


  user_id: any;

  ngOnInit(): void {
    this.PharmacySearchDATE();
    this.OpIpLabSearchDATE();
    this.mergeOpIpSumData();
    this.mergeOpIpLabSumData();
    this.gotSaleAuditReportTwo();
    this.HSNSearchDATE();
    this.user_id = localStorage.getItem('user_id');
  }

  submitt: boolean = false;
  get valid() {
    return this.OpIpLabSrchForm.controls;
  }

  Op_Gst_data: any = [];
  Ip_Gst_data: any = [];
  Lab_Gst_data: any = [];
  combined_sum: any = [];
  combined_sum_op_ip_lab: any = [];
  dateRangeDisplay: any

  OpIpLabSearchDATE() {
    this.submitt = true;
    if (this.OpIpLabSrchForm.invalid) {
      Swal.fire({
        title: 'Please fill details',
        position: 'top-end',
        text: 'Fill values',
        icon: 'question',
        timer: 1500,
      });
      return;
    }
    this.showSpinner = true;
    const handleResponse = (res: any, dataType: string) => {
      this.showSpinner = false;
      this.submitt = false;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No data found',
        });
      } else {
        res.data.map((item, index) => {
          item.i = ++index;
        });

        if (dataType === 'OP GST') {
          this.Op_Gst_data = res.data;
        } else if (dataType === 'IP GST') {
          this.Ip_Gst_data = res.data;
        } else if (dataType === 'LAB GST') {
          this.Lab_Gst_data = res.data;
        }
      }
      this.mergeOpIpSumData();
      this.mergeOpIpLabSumData();

    };

    const fromDate = this.OpIpLabSrchForm.value.from_date;
    const toDate = this.OpIpLabSrchForm.value.to_date;

    const formattedFromDate = this.datePipe.transform(fromDate, 'MMMM dd-MM-yyyy');
    const formattedToDate = this.datePipe.transform(toDate, 'MMMM dd-MM-yyyy');

    this.dateRangeDisplay = `OP / IP / LAB GST Reports From ${formattedFromDate} to ${formattedToDate}`;

    this.service.getOpGstSrchdata(this.OpIpLabSrchForm.value).subscribe(
      (res) => handleResponse(res, 'OP GST')
    );

    this.service.getIPGstSrchdata(this.OpIpLabSrchForm.value).subscribe(
      (res) => handleResponse(res, 'IP GST')
    );

    this.service.getLabGstSrchdata(this.OpIpLabSrchForm.value).subscribe(
      (res) => handleResponse(res, 'LAB GST')
    );
  }

  mergeOpIpSumData() {
    this.combined_sum = {
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
      total_month_sum_zeros: 0,
      total_month_sum: 0,
      total_combined_sum: 0
    };
    const safeNumber = (value: any): number => {
      const num = Number(value);
      if (isNaN(num)) {
        return 0;
      }
      return num;
    };

    this.Op_Gst_data.forEach(item => {
      this.combined_sum.total_5_percent += safeNumber(item.total_5_percent);
      this.combined_sum.total_8_percent += safeNumber(item.total_8_percent);
      this.combined_sum.total_12_percent += safeNumber(item.total_12_percent);
      this.combined_sum.total_18_percent += safeNumber(item.total_18_percent);
      this.combined_sum.total_28_percent += safeNumber(item.total_28_percent);
      this.combined_sum.tax_5_percent += safeNumber(item.tax_5_percent);
      this.combined_sum.tax_8_percent += safeNumber(item.tax_8_percent);
      this.combined_sum.tax_12_percent += safeNumber(item.tax_12_percent);
      this.combined_sum.tax_18_percent += safeNumber(item.tax_18_percent);
      this.combined_sum.tax_28_percent += safeNumber(item.tax_28_percent);
      this.combined_sum.net_total += safeNumber(item.net_total);
      this.combined_sum.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
      this.combined_sum.total_month_sum += safeNumber(item.total_month_sum);
    });

    this.Ip_Gst_data.forEach(item => {
      this.combined_sum.total_5_percent += safeNumber(item.total_5_percent);
      this.combined_sum.total_8_percent += safeNumber(item.total_8_percent);
      this.combined_sum.total_12_percent += safeNumber(item.total_12_percent);
      this.combined_sum.total_18_percent += safeNumber(item.total_18_percent);
      this.combined_sum.total_28_percent += safeNumber(item.total_28_percent);
      this.combined_sum.tax_5_percent += safeNumber(item.tax_5_percent);
      this.combined_sum.tax_8_percent += safeNumber(item.tax_8_percent);
      this.combined_sum.tax_12_percent += safeNumber(item.tax_12_percent);
      this.combined_sum.tax_18_percent += safeNumber(item.tax_18_percent);
      this.combined_sum.tax_28_percent += safeNumber(item.tax_28_percent);
      this.combined_sum.net_total += safeNumber(item.net_total);
      this.combined_sum.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
      this.combined_sum.total_month_sum += safeNumber(item.total_month_sum);
    });

    this.combined_sum.total_sum_both = this.combined_sum.total_5_percent +
      this.combined_sum.total_8_percent +
      this.combined_sum.total_12_percent +
      this.combined_sum.total_18_percent +
      this.combined_sum.total_28_percent;

    this.combined_sum.total_tax_sum = this.combined_sum.tax_5_percent +
      this.combined_sum.tax_8_percent +
      this.combined_sum.tax_12_percent +
      this.combined_sum.tax_18_percent +
      this.combined_sum.tax_28_percent;

    this.combined_sum.total_combined_sum = this.combined_sum.total_5_percent +
      this.combined_sum.total_8_percent +
      this.combined_sum.total_12_percent +
      this.combined_sum.total_18_percent +
      this.combined_sum.total_28_percent +
      this.combined_sum.tax_5_percent +
      this.combined_sum.tax_8_percent +
      this.combined_sum.tax_12_percent +
      this.combined_sum.tax_18_percent +
      this.combined_sum.tax_28_percent;
  }

  mergeOpIpLabSumData() {
    this.combined_sum_op_ip_lab = {
      total_month_sum_zeros: 0,
      after_discount_total: 0,// For final combined sum
    };

    const safeNumber = (value: any): number => {
      const num = Number(value);
      if (isNaN(num)) {
        return 0;
      }
      return num;
    };

    this.Op_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
    });

    this.Ip_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
    });

    this.Lab_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.after_discount_total += safeNumber(item.after_discount_total);
    });

    this.combined_sum_op_ip_lab.total_combined_sum_op_ip_lab = this.combined_sum_op_ip_lab.total_month_sum_zeros + this.combined_sum_op_ip_lab.after_discount_total;

  }

  submitted: boolean = false;
  get validDate() {
    return this.PharmacySrchForm.controls;
  }

  gstPurchaseData: any = [];
  igstPurchaseData: any = [];
  gstSalesData: any = [];
  dateRangeDisplay2: any

  PharmacySearchDATE() {
    this.submitted = true;
    if (this.PharmacySrchForm.invalid) {
      Swal.fire({
        title: 'Please fill details',
        position: 'top-end',
        text: 'Fill values',
        icon: 'question',
        timer: 1500,
      });
      return;
    }
    this.showSpinner = true;
    const handleResponse = (res: any, dataType: string) => {
      this.showSpinner = false;
      this.submitted = false;
      if (res.data.length == 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No data found',
        });
      } else {
        res.data.map((item, index) => {
          item.i = ++index;
        });
        if (dataType === 'GST Purchase') {
          this.gstPurchaseData = res.data;
        } else if (dataType === 'IGST Purchase') {
          this.igstPurchaseData = res.data;
        } else if (dataType === 'GST Sales') {
          this.gstSalesData = res.data;
        }
      }
    };

    const fromDate = this.PharmacySrchForm.value.fromdate;
    const toDate = this.PharmacySrchForm.value.todate;

    const formattedFromDate = this.datePipe.transform(fromDate, 'MMMM dd-MM-yyyy');
    const formattedToDate = this.datePipe.transform(toDate, 'MMMM dd-MM-yyyy');

    this.dateRangeDisplay2 = `GST Reports From ${formattedFromDate} to ${formattedToDate}`;

    this.service.getGstPurchaseSrchdata(this.PharmacySrchForm.value).subscribe(
      (res) => handleResponse(res, 'GST Purchase')
    );

    this.service.getIGstPurchaseSrchdata(this.PharmacySrchForm.value).subscribe(
      (res) => handleResponse(res, 'IGST Purchase')
    );

    this.service.getGstSalesSrchdata(this.PharmacySrchForm.value).subscribe(
      (res) => handleResponse(res, 'GST Sales')
    );

  }

  printgstreports() {
    sessionStorage.setItem('gst-reports-print', JSON.stringify(this.gstPurchaseData))
    sessionStorage.setItem('igst-reports-print', JSON.stringify(this.igstPurchaseData))
    sessionStorage.setItem('gst-sales-print', JSON.stringify(this.gstSalesData))
    sessionStorage.setItem('gst-sales-date', JSON.stringify(this.dateRangeDisplay2))
    this.router.navigate(['/gst-reports-print'])
  }

  printOpIpLabgstreports() {
    sessionStorage.setItem('op-gst-reports-print', JSON.stringify(this.Op_Gst_data))
    sessionStorage.setItem('ip-gst-reports-print', JSON.stringify(this.Ip_Gst_data))
    sessionStorage.setItem('lab-sales-print', JSON.stringify(this.Lab_Gst_data))
    sessionStorage.setItem('gst-op-ip-lab-date', JSON.stringify(this.dateRangeDisplay))
    this.router.navigate(['/op-ip-lab-gst-reports-print'])
  }

  submit: boolean = false;
  get validd() {
    return this.editForm.controls;
  }

  openmodel: any;

  editgstvalue(openmodel) {
    this.openmodel = this.modalService.open(openmodel, { centered: true, size: 's', backdrop: 'static' });
  }

  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }

  reduction: any;

  editgstsales() {
    this.submit = true
    if (this.editForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Fill Details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.showSpinner = true
      var data = {
        discount_per: parseInt(this.editForm.value.gst_sales),
        fromdate: this.PharmacySrchForm.value.fromdate,
        todate: this.PharmacySrchForm.value.todate
      }
      this.service.updateGstsales(data).subscribe((res) => {

        this.showSpinner = false
        this.gstSalesData = [];
        this.reduction = this.editForm.value.gst_sales
        if (res.status == 200) {
          this.gstSalesData = res.data;
          Swal.fire({
            position: "top-end",
            icon: "success",

            title: "Successfully Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submit = false;
          this.modalService.dismissAll()
          this.editForm.reset();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
    }
  }

  //////////////////////

  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }

  exportTable1(id, totalHSNCodeCount) {
    TableUtil.exportTableToExcel(id, totalHSNCodeCount);
  }

  submittedd: boolean = false

  get validdd() {
    return this.dateSearchForAuditTwo.controls
  }

  AuditDataTwo: any = [];
  grandTotalTwo: number = 0
  gotSaleAuditReportTwo() {
    this.submittedd = true
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

  numericOnly(event): boolean {
    let patt = /^([0-9,.,_,/-])$/;
    let result = patt.test(event.key);
    return result;
  }

  /////////////

  individualgstData: any
  submittype: boolean = false;

  get validtype() {
    return this.editIndividualForm.controls;
  }

  openmodel2: any;

  editIndividualgstvalue(openmodel2) {
    this.openmodel2 = this.modalService.open(openmodel2, { centered: true, size: 's', backdrop: 'static' });
  }

  dismiss2(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }

  editIndividualGst() {
    this.submittype = true
    if (this.editIndividualForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Fill Details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.showSpinner = true
      var data = {
        discount_per: parseInt(this.editIndividualForm.value.individual_gst_report),
        from_date: this.dateSearchForAuditTwo.value.from_date,
        to_date: this.dateSearchForAuditTwo.value.to_date
      }
      this.AuditDataTwo = []
      this.service.updateIndividualGst(data).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Updated",
            showConfirmButton: false,
            timer: 1500,
          });
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
          this.submittype = false;
          this.modalService.dismissAll()
          this.editIndividualForm.reset();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
    }
  }

  submittedtype: boolean = false;
  get validedtype() {
    return this.HSNSrchForm.controls;
  }

  HSNreportsdata: any = []

  HSNSearchDATE() {
    this.submittedtype = true
    if (this.HSNSrchForm.invalid) {
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
      this.service.getHSNSrchdata(this.HSNSrchForm.value).subscribe((res) => {
        this.showSpinner = false;
        this.submittedtype = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        res.data.map((item, index) => {
          item.i = index + 1;
        });
        this.functionForHSNMonth(res.data)
        this.dataSourceThree = new MatTableDataSource(res.data);
        this.dataSourceThree.paginator = this.paginatorThree;
        this.dataSourceThree.sort = this.sortThree;
      })
    }
  }

  totalHSNCodeCount: any = 0;
  HsnGst5perGross: any = 0;
  HsnGst8perGross: any = 0;
  HsnGst12perGross: any = 0;
  HsnGst18perGross: any = 0;
  HsnGst28perGross: any = 0;
  HsnGst5perTax: any = 0;
  HsnGst8perTax: any = 0;
  HsnGst12perTax: any = 0;
  HsnGst18perTax: any = 0;
  HsnGst28perTax: any = 0;
  TotalHsnGrossPlusTaxSum: any = 0;


  HsnMonth: any;
  HsnYear: any;

  functionForHSNMonth(data) {
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

    this.totalHSNCodeCount = 0;
    this.HsnGst5perGross = 0;
    this.HsnGst8perGross = 0;
    this.HsnGst12perGross = 0;
    this.HsnGst18perGross = 0;
    this.HsnGst28perGross = 0;
    this.HsnGst5perTax = 0;
    this.HsnGst8perTax = 0;
    this.HsnGst12perTax = 0;
    this.HsnGst18perTax = 0;
    this.HsnGst28perTax = 0;
    this.TotalHsnGrossPlusTaxSum = 0;

    this.totalHSNCodeCount = data.length;

    data.map((item) => {
      if (item.gst_per == 5) {
        this.HsnGst5perGross += item.total_gross
        this.HsnGst5perTax += item.tax_percent
      } else if (item.gst_per == 8) {
        this.HsnGst8perGross += item.total_gross
        this.HsnGst8perTax += item.tax_percent
      } else if (item.gst_per == 12) {
        this.HsnGst12perGross += item.total_gross
        this.HsnGst12perTax += item.tax_percent
      } else if (item.gst_per == 18) {
        this.HsnGst18perGross += item.total_gross
        this.HsnGst18perTax += item.tax_percent
      } else if (item.gst_per == 28) {
        this.HsnGst28perGross += item.total_gross
        this.HsnGst28perTax += item.tax_percent
      }
    })

    data.map((item) => {
      this.TotalHsnGrossPlusTaxSum += item.total_gross + item.tax_percent
    })

    const { month, year } = getMonthNameAndYear(this.HSNSrchForm.value.from_date);

    this.HsnMonth = month
    this.HsnYear = year

    var totalHsnRecord = {
      totalHSNCodeCount: this.totalHSNCodeCount,
      HsnGst5perGross: this.HsnGst5perGross,
      HsnGst8perGross: this.HsnGst8perGross,
      HsnGst12perGross: this.HsnGst12perGross,
      HsnGst18perGross: this.HsnGst18perGross,
      HsnGst28perGross: this.HsnGst28perGross,
      HsnGst5perTax: this.HsnGst5perTax,
      HsnGst8perTax: this.HsnGst8perTax,
      HsnGst12perTax: this.HsnGst12perTax,
      HsnGst18perTax: this.HsnGst18perTax,
      HsnGst28perTax: this.HsnGst28perTax,
      TotalHsnGrossPlusTaxSum: this.TotalHsnGrossPlusTaxSum,
    }

    this.data = [totalHsnRecord]

    this.grandTotal = 0;

    this.grandTotal = this.data[0].TotalHsnGrossPlusTaxSum

    this.dataSourceFour = new MatTableDataSource(this.data)

  }

  grandTotal: any
  data: any

  //////////////

  HSNData: any
  submittyped: boolean = false;

  get validtyped() {
    return this.editHSNForm.controls;
  }

  openmodel3: any;

  editHSNgstvalue(openmodel3) {
    this.openmodel3 = this.modalService.open(openmodel3, { centered: true, size: 's', backdrop: 'static' });
  }

  dismiss3(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }

  editHSNGst() {
    this.submittyped = true
    if (this.editHSNForm.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Fill Details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.showSpinner = true
      var data = {
        discount_per: parseInt(this.editHSNForm.value.hsn_gst_value),
        from_date: this.HSNSrchForm.value.from_date,
        to_date: this.HSNSrchForm.value.to_date
      }
      this.service.updateHSNGst(data).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          var id = 0;
          res.data.map((res) => {
            res.i = id + 1;
            id++;
          });
          this.functionForHSNMonth(res.data)
          this.dataSourceThree = new MatTableDataSource(res.data);
          this.dataSourceThree.paginator = this.paginatorThree;
          this.dataSourceThree.sort = this.sortThree;

          this.submittyped = false;
          this.modalService.dismissAll()
          this.editHSNForm.reset();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
    }
  }

  applyFilterthree(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceThree.filter = filterValue.trim().toLowerCase();
  }

  applyFilterFour(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceFour.filter = filterValue.trim().toLowerCase();
  }


}

