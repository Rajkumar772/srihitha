import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ChartOptions } from 'highcharts';
import { AccountsreportsallService } from '../../modules/accounts/accountsreportsall.service';
import { data } from 'jquery';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})


export class AnalysisComponent implements OnInit {

  @ViewChild('losTableSection') losTableSection!: ElementRef;
  @ViewChild('todayReportSection') todayReportSection!: ElementRef;

  opChartView: 'weekly' | 'monthly' | 'yearly' = 'weekly';
  ipChartView: 'weekly' | 'monthly' | 'yearly' = 'weekly';
  labChartView: 'weekly' | 'monthly' | 'yearly' = 'weekly';
  pharmaChartView: 'weekly' | 'monthly' | 'yearly' = 'weekly';

  private opChartInst: any;
  private ipChartInst: any;
  private labChartInst: any;
  private pharmaChartInst: any;

  showHint = false;

  displayTitle: string = '';
  showtodayreport: boolean = false;
  titleMap: { [key: string]: string } = {
    // OP
    total: 'OP – Total Patients',
    yesterday: 'OP – Yesterday Patients',
    month: 'OP – Monthly Patients',
    year: 'OP – Yearly Patients',

    // IP
    totalip: 'IP – Total Patients',
    yesterdayip: 'IP – Yesterday Patients',
    monthlyip: 'IP – Monthly Patients',
    yearlyip: 'IP – Yearly Patients',

    // Labs
    totallabs: 'Labs – Total Tests',
    yesterdaylabs: 'Labs – Yesterday Tests',
    monthlylabs: 'Labs – Monthly Tests',
    yearlylabs: 'Labs – Yearly Tests',

    // Pharmacy
    totalpharma: 'Pharmacy – Total Purchase',
    yesterdaypharma: 'Pharmacy – Yesterday Purchase',
    monthlypharma: 'Pharmacy – Monthly Purchase',
    yearlypharma: 'Pharmacy – Yearly Purchase',

    // Sales
    totalpharmasale: 'Sales – Total',
    yesterdaypharmasale: 'Sales – Yesterday',
    monthlypharmasale: 'Sales – Monthly',
    yearlypharmasale: 'Sales – Yearly'
  };




  losData: any = {};
  showSpinner: Boolean = false
  barChart: any;
  basicRadialBarChart: any;
  lineBarChart: any;
  columnlabelChart: any;
  simplePieChart: any;
  basicColumChart: any;
  class = 'spl';
  userarray: any = [];
  caralldataarray: any = [];
  labelsdata: any;
  daycounts: any;
  appointmentarray1: any
  rjyarray: any = [];
  chart: any

  chartOptions: any
  displayedColumns: any = []



  dataSource = new MatTableDataSource<any>([]);
  searchKey = '';
  paginator: MatPaginator;

  displayedColumnsop: string[] = [
    'i',
    'uh_id',
    'date',
    'name',
    'gender',
    'age',
    'phone_number',
    'aadhar',
    'address',
    'doctor_name',
    'doctor_department',
    'card_type',
    'card_appointment_type',
    'patient_type',
    'payment_way',
    'payment_types',
    'consultant_fee',
    'discount_amount',
    'after_discount_total'

  ];
  displayedColumnsip: string[] = [
    'i',
    'uh_id',
    'ip_number',
    'name',
    'gender',
    'age',
    'phone_number',
    'admin_date',
    'discharge_date',
    'aadhar',
    'address',
    'doctor_name',
    'bed_no',
    'room_number',
    'lessadvance',
    'room_type',
    't_days',
    'price',
    'amount',
    'discharge_amount',
    'payment_types',
    // 'payment_type_discharge',
    // 'insurance_name',
    // 'med_claim'

  ];
  // displayedColumnslabs: string[] = [
  //   'i', 'uh_id', 'name', 'gender', 'age', 'number',
  //   'payment_mode', 'cash_amount', 'upi_amount', 'transaction_id',
  //   'discount_amount', 'discount_per', 'after_discount_total',
  //   'test_status', 'completed_date', 'entry_name', 'date', 'group_test_details'
  // ];
  displayedColumnslabs: string[] = [
    'i', 'uh_id', 'name', 'gender', 'age', 'number', 'payment_mode',
    'cash_amount', 'upi_amount', 'transaction_id', 'discount_amount',
    'discount_per', 'after_discount_total', 'test_status', 'completed_date',
    'date', 'group_test_details'
  ];


