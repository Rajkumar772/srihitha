import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { AccountsreportsallService } from '../accountsreportsall.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-opdaccountsreport',
  templateUrl: './opdaccountsreport.component.html',
  styleUrls: ['./opdaccountsreport.component.scss']
})
export class OpdaccountsreportComponent implements OnInit {
  showHint = false;
  displayTitle: string = '';
  showtodayreport: boolean = false;
  titleMap: { [key: string]: string } = {
    total: 'OP – Total Patients',
    yesterday: 'OP – Yesterday Patients',
    month: 'OP – Monthly Patients',
    year: 'OP – Yearly Patients',
    totalip: 'IP – Total Patients',
    yesterdayip: 'IP – Yesterday Patients',
    monthlyip: 'IP – Monthly Patients',
    yearlyip: 'IP – Yearly Patients',
    totallabs: 'Labs – Total Tests',
    yesterdaylabs: 'Labs – Yesterday Tests',
    monthlylabs: 'Labs – Monthly Tests',
    yearlylabs: 'Labs – Yearly Tests',
    totalpharma: 'Pharmacy – Total Purchase',
    yesterdaypharma: 'Pharmacy – Yesterday Purchase',
    monthlypharma: 'Pharmacy – Monthly Purchase',
    yearlypharma: 'Pharmacy – Yearly Purchase',
    totalpharmasale: 'Sales – Total',
    yesterdaypharmasale: 'Sales – Yesterday',
    monthlypharmasale: 'Sales – Monthly',
    yearlypharmasale: 'Sales – Yearly'
  };

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


  ];

  displayedColumnslabs: string[] = [
    'i', 'uh_id', 'name', 'gender', 'age', 'number', 'payment_mode',
    'cash_amount', 'upi_amount', 'transaction_id', 'discount_amount',
    'discount_per', 'after_discount_total', 'test_status', 'completed_date',
    'date', 'group_test_details'
  ];




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

  constructor(private service: AccountsreportsallService) {

  }

  // bread crumb items
  breadCrumbItems: Array<{}>;

  ngOnInit(): void {

    this.get()
    this.showHint = false;
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });

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

    } else {
      this.shoescard = 0;
      this.tableType = true
    }
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

  columnHeaderMap: { [key: string]: string } = {
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
    group_test_details: 'Test Details',
    medicine_name: 'Medicine Name',
    company_name: 'Company',
    batch_no: 'Batch No',
    expirydate: 'Expiry Date',
    quantity: 'Quantity',
  };


  onTodayOpClick(summaryData: any, type: string) {
    this.hasSearched = true;
    this.selectedType = type;

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

    }, 200);
  }

}
