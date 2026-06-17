import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LabsServicesService } from '../labs-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import * as XLSX from 'xlsx'; // Import xlsx library
import { saveAs } from 'file-saver';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-assign-lab-tests',
  templateUrl: './assign-lab-tests.component.html',
  styleUrls: ['./assign-lab-tests.component.scss']
})
export class AssignLabTestsComponent {



  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for



  nextdisplayedColumns: string[] = ['i', 'date', 'name', 'age', 'number', 'gender', 'd_name', 'grandtotal', 'payment_mode', 'print']
  selectColumns: string[] = [];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  editForm: FormGroup;
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


  myform: FormGroup
  breadCrumbItems: Array<{}>;
  form: FormGroup
  medicaltest: any;
  patients_data: any;
  category: any = []
  Medical_test: any;
  medicallistArr: any = []
  grandtotal: any = 0;
  showSpinner: boolean = false;
  grouptestDts: FormGroup;
  labAssgnSearch: FormGroup;

  user_id: any;
  usr_nm: any;
  currentDate: any;
  constructor(public formBuilder: FormBuilder, private myservice: LabsServicesService, public route: ActivatedRoute, private router: Router,
    public datePipe: DatePipe, public modalService: NgbModal) {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.form = this.formBuilder.group({
      uh_id: [''],
      lab_date: [this.currentDate, [Validators.required]],
      age: ['', Validators.required],
      name: ['', Validators.required],
      number: ['', Validators.required],
      gender: ['', [Validators.required]],
      transaction_id: [''],
      payment_mode: ['CASH', Validators.required],
      grandtotal: [''],
      opdoctor: ['1'],
      doctor_patient_id: [''],
      // discount_per: ['', [Validators.required]],
      discount_amount: [''],
      after_discount_total: [''],
      // d_name: ['', [Validators.required]],
      cash_amount: [''],
      upi_amount: [''],
    });

    this.editForm = this.formBuilder.group({
      age: ['', Validators.required],
      name: ['', Validators.required],
      number: ['', Validators.required],
      gender: ['', Validators.required],
      transaction_id: [''],
    });

    this.myform = this.formBuilder.group({
      id: [''],
      category: ['', Validators.required],
      Medical_test: ['', Validators.required],
      amount: ['', Validators.required]
    });

    this.grouptestDts = this.formBuilder.group({
      group_name: ['', [Validators.required]],
      group_amount: ['', [Validators.required]]
    })

    this.labAssgnSearch = this.formBuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    })

  }


  ngOnInit(): void {
    this.getmediclatest();
    this.getpatients();
    this.mainGetforAssignLabs();
    this.getdoctorname();
    this.getlabKititems();
  }

  typesubmit: boolean;

  get type() {
    return this.form.controls;
  }

  submit: boolean
  get validate() {
    return this.editForm.controls;
  }

  // Accept Input As a Number Only
  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  labGrouptestsdata: any;
  doctot_assign_labs: any;
  getpatients() {
    this.myservice.getDataAllpatients().subscribe((res: any) => {
      this.patients_data = res.data;
      console.log(this.patients_data,156);
      
    });
    this.myservice.getCategory().subscribe((res: any) => {
      this.category = res.data;

    });
    this.myservice.maingetCallforGroupTests().subscribe((res: any) => {
      this.labGrouptestsdata = res.data
    });
    this.myservice.getdata_assign_labs().subscribe((res: any) => {
      this.doctot_assign_labs = res.data;


    });
  }

  labAssignData: any;
  getassignlabdata: any;
  grandTotal: any;
  cash: any;
  upi: any;
  both: any;
  free: any;

  mainGetforAssignLabs() {
    this.myservice.mainGetforAssignLabs().subscribe((res: any) => {
      this.getassignlabdata = res.data;
      this.grandTotal = 0;
      this.cash = 0;
      this.upi = 0;
      this.both = 0;
      this.free = 0;
      this.getassignlabdata.forEach((item) => {
        const total = parseInt(item.after_discount_total) || 0;
        // Calculate grandTotal
        this.grandTotal += total;
        // Calculate cash and upi based on Payment Mode
        if (item.payment_mode === 'CASH') {
          this.cash += total;
        } else if (item.payment_mode === 'UPI') {
          this.upi += total;

        }
      });
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });
      this.labAssignData = []
      this.labAssignData = res.data;
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  SearchDATE() {
    this.submitt = true
    if (this.labAssgnSearch.invalid) {
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
      this.myservice.getSearchLabsData(this.labAssgnSearch.value).subscribe((res) => {
        this.showSpinner = false;
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        this.getassignlabdata = res.data;
        this.grandTotal = 0;
        this.cash = 0;
        this.upi = 0;
        this.both = 0;
        this.free = 0;
        this.getassignlabdata.forEach((item) => {
          const total = parseInt(item.after_discount_total) || 0;
          // Calculate grandTotal
          this.grandTotal += total;
          // Calculate cash and upi based on Payment Mode
          if (item.payment_mode === 'CASH') {
            this.cash += total;
          } else if (item.payment_mode === 'UPI') {
            this.upi += total;

          }
        });
        res.data.forEach((item, index) => {
          item.i = index + 1;
        });
        this.labAssignData = []
        this.labAssignData = res.data;
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
    }
  }

  paymentload: boolean = false;
  showTwoAmounts: boolean = false;
  paymentslot(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload = true
      this.showTwoAmounts = false
    } else if (as == 'CASH') {
      this.paymentload = false
      this.showTwoAmounts = false

    }
  }

  getmediclatest() {
    this.myservice.get_labtest().subscribe((res: any) => {
      this.medicaltest = res.data;
    })
  }

  changepn(uh_id) {
    var result = this.patients_data.find(o => o.uh_id === uh_id);
    this.form.patchValue({
      name: result.name,
      age: result.age,
      number: result.phone_number,
      gender: result.gender,
    })
  }

  medicalarray: any = []
  getting_eeror(event) {
    this.medicalarray = this.medicaltest.filter((o: any) => o.category_id == event[0]);
  }

  changetets(Medical_test) {
    var result = this.medicaltest.find(o => o.labtest === Medical_test);
    this.myform.patchValue({
      id: result.id,
      amount: result.amount
    })
  }

  addmedicaltest() {
    if (this.myform.invalid) {
      Swal.fire('Please Give Lab Test Details');
    }
    else {
      this.medicallistArr.push({
        'labtest_id': this.myform.value.id,
        'category_id': this.myform.value.category[0],
        'category_name': this.myform.value.category[1],
        'labtest': this.myform.value.Medical_test,
        'amount': this.myform.value.amount
      })
      let sum = 0;
      this.medicallistArr.forEach((element) => {
        sum += parseInt(element.amount);
      });
      this.grandtotal = sum;
      this.myform.reset();
    }
  }

  delete(i, medicine_price) {
    this.grandtotal = (this.grandtotal * 1) - medicine_price;
    this.medicallistArr.splice(i, 1);
  }

  totalLabtestforGroup: any = [];
  fixedGroupLabTests: any = [];

  groupId: any;
  PackageAmount: any;

  group_select(event) {
    this.groupId = event;
    var result = this.labGrouptestsdata.find(o => o.id == event);
    this.grouptestDts.patchValue({
      group_name: result.group_name,
      group_amount: result.group_package_amount
    })
    var data = {
      'group_id': this.groupId
    };
    this.showSpinner = true
    this.totalLabtestforGroup = []
    this.myservice.findandGetGroupCategoryTests(data).subscribe((res) => {
      res.data.map((res) => {
        res.amount = 0
      })
      this.totalLabtestforGroup = res.data;
      this.showSpinner = false
    })

  }

  MutipleGroupsdata: any = [];
  packageTotal: any;
  addGrouptestPtnt() {
    if (this.grouptestDts.invalid) {
      Swal.fire('Please Give Group Test Details');
    }
    else {
      this.totalLabtestforGroup.forEach(obj => {
        this.fixedGroupLabTests.push(obj);
      });
      this.MutipleGroupsdata.push(this.grouptestDts.value)
      let sum = 0;
      this.MutipleGroupsdata.forEach((element) => {
        sum += parseInt(element.group_amount);
      });
      this.PackageAmount = sum;
      this.grouptestDts.reset()
    }

  }

  deleteGroupLbtests(i) {
    this.fixedGroupLabTests.splice(i, 1);
  }

  clcick() {
    this.router.navigate(['/labsmdl/Add-lab-tests'])
  }



  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }

  groupMbrsData: any = [];
  record123(viewModal, row) {
    var data = {
      'group_id': row.id,
    }
    this.myservice.getlabTests(data).subscribe((res) => {
      this.groupMbrsData = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'lg' })
  }


  finalSubmissionArray: any = []
  Submittest() {
    this.typesubmit = true;
    this.finalSubmissionArray = this.medicallistArr.concat(this.fixedGroupLabTests);
    if (this.form.invalid) {
      Swal.fire('Please Enter Details');
    }
    else if (this.finalSubmissionArray.length == 0) {
      Swal.fire('Please Give Medical Lab Test');
    }
    else {
      let data;
      this.form.value.grandtotal = parseInt(this.grandtotal);
      if (this.form.value.payment_mode == 'BOTH') {
        const cashAmount = parseFloat(this.form.value.cash_amount);
        const upiAmount = parseFloat(this.form.value.upi_amount);
        const grandtotal = parseFloat(this.form.value.grandtotal);
        if (isNaN(cashAmount) || isNaN(upiAmount)) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Both Cash and UPI Amounts",
            showConfirmButton: false,
            timer: 1500
          });
          return; // Exit the function if validation fails
        }
        const totalAmount = cashAmount + upiAmount;
        if (totalAmount !== grandtotal) {
          Swal.fire({
            title: "Error",
            html: `
              <div style="text-align: left;">
                <p>The total amount must be exactly equal to the grand total.</p>
                <p>Please pay <strong>${grandtotal} Rps</strong> in total (Cash + UPI).</p>
              </div>`,
            icon: "warning"
          });
          return; // Exit the function if validation fails
        }
      }

      if (this.MutipleGroupsdata.length == 0) {
        data = {
          form: this.form.value,
          groupTestdts: null,
          medicallistArr: this.finalSubmissionArray,
          user_id: localStorage.getItem('user_id'),
          usr_nm: localStorage.getItem('usr_nm'),
        };
      } else {
        let sum = 0;
        this.MutipleGroupsdata.forEach((element) => {
          sum += parseInt(element.group_amount);
        });
        var combinedTotal = sum + parseInt(this.grandtotal);
        this.form.value.grandtotal = combinedTotal;
        data = {
          form: this.form.value,
          groupTestdts: JSON.stringify(this.MutipleGroupsdata),
          medicallistArr: this.finalSubmissionArray,
          user_id: localStorage.getItem('user_id'),
          usr_nm: localStorage.getItem('usr_nm'),
          uh_id:this.form.value.uh_id
        };
      }
      this.form.value.discount_amount = this.form.value.grandtotal * this.form.value.discount_per / 100;
      this.form.value.after_discount_total = this.form.value.grandtotal - (this.form.value.grandtotal * this.form.value.discount_per / 100);
      this.form.value.after_discount_total = parseFloat(this.form.value.after_discount_total.toFixed(2));
      this.form.value.grandtotal = Math.round(parseFloat(this.form.value.grandtotal.toFixed(2)));
      this.showSpinner = true;
      const combinedArray = data.medicallistArr.map(medicine => {
        // Find the matching item in fixedGroupLabTests based on labtest_id == lab_product_id
        const matchingTest = this.labkitItems.find(test => test.lab_product_id == medicine.labtest_id);
        if (matchingTest) {
          // If a match is found, merge both objects
          return { ...matchingTest };
        }
        return null; // Return null for non-matching items
      })
        .filter(item => item !== null);
      data.kitArrayItems = combinedArray
      console.log(data,493);
      
      this.myservice.Addassign_medicaltests(data).subscribe((res: any) => {
        this.showSpinner = false;
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.typesubmit = false;
          this.form.reset();
          this.form.controls['opdoctor'].setValue('1');
          this.mainGetforAssignLabs();
          this.ngOnInit();
          this.medicallistArr = [];
          this.grandtotal = 0;
          this.PackageAmount = 0;
          this.totalLabtestforGroup = [];
          this.fixedGroupLabTests = [];
          this.finalSubmissionArray = [];
          this.MutipleGroupsdata = [];
          this.labtestsArray = [];
        } else {
          Swal.fire('Failed');
        }
      });

    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggle(index) {
    if (index) {
      this.hideselect = !this.hideselect;
    } else {
      this.hideselect = false;
      this.headerclass['background-color'] = 'blue ';
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

  printData(row) {
    sessionStorage.setItem('labprint', JSON.stringify(row))
    this.router.navigate(['lab-print']);
  }


  ////////////////////// update Patient Details 

  dataget: any;
  editdata(data: any, openmodel) {
    this.dataget = data;
    this.editForm.patchValue({
      name: this.dataget.name,
      age: this.dataget.age,
      number: this.dataget.number,
      gender: this.dataget.gender
    })
    this.modalService.open(openmodel, { size: 'xl', centered: true })
  }
  editaddroomtype() {
    this.submit = true;
    if (this.editForm.invalid) {
      alert('please enter details')
    } else {
      var data = {
        name: this.editForm.value.name,
        age: this.editForm.value.age,
        number: this.editForm.value.number,
        gender: this.editForm.value.gender,
        // transaction_id: this.editForm.value.transaction_id,
        id: this.dataget.id
      }
      this.myservice.editlabdata(data).subscribe(res => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.mainGetforAssignLabs()
          this.form.reset();
          this.modalService.dismissAll();
        } else {
          Swal.fire('Failed');
        }

      });
    }
  }

  ////////////////////// DOCTOR ASSIGN DATA LABS TEST


  opdoctorValue: string = '1'; // Default value for OP/Doctor radio button

  Opdoctor(value: string) {
    this.opdoctorValue = value;
    this.form.controls['opdoctor'].setValue(value);
    this.labtestsArray = []
    if (value === '2') {
      this.form.controls['uh_id'].reset(); // Resetting the dropdown selection
      this.form.controls['name'].reset(); // Resetting the dropdown selection
      this.form.controls['age'].reset(); // Resetting the dropdown selection
      this.form.controls['number'].reset(); // Resetting the dropdown selection
      this.form.controls['gender'].reset(); // Resetting the dropdown selection
      this.form.controls['discount_per'].reset(); // Resetting the dropdown selection
      this.form.controls['d_name'].reset(); // Resetting the dropdown selection
    }
    if (value === '1') {
      this.form.controls['uh_id'].reset(); // Resetting the dropdown selection
      this.form.controls['name'].reset(); // Resetting the dropdown selection
      this.form.controls['age'].reset(); // Resetting the dropdown selection
      this.form.controls['number'].reset(); // Resetting the dropdown selection
      this.form.controls['gender'].reset(); // Resetting the dropdown selection
      this.form.controls['discount_per'].reset(); // Resetting the dropdown selection
      this.form.controls['d_name'].reset(); // Resetting the dropdown selection
    }
  }


  doctorLabsTotal: any;
  labtestsArray: any = [];
  seedata(event) {
    var result = this.doctot_assign_labs.find(o => o.uh_id === event[1]);
    this.form.patchValue({
      name: result.name + " " + result.full_name,
      age: result.age,
      number: result.phone_number,
      uh_id: event[1],
      doctor_patient_id: event[0]
    })
    this.doctorLabsTotal = result.labs_total
    var data = {
      doctor_id: event[0],
      uh_id: event[1]
    }
    this.myservice.getdoctorsdata(data).subscribe(res => {
      this.labtestsArray = res.data;
      this.labtestsArray.map((res) => {
        if (res.amount == 0) {
          res['type'] = "GROUP"
        }
        else {
          res['type'] = "CATEGORY"
        }
      })
    });
    if (this.labtestsArray.length == 0) {
      Swal.fire('No Lab Tests Assigned');
    }

  }


  ///////////// search filter 

  submitt: boolean = false
  get validDate() {
    return this.labAssgnSearch.controls;
  }




  getTotalCost() {
    var grandTotal = 0;
    this.labAssignData?.map((res) => {
      grandTotal += parseInt(res.after_discount_total) || 0;
    })
    return grandTotal;
  }

  ////////////////////////// Delete Assigned Test //////


  deleteAssignedTest(data) {
    if (data.test_status == 'true') {
      Swal.fire({
        title: "No Access!",
        text: "Test Reports Added Can't Delete !",
        icon: "error"
      });
    }
    else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.showSpinner = true
          this.myservice.deleteAssignedTest(data).subscribe((res) => {
            this.showSpinner = false
            Swal.fire({
              title: "Deleted!",
              text: "Test has been deleted.",
              icon: "success"
            });
            this.mainGetforAssignLabs()
          })
        }
      });
    }
  }


  gotdoctorname: any = [];
  getdoctorname() {
    this.myservice.getdoctorname().subscribe((res) => {
      this.gotdoctorname = res.data;
    })
  }



  masterdata_main: any;
  forshowdisplay1: any = [];

  exportexcel(dataSource) {
    this.masterdata_main = dataSource._data._value;

    const headers = [
      'S.NO',
      'Test Assigned Date',
      'Patient Name',
      'Payment Mode',
      'Total After Discount',
    ];

    const exportData = this.masterdata_main.map((table: any) => [
      table.i,
      this.formatDate(table.date) || '-',
      table.name || '-',
      table.payment_mode || '-',
      table.after_discount_total + '/-' || '-',
    ]);

    exportData.push([
      '',
      '',
      '',
      '',
      '',
      'Total Cash', // Label for the total row
      this.cash + '/-' || '-', // The total amount in the last column
      '',
    ]);

    exportData.push([
      '',
      '',
      '',
      '',
      '',
      'Total UPI', // Label for the total row
      this.upi + '/-' || '-', // The total amount in the last column
      '',
    ]);

    exportData.push([
      '',
      '',
      '',
      '',
      '',
      'Total BOTH (Cash & UPI)', // Label for the total row
      this.both + '/-' || '-', // The total amount in the last column
      '',
    ]);

    exportData.push([
      '',
      '',
      '',
      '',
      '',
      'Total FREE', // Label for the total row
      this.free + '/-' || '-', // The total amount in the last column
      '',
    ]);

    exportData.push([
      '',
      '',
      '',
      '',
      '',
      'Total Amount', // Label for the total row
      this.grandTotal + '/-' || '-', // The total amount in the last column
      '',
    ]);

    // Get the current date if the dates are not selected
    let fromDate = this.labAssgnSearch.value.from_date;
    let toDate = this.labAssgnSearch.value.to_date;


    // If fromDate or toDate is not selected, set it to today's date
    if (!fromDate || !toDate) {
      const currentDate = new Date();
      fromDate = fromDate || currentDate;
      toDate = toDate || currentDate;
    }

    const formattedFromDate = this.formatDateToDDMMYYYY(fromDate);
    const formattedToDate = this.formatDateToDDMMYYYY(toDate);

    // Add a title, from date, and to date at the top of the sheet
    const title = [['Hospital Managemet']]; // Title row
    const dateInfo = [
      [`From Date: ${formattedFromDate}`],
      [`To Date: ${formattedToDate}`]
    ];

    // Combine title, date section, and data
    const allData = [...title, ...dateInfo, headers, ...exportData];

    // Create a new worksheet with the combined data
    const worksheet = XLSX.utils.aoa_to_sheet(allData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assign Lab Report');

    // Write the workbook to a buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the buffer and save it as an Excel file
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'Assign Lab Report.xlsx');
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
  //     'Test Assigned Date',
  //     'Patient Name',
  //     'Payment Mode',
  //     'Total After Discount',
  //   ];
  //   const exportData = this.masterdata_main.map((table: any) => [
  //     table.i,
  //     this.formatDate(table.date) || '-',
  //     table.name || '-',
  //     table.payment_mode || '-',
  //     table.after_discount_total + '/-' || '-',
  //   ]);
  //   exportData.push([
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
  //     'Total UPI', // Label for the total row
  //     this.upi + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);
  //   exportData.push([
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
  //     'Total FREE', // Label for the total row
  //     this.free + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);
  //   exportData.push([
  //     '',
  //     '',
  //     '',
  //     'Total Amount', // Label for the total row
  //     this.grandTotal + '/-' || '-', // The total amount in the last column
  //     '',
  //   ]);
  //   // Get the current date if the dates are not selected
  //   let fromDate = this.labAssgnSearch.value.from_date;
  //   let toDate = this.labAssgnSearch.value.to_date;

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
  //   pdf.save('Assign Report.pdf');
  //   this.isDownloading = false;
  // }


  labkitItems: any = []
  getlabKititems() {
    this.myservice.getlabItmsdata().subscribe((res: any) => {
      this.labkitItems = res.data;
    })
  }


}