  // displayedColumnspharma: string[] = [
  //   'i',
  //   'invoice_date',
  //   'invoice_number',
  //   'purchase_bill_no',
  //   'supplier_name',
  //   'supplier_number',
  //   'supplier_gst',
  //   'supp_dl_no1',
  //   'supp_dl_no2',
  //   'total_gross',
  //   'discount_percent',
  //   'total_wth_discount',
  //   'cgst_amount',
  //   'sgst_amount',
  //   'grandtotal',
  //   'return_amount',
  //   'no_of_items',
  //   'audit_month_count',
  //   'audit_currnt_disc_percnt',
  //   'audit_last_update_time',
  //   'entry_name',
  //   'bill_modified_date',
  //   'sale_print_count',
  //   'sale_date',
  //   'cts'
  // ];

  displayedColumnspharma: string[] = [
    'i',
    'medicine_name',
    'company_name',
    'category_name',
    'batch_no',
    'sale_and_purchase_date',
    'expirydate',
    'pack',
    'quantity',
    'total_tabs',
    'free_tabs',
    'mrp_rate',
    'eachcost',
    'purchase_rate',
    'purchase_eachcost',
    'gst_per',
    'with_gst_price',
    'without_gst_medicine_price',
    'hsncode',
    'schedule_drugs',

    // 'cts'
  ];

  displayedColumnssale: string[] = [
    'i',
    'medicine_name',
    'company_name',
    // 'category_name',
    'batch_no',
    'expirydate',
    'pack',
    'quantity',
    'total_tabs',
    'free_tabs',
    'mrp_rate',
    'eachcost',
    // 'purchase_rate',
    // 'purchase_eachcost',
    'gst_per',
    'with_gst_price',
    'without_gst_medicine_price',
    'hsncode',
    'schedule_drugs',
    'sale_and_purchase_date',
    // 'cts'
  ];


  @ViewChild(MatSort) sort: MatSort;

  dataSourceop = new MatTableDataSource<any>([]);
  dataSourceip = new MatTableDataSource<any>([]);
  dataSourcelabs = new MatTableDataSource<any>([]);
  dataSourcepharmacy = new MatTableDataSource<any>([]);
  dataSourcesale = new MatTableDataSource<any>([]);
  masterdataop: any = [];
  clonedataop: any[] = [];
  masterdataip: any = [];
  clonedataip: any[] = [];

  masterdatalabs: any = [];
  clonedatalabs: any[] = [];


  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

  constructor(private service: AccountsreportsallService, private router: Router) { }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {
    this.loadHospitalOpsDashboard();
    this.get()
    this.showHint = false;
  }


  main: any = [];
  mainres: any = [];
  patientscountdata: any = [];
  todayscountdata: any = [];

  get() {
    this.service.maintotal().subscribe((res: any) => {
      this.main = res.data;
    })
    this.service.maintotalres().subscribe((res: any) => {
      this.mainres = res.data;


    })
    this.service.patientscount().subscribe((res: any) => {
      this.patientscountdata = res.data;



    })
    this.service.todayscount().subscribe((res: any) => {
      this.todayscountdata = res.data;


    })
    this.service.ipLosDashboard().subscribe((res: any) => {
      this.losData = res?.data || {};
    });

  }
  weekChart: any;




  /* Helper function */
  getMonthName(month: string): string {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[Number(month) - 1];
  }
  shoescard: any = 0;

  aspets: any = 1;
  openid() {
    if (this.shoescard == 0) {
      this.shoescard = 1;
      this.showtodayreport = false;

      // ✅ ADD: render charts after overall view opens
      setTimeout(() => this.renderAllCharts(), 200);

    } else {
      this.shoescard = 0;
      this.tableType = true;
    }
  }
  changeChartView(dept: 'op' | 'ip' | 'lab' | 'pharma', view: 'weekly' | 'monthly' | 'yearly') {

    if (dept === 'op') this.opChartView = view;
    if (dept === 'ip') this.ipChartView = view;
    if (dept === 'lab') this.labChartView = view;
    if (dept === 'pharma') this.pharmaChartView = view;

    this.updateChart(dept);
  }

  private renderAllCharts() {
    this.createOrUpdateChart('op');
    this.createOrUpdateChart('ip');
    this.createOrUpdateChart('lab');
    this.createOrUpdateChart('pharma');
  }

  private updateChart(dept: 'op' | 'ip' | 'lab' | 'pharma') {
    this.createOrUpdateChart(dept);
  }

  private createOrUpdateChart(dept: 'op' | 'ip' | 'lab' | 'pharma') {

    const canvasId =
      dept === 'op' ? 'opChart' :
        dept === 'ip' ? 'ipChart' :
          dept === 'lab' ? 'labChart' : 'pharmaChart';

    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!el) return;

    const view =
      dept === 'op' ? this.opChartView :
        dept === 'ip' ? this.ipChartView :
          dept === 'lab' ? this.labChartView : this.pharmaChartView;

    // ✅ API ONLY (dynamic)
    this.service.getDeptChart(dept, view).subscribe({
      next: (res: any) => {

        if (!res || res.status !== 200 || !res.data) return;

        const cfg = {
          labels: res.data.labels || [],
          counts: (res.data.counts || []).map((v: any) => Number(v) || 0),
          amounts: (res.data.amounts || []).map((v: any) => Number(v) || 0),
          labelCount: dept.toUpperCase() + ' Count',
          labelAmount: dept.toUpperCase() + ' Amount'
        };
        // ✅ paste here
        if (dept === 'pharma') {

        }

        // then this
        const chartConfig = this.getChartConfigByView(dept, view, cfg);



        // ✅ destroy previous instance
        if (dept === 'op' && this.opChartInst) this.opChartInst.destroy();
        if (dept === 'ip' && this.ipChartInst) this.ipChartInst.destroy();
        if (dept === 'lab' && this.labChartInst) this.labChartInst.destroy();
        if (dept === 'pharma' && this.pharmaChartInst) this.pharmaChartInst.destroy();

        // ✅ build chart config from API cfg
        // const chartConfig = this.getChartConfigByView(dept, view, cfg);

        const chart = new Chart(el, chartConfig);

        if (dept === 'op') this.opChartInst = chart;
        if (dept === 'ip') this.ipChartInst = chart;
        if (dept === 'lab') this.labChartInst = chart;
        if (dept === 'pharma') this.pharmaChartInst = chart;
      },

      error: (err) => {

      }
    });
  }

  private getChartConfigByView(
    dept: 'op' | 'ip' | 'lab' | 'pharma',
    view: 'weekly' | 'monthly' | 'yearly',
    cfg: { labels: string[]; counts: number[]; amounts: number[]; labelCount: string; labelAmount: string; }
  ): any {

    // ---------- WEEKLY (same like now) ----------
    if (view === 'weekly') {
      return {
        type: 'bar',
        data: {
          labels: cfg.labels,
          datasets: [
            {
              label: cfg.labelCount,
              data: cfg.counts,
              backgroundColor: 'rgba(102,126,234,0.35)',
              borderColor: 'rgba(102,126,234,1)',
              borderWidth: 1,
              borderRadius: 8
            },
            {
              label: cfg.labelAmount,
              data: cfg.amounts,
              type: 'line',
              fill: false,
              borderColor: 'rgba(245,87,108,1)',
              backgroundColor: 'rgba(245,87,108,0.20)',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.35,
              yAxisID: 'y2'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true },
          tooltips: { mode: 'index', intersect: false },
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [
              { id: 'y1', position: 'left', ticks: { beginAtZero: true } },
              { id: 'y2', position: 'right', gridLines: { display: false }, ticks: { beginAtZero: true } }
            ]
          }
        }
      };
    }

    // ---------- MONTHLY (CIRCLE / DOUGHNUT) ----------
    if (view === 'monthly') {
      const donutColors = [
        'rgba(46, 204, 113, 0.85)',
        'rgba(52, 152, 219, 0.85)',
        'rgba(155, 89, 182, 0.85)',
        'rgba(241, 196, 15, 0.85)',
        'rgba(230, 126, 34, 0.85)',
        'rgba(231, 76, 60, 0.85)',
        'rgba(26, 188, 156, 0.85)',
        'rgba(149, 165, 166, 0.85)',
        'rgba(52, 73, 94, 0.85)',
        'rgba(243, 156, 18, 0.85)',
        'rgba(192, 57, 43, 0.85)',
        'rgba(127, 140, 141, 0.85)'
      ];

      return {
        type: 'doughnut',
        data: {
          labels: cfg.labels,
          datasets: [
            {
              label: cfg.labelAmount,
              // ✅ monthly circle shows AMOUNT distribution
              data: cfg.amounts,
              backgroundColor: donutColors.slice(0, cfg.labels.length),
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 68, // ✅ donut hole size
          legend: {
            display: true,
            position: 'bottom'
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem: any, data: any) => {
                const label = data.labels[tooltipItem.index] || '';
                const val = data.datasets[0].data[tooltipItem.index] || 0;
                return `${label}: ₹${val}`;
              }
            }
          }
        }
      };
    }

    // ---------- YEARLY (AREA CHART like your 1st image) ----------
    return {
      type: 'line',
      data: {
        labels: cfg.labels,
        datasets: [
          {
            label: cfg.labelCount,
            data: cfg.counts,
            borderColor: 'rgba(52, 152, 219, 1)',
            backgroundColor: 'rgba(52, 152, 219, 0.18)',
            fill: true,              // ✅ area fill
            tension: 0.35,
            pointRadius: 2,
            yAxisID: 'y1'
          },
          {
            label: cfg.labelAmount,
            data: cfg.amounts,
            borderColor: 'rgba(46, 204, 113, 1)',
            backgroundColor: 'rgba(46, 204, 113, 0.18)',
            fill: true,              // ✅ area fill
            tension: 0.35,
            pointRadius: 2,
            yAxisID: 'y2'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: true },
        tooltips: { mode: 'index', intersect: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [
            { id: 'y1', position: 'left', ticks: { beginAtZero: true } },
            { id: 'y2', position: 'right', gridLines: { display: false }, ticks: { beginAtZero: true } }
          ]
        }
      }
    };
  }

  openbute(id: any) {
    this.aspets = id
  }


  ngAfterViewInit(): void {
    // attach paginator safely after view init
    // this.dataSource.paginator = this.paginator;
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  clearFilter() {
    this.searchKey = '';
    this.applyFilter();
  }




  hasSearched = false;
  selectedType = '';
  // columnHeaderMap: { [key: string]: string } = {
  //   id: 'ID',
  //   title: 'Title',
  //   name: 'Patient Name',
  //   aadhar: 'Aadhar No',

  //   age: 'Age',
  //   yandm:'Y/M',
  //   gender: 'Gender',
  //   marital_status: 'Marital Status',
  //   phone_number: 'Phone Number',
  //   address: 'Address',
  //   doctor_name: 'Doctor Name',
  //   doctor_department: 'Department',
  //   // appointment_type: 'Appointment Type',
  //   card_appointment_type: 'Card Appointment',
  //   card_type: 'Card Type',
  //   date: 'Register Date',
  //   expiry_date: 'Expiry Date',
  //   days_to_expiry: 'Days to Expiry',
  //   consultant_fee: 'Consultant Fee',
  //   after_discount_total: 'Net Amount',
  //   discount_amount: 'Discount Amount',
  //   discount_per: 'Discount (%)',
  //   payment_types: 'Payment Type',
  //   payment_way: 'Payment Mode',
  //   cash_amount: 'Cash Amount',
  //   upi_amount: 'UPI Amount',
  //   reffered_by: 'Referred By',
  //   transaction_id: 'Transaction ID',
  //   uh_id: 'UHID',
  //   patient_type: 'Patient Type',

  //   // Lab
  //   group_test_details: 'Test Details',

  //   // Pharmacy
  //   medicine_name: 'Medicine Name',
  //   company_name: 'Company',
  //   batch_no: 'Batch No',
  //   expirydate: 'Expiry Date',
  //   quantity: 'Quantity',
  // };


  columnHeaderMap: { [key: string]: string } = {
    // 🔹 Common
    id: 'ID',
    title: 'Title',
    name: 'Patient Name',
    aadhar: 'Aadhar No',
    age: 'Age',
    yandm: 'Y/M',
    gender: 'Gender',
    marital_status: 'Marital Status',
    phone_number: 'Phone Number',
    address: 'Address',
    doctor_name: 'Doctor Name',
    doctor_department: 'Department',
    card_appointment_type: 'Card Appointment',
    card_type: 'Card Type',
    date: 'Register Date',
    expiry_date: 'Expiry Date',
    days_to_expiry: 'Days to Expiry',
    consultant_fee: 'Consultant Fee',
    after_discount_total: 'Net Amount',
    discount_amount: 'Discount Amount',
    discount_per: 'Discount (%)',
    payment_types: 'Payment Type',
    payment_way: 'Payment Mode',
    cash_amount: 'Cash Amount',
    upi_amount: 'UPI Amount',
    reffered_by: 'Referred By',
    transaction_id: 'Transaction ID',
    uh_id: 'UHID',
    patient_type: 'Patient Type',

    // 🔹 IP specific
    admin_date: 'Admission Date',
    ip_number: 'IP Number',
    occupation: 'Occupation',
    bed_no: 'Bed No',
    room_id: 'Room ID',
    room_number: 'Room No',
    room_type: 'Room Type',
    room_status: 'Room Status',
    t_days: 'Total Days',
    amount: 'Amount',
    price: 'Price',
    lessadvance: 'Less Advance',
    discharge_amount: 'Discharge Amount',
    payment_type_discharge: 'Discharge Payment Type',
    insurance_name: 'Insurance Name',
    med_claim: 'Medical Claim',
    transaction_id_discharge: 'Discharge Transaction ID',
    discharge_date: 'Discharge Date',
    complaint: 'Complaint',

    // 🔹 Lab
    group_test_details: 'Test Details',

    // 🔹 Pharmacy
    medicine_name: 'Medicine Name',
    company_name: 'Company',
    batch_no: 'Batch No',
    expirydate: 'Expiry Date',
    quantity: 'Quantity',
  };


  onTodayOpClick(summaryData: any, type: string) {

    this.hasSearched = true;      // 👈 user clicked
    this.selectedType = type;
    const todayTitleMap: any = {
      op: 'Today OP Report',
      ip: 'Today IP Admissions Report',
      lab: 'Today Lab Report',
      pharma: 'Today Pharmacy Purchase Report',
      sale: 'Today Pharmacy Sale Report'
    };

    this.reportTitle = todayTitleMap[type] || 'Today Report';
    this.dataSource.data = [];
    this.displayedColumns = [];

    const datas = { amount: summaryData, type: type };

    this.service.selectedtodayallcountreport(datas).subscribe((res: any) => {

      this.showtodayreport = true;
      if (res.status === 200 && res.data?.length > 0) {
        // this.dataSource.data = res.data;
        // this.dataSource.paginator = this.paginator;
        const parsedData = res.data.map((item: any) => {
          let groupDetails: any[] = [];

          if (item.group_test_details) {
            if (typeof item.group_test_details === 'string') {
              try {
                groupDetails = JSON.parse(item.group_test_details);
              } catch {
                groupDetails = [];
              }
            } else if (Array.isArray(item.group_test_details)) {
              groupDetails = item.group_test_details;
            }
          }

          return {
            ...item,
            group_test_details: groupDetails
          };
        });

        this.dataSource.data = parsedData;
        this.dataSource.paginator = this.paginator;


      } else {
        this.dataSource.data = [];
      }

      switch (type.toLowerCase()) {
        case 'op':
          this.displayedColumns = [
            'id', 'title', 'name', 'aadhar', 'age', 'yandm', 'gender', 'marital_status', 'phone_number',
            'address', 'doctor_name', 'doctor_department', 'card_appointment_type', 'card_type',
            'date', 'expiry_date', 'days_to_expiry', 'description', 'consultant_fee', 'after_discount_total',
            'discount_amount', 'discount_per', 'payment_types', 'payment_way', 'cash_amount', 'cash_cashless',
            'upi_amount', 'reffered_by', 'transcation_id', 'uh_id', 'patient_type', 'i_ts',

          ];
          break;
        case 'ip':

          this.displayedColumns = [
            'id',
            'admin_date',
            'name',
            'age',
            'gender',
            'phone_number',
            'aadhar',
            'address',
            'occupation',
            'uh_id',
            'ip_number',
            'doctor_name',
            'bed_no',
            'room_number',
            'room_type',
            'room_status',
            't_days',
            'amount',
            'price',
            'lessadvance',
            'discharge_amount',
            'payment_types',
            'payment_type_discharge',
            'insurance_name',
            'med_claim',
            'transaction_id',
            'transaction_id_discharge',
            'discharge_date'

          ];

          break;

        case 'lab':
          this.displayedColumns = [
            'id', 'name', 'd_name', 'age', 'gender',
            'after_discount_total', 'discount_amount', 'discount_per',
            'payment_mode', 'cash_amount', 'upi_amount', 'entry_name',
            'uh_id', 'group_test_details'
          ];
          break;
        case 'pharma':
          this.displayedColumns = [
            'i',
            'medicine_name',
            'company_name',
            'category_name',
            'batch_no',
            'expirydate',
            'pack',
            'quantity',
            'total_tabs',
            'free_tabs',
            'mrp_rate',
            'eachcost',
            'purchase_rate',
            'purchase_eachcost',
            'gst_per',
            'with_gst_price',
            'without_gst_medicine_price',
            'hsncode',
            'schedule_drugs',
            'sale_and_purchase_date',
            'cts'
          ];
          break;
        case 'sale':
          this.displayedColumns = [
            'i',
            'medicine_name',
            'company_name',
            'category_name',
            'batch_no',
            'expirydate',
            'pack',
            'quantity',
            'total_tabs',
            'free_tabs',
            'mrp_rate',
            'eachcost',

            'gst_per',
            'with_gst_price',
            'without_gst_medicine_price',
            'hsncode',
            'schedule_drugs',
            'sale_and_purchase_date',
            'cts'
          ];
          break;

      }
    });

    setTimeout(() => {
      this.todayReportSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  }






  applyFilterop(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceop.filter = filterValue.trim().toLowerCase();
  }
  applyFilterip(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceip.filter = filterValue.trim().toLowerCase();
  }
  applyFilterlabs(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcelabs.filter = filterValue.trim().toLowerCase();
  }
  applyFilterpharmacy(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcepharmacy.filter = filterValue.trim().toLowerCase();
  }
  applyFiltersale(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcesale.filter = filterValue.trim().toLowerCase();
  }





  @ViewChild('opTable') opTable!: ElementRef;
  @ViewChild('ipTable') ipTable!: ElementRef;
  @ViewChild('labsTable') labsTable!: ElementRef;
  @ViewChild('pharmacyTable') pharmacyTable!: ElementRef;
  @ViewChild('salesTable') salesTable!: ElementRef;



  // tableType: 'op' | 'ip' | 'labs' | 'pharmacy' | null = null;
  tableType = null;
  OpClickoverall(count: any, type: string): void {
    // 1️⃣ Prepare API payload
    const payload = {
      count: count,
      type: type
    };


    // 2️⃣ Call API
    this.service.opoverallcount(payload).subscribe({

      next: (res: any) => {

        if (!res || !res.data) {
          return;
        }

        // 3️⃣ Add serial number to each row
        res.data.forEach((item: any, index: number) => {
          item.i = index + 1;
        });
        this.displayTitle = this.titleMap[type] || '';

        // 4️⃣ Define table type mappings
        const opTypes = ['total', 'yesterday', 'month', 'year'];
        const ipTypes = ['totalip', 'yesterdayip', 'monthlyip', 'yearlyip'];
        const labTypes = ['totallabs', 'yesterdaylabs', 'monthlylabs', 'yearlylabs'];
        const pharmacyTypes = ['totalpharma', 'yesterdaypharma', 'monthlypharma', 'yearlypharma'];
        const salesTypes = ['totalpharmasale', 'yesterdaypharmasale', 'monthlypharmasale', 'yearlypharmasale'];

        // 5️⃣ Reset all tables (optional but clean)
        this.tableType = '';
        // this.showtodayreport = false;

        // 6️⃣ Decide which table to show
        if (opTypes.includes(type)) {

          this.tableType = 'op';
          this.dataSourceop = new MatTableDataSource(res.data);
          this.dataSourceop.paginator = this.paginator;
          this.dataSourceop.sort = this.sort;
          this.scrollToTable('op');
        } else if (ipTypes.includes(type)) {

          this.tableType = 'ip';
          this.dataSourceip = new MatTableDataSource(res.data);
          this.dataSourceip.paginator = this.paginator;
          this.dataSourceip.sort = this.sort;

          this.scrollToTable('ip');

        }

        else if (labTypes.includes(type)) {

          this.tableType = 'labs';

          const parsedData = res.data.map((item: any) => {
            let groupDetails = [];

            if (item.group_test_details) {
              if (typeof item.group_test_details === 'string') {
                try {
                  groupDetails = JSON.parse(item.group_test_details);
                } catch (e) {
                  groupDetails = [];
                }
              } else if (Array.isArray(item.group_test_details)) {
                groupDetails = item.group_test_details;
              }
            }

            return {
              ...item,
              group_test_details: groupDetails
            };
          });

          this.dataSourcelabs = new MatTableDataSource(parsedData);



          this.dataSourcelabs.paginator = this.paginator;
          this.dataSourcelabs.sort = this.sort;

          this.scrollToTable('labs');



        }

        else if (pharmacyTypes.includes(type)) {
          this.tableType = 'pharmacy';
          this.dataSourcepharmacy = new MatTableDataSource(res.data);
          this.dataSourcepharmacy.paginator = this.paginator;
          this.dataSourcepharmacy.sort = this.sort;

          this.scrollToTable('pharmacy');
        }
        else if (salesTypes.includes(type)) {
          this.tableType = 'sale';
          this.dataSourcesale = new MatTableDataSource(res.data);
          this.dataSourcesale.paginator = this.paginator;
          this.dataSourcesale.sort = this.sort;

          this.scrollToTable('sale');
        }
      },

      error: (err) => {

      }
    });
  }
  private scrollToTable(type: 'op' | 'ip' | 'labs' | 'pharmacy' | 'sale'): void {

    setTimeout(() => {

      let element: ElementRef | undefined;

      switch (type) {
        case 'op':
          element = this.opTable;
          break;
        case 'ip':
          element = this.ipTable;
          break;
        case 'labs':
          element = this.labsTable;
          break;
        case 'pharmacy':
          element = this.pharmacyTable;
          break;
        case 'sale':
          element = this.salesTable;
          break;
      }

      element?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }, 200); // delay required for *ngIf render
  }

  showLosTable = false;
  losPatients: any[] = [];

  openLosPatients(): void {
    this.showLosTable = true;

    this.service.getLosPatients().subscribe((res: any) => {
      this.losPatients = (res.data || []).map((p: any) => ({
        ...p,
        blinkDelay: (Math.random() * 8).toFixed(2) + 's',
        moveDelay: (Math.random() * 5).toFixed(2) + 's'
      }));

      setTimeout(() => {
        this.losTableSection?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    });
  }



  showRevenueModal = false;
  selectedRevenuePatient: any = null;
  patientRevenue: any = {};

  viewRevenue(item: any): void {
    this.selectedRevenuePatient = item;
    this.showRevenueModal = true;
    this.patientRevenue = {};

    this.service.getPatientRevenue(item.uh_id).subscribe((res: any) => {
      
      this.patientRevenue = res?.data || {};
    });
  }
  reportTitle = '';


  hospitalOps: any = {};
  opsReportRows: any[] = [];
  opsReportType = '';
  opsReportTitle = '';

  loadHospitalOpsDashboard() {
    this.service.hospitalOpsDashboard().subscribe((res: any) => {
      if (res.status === 200) {
        this.hospitalOps = res.data || {};
      }
    });
  }

  openOpsReport(type: string) {
    this.opsReportType = type;
    this.showLosTable = false;
    this.showtodayreport = false;
    this.tableType = '';

    const titles: any = {
      today_admissions: 'Today Admissions Report',
      current_ip: 'Current IP Census Report',
      nurse_assessment_time: 'Nurse Initial Assessment Time Report',
      consultant_plan: 'Consultant Plan Of Care Report',
      pending_nurse_assessment: 'Pending Nurse Assessment Report',
      pending_consultant_plan: 'Pending Consultant Plan Report'
    };


    this.opsReportTitle = titles[type] || 'Hospital Operations Report';

    this.service.hospitalOpsReport(type).subscribe((res: any) => {
      this.opsReportRows = res.data || [];

      setTimeout(() => {
        const section = document.getElementById('opsReportSection');
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    });
  }

  formatMinutes(minutes: number): string {

    if (!minutes || minutes <= 0) {
      return '0 Min';
    }

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs === 0) {
      return `${mins} Min`;
    }

    return `${hrs} Hr ${mins} Min`;
  }
  formatDelay(minutes: number): string {

    if (!minutes || minutes <= 0) {
      return '0 Min';
    }

    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const mins = minutes % 60;

    let result = '';

    if (days > 0) {
      result += `${days} Day `;
    }

    if (hours > 0) {
      result += `${hours} Hr `;
    }

    if (mins > 0) {
      result += `${mins} Min`;
    }

    return result.trim();
  }

  getAssessmentStatus(row: any): any {

    if (!row.assessment_time) {
      return {
        label: 'Pending',
        class: 'danger'
      };
    }

    const minutes = Number(row.delay_minutes) || 0;

    if (minutes <= 60) {
      return {
        label: 'Within 1 Hr',
        class: 'success'
      };
    }

    if (minutes <= 120) {
      return {
        label: 'Delayed',
        class: 'warning'
      };
    }

    if (minutes <= 1440) {
      return {
        label: 'Critical Delay',
        class: 'danger'
      };
    }

    return {
      label: 'Critical Delay',
      class: 'critical'
    };
  }



}