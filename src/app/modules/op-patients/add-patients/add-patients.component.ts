import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OpServicesService } from '../op-services.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';


@Component({
  selector: 'app-add-patients',
  templateUrl: './add-patients.component.html',
  styleUrls: ['./add-patients.component.scss']
})

export class AddPatientsComponent {
  typeValidationForm: FormGroup;
  currentDate: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  initialValues;

  restOfColumns: string[] = [];

  nextdisplayedColumns: string[] = ['i', 'patient_type', 'uh_id',
    'name', 'age', 'gender', 'phone_number', 'address', 'doctor_name', 'card_type', 'card_appointment_type', 'consultant_fee',
    'payment_types', 'payment_way',
    'expiry_date', 'after_discount_total', 'i_ts', 'print', 'date',];
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


  constructor(private modalService: NgbModal, private router: Router, private service: InPatienrservicesService,
    public formBuilder: FormBuilder, public datePipe: DatePipe, private myservice: OpServicesService, private inpatientservice: InPatienrservicesService) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  user_id: any
  usr_nm: any;

  ngOnInit(): void {
    // this.getroomtypedata();

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.getdoctorname()
    this.getDoctors();

    this.gotDataAllpatients();
    this.gotBackDatesOP();
    this.getoplastnumbers();
    this.getcarddatadropdown();

    this.typeValidationForm = this.formBuilder.group({
      op_date: [this.currentDate, [Validators.required]],
      patient_type: ['', [Validators.required]],
      // lastname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      yandm: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      // guardian: [],
      aadhar: [''],
      // marital_status: ['', [Validators.required]],
      title: ['', [Validators.required]],
      reffered_by: [''],
      address: ['', [Validators.required]],
      description: [''],
      payment_types: ['CASH',],
      card_type: ['', [Validators.required]],
      card_appointment_type: ['', [Validators.required]],
      consultant_fee: ['',],
      days_to_expiry: [14, [Validators.required]],
      expiry_date: [''],
      dpt_name: [''],
      d_name: ['', [Validators.required]],
      old_uhid_no: [''],
      cash_cashless: [''],
      payment: [''],
      transcation_id: [''],
      discount_per: ['0', [Validators.required]],
      discount_amount: [''],
      after_discount_total: [''],
      user_id: [''],
      usr_nm: [''],
      cash_amount: [''],
      upi_amount: [''],
      referaldoctorname: ['']
    });
  }

  gotAllpatients: any;
  showSpinner: boolean = false;
  gotDataAllpatients() {
    this.showSpinner = true
    this.myservice.getAllPateintDtsfill().subscribe((res) => {
      this.showSpinner = false
      this.gotAllpatients = res.data;
    });
  }


  numericOnly(event): boolean {
    let patt = /^([0-9,.,_,/-])$/;
    let result = patt.test(event.key);
    return result;
  }


  typesubmit: boolean = false
  get type() {
    return this.typeValidationForm.controls;
  }

  insurance_data: any


  stopPmntMode: boolean = true;
  doctorData: any;
  getDoctors() {
    this.myservice.getDoctorsData().subscribe((res) => {
      this.doctorData = res.data;
    });
  }

  autoFdoctor(e) {
    this.doctorData.map((res) => {
      if (res.doctor_name == e) {
        this.typeValidationForm.patchValue({
          dpt_name: res.doctor_dept,
        });
      }
    });
  }

  patientTypeCond: boolean = false
  getPatientype(e: any) {
    this.typeValidationForm.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      phone_number: '',
      address: '',
      reffered_by: '',
      // guardian: '',
      description: '',
      card_type: '',
      yandm: '',
    })
    this.typeValidationForm.get('consultant_fee').setValue(0);
    this.typeValidationForm.get('days_to_expiry').setValue(14);
    if (e == 'NEW') {
      this.patientTypeCond = false
      this.typeValidationForm.patchValue({
        patient_type: e
      })
    }
    else if (e == 'OLD') {
      this.patientTypeCond = true
      this.typeValidationForm.patchValue({
        patient_type: e
      })
    }
  }

  selectOpnumber(e) {
    this.typeValidationForm.patchValue({
      old_uhid_no: '',
      name: '',
      age: '',
      gender: '',
      patient_type: '',
      phone_number: '',
      address: '',
      reffered_by: '',
      // guardian: '',
      description: '',
      card_type: '',
      yandm: ''
    })
    this.typeValidationForm.get('consultant_fee').setValue(0);
    this.typeValidationForm.get('days_to_expiry').setValue(14);
    var results = this.gotAllpatients.filter(item => item.uh_id === e);
    if (results.length) {
      this.typeValidationForm.patchValue({
        old_uhid_no: results[0].uh_id,
        name: results[0].name,
        age: results[0].age,
        gender: results[0].gender,
        yandm: results[0].yandm,
        // marital_status: results[0].marital_status,
        patient_type: 'OLD',
        phone_number: results[0].phone_number,
        address: results[0].address,
        card_type: results[0].card_type || '-',
        card_appointment_type: results[0].card_appointment_type || '-',
        consultant_fee: results[0].consultant_fee,
        d_name: results[0].doctor_name,
        dpt_name: results[0].doctor_department,
        referaldoctorname: results[0].referaldoctorname
      })
      this.getOldOp(results[0].uh_id);
    }
  }

  expiryDateIfOld: any;
  dated: any;
  checkingGotValue: any;
  stopcardtype: boolean = true;


  getOldOp(e: any) {
    const data = { uh_id_no: e };
    this.myservice.checkCardRnwlforUho(data).subscribe((res) => {


      if (!res?.data || res.data.length === 0) {
        return;
      }
      const latestRecord = res.data
        .filter(r => r.expiry_date) // safety
        .sort((a, b) =>
          new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime()
        )[0];
      if (!latestRecord) {
        return;
      }
      this.expiryDateIfOld = latestRecord.expiry_date;
      const expiryDate = new Date(latestRecord.expiry_date); // YYYY-MM-DD
      const today = new Date();
      expiryDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      // ===============================
      // ✅ CARD EXPIRED → RENEWAL
      // ===============================
      if (expiryDate < today) {

        Swal.fire({
          icon: 'error',
          title: 'Do Card Renewal',
          text: 'Required',
          timer: 1400
        });

        this.stopPmntMode = true;
        this.stopcardtype = true;
        this.checkingGotValue = "CARD OVER";

        this.typeValidationForm.patchValue({
          days_to_expiry: 14,
        });
      }
      else {
        Swal.fire({
          icon: 'success',
          title: 'Card Still Exists',
          timer: 1400
        });

        this.stopPmntMode = false;
        this.stopcardtype = false;
        this.checkingGotValue = "CARD EXISTS";

        this.typeValidationForm.patchValue({
          payment_types: 'No Payment Need',
          consultant_fee: 0,
          discount_per: 0,
          days_to_expiry: 0,
          patient_type: 'OLD',
          card_type: latestRecord.card_type,
          card_appointment_type: latestRecord.card_appointment_type
        });
      }

    });
  }

  private parseDate(dateString: string, format: string): Date | null {
    const parts = dateString.split('/');
    // Ensure the string is in the correct format with three parts (day, month, year)
    if (parts.length === 3) {
      let day, month, year;
      if (format === 'dd/MM/yyyy') {
        day = +parts[0];
        month = +parts[1] - 1; // Month is 0-based in JS
        year = +parts[2];
      } else {
        return null;
      }
      const parsedDate = new Date(year, month, day);
      // Validate the date (check if it's a valid date)
      if (parsedDate instanceof Date && !isNaN(parsedDate.getTime()) && parsedDate.getDate() === day && parsedDate.getMonth() === month) {
        return parsedDate;
      }
    }
    return null; // Return null if parsing fails or it's an invalid date
  }

  cashorCashless: Boolean = false
  payment_type: Boolean = true
  timeslot1(event: any) {
    var a = event.value;
    this.typeValidationForm.get('cash_cashless')?.reset();
    this.typeValidationForm.get('payment')?.reset();
    this.typeValidationForm.get('transcation_id')?.reset();
    if (a == "CASHLESS") {
      this.cashorCashless = true;
      this.payment_type = false;
      this.typeValidationForm.get('consultant_fee').setValue(0);
      this.typeValidationForm.get('days_to_expiry').setValue(14);
      this.typeValidationForm.get('discount_per').setValue(0);
      this.upi_type = 'CASH';
    } else if (a == "CASH") {
      this.payment_type = true;
      this.cashorCashless = false;
      this.typeValidationForm.get('consultant_fee').setValue(0);
      this.typeValidationForm.get('days_to_expiry').setValue(14);
    }
  }

  selectedCardType: string = ''; // Stores the selected card type

  selectcardtype(event: any) {
    this.selectedCardType = event?.value ?? event;
    this.typeValidationForm.get('card_appointment_type')?.setValue('');
    this.typeValidationForm.get('consultant_fee')?.setValue('');

    const data = {
      selectedcardtype: this.selectedCardType
    };
    this.inpatientservice.getconsultant_type(data).subscribe((res: any) => {
      this.consultantcatdtype = res?.data || [];
      // ✅ Patch amount in same function (auto pick first record)
      if (this.consultantcatdtype.length > 0) {
        const first = this.consultantcatdtype[0];   // {amount:"1000", roomtype:"Emergency", ...}
        const fee = Number(first?.amount || 0);
        this.typeValidationForm.patchValue({
          consultant_fee: fee,
          // optional: set appointment type also from first row
          card_appointment_type: first?.roomtype || ''
        });
      } else {
        // no data found
        this.typeValidationForm.patchValue({
          consultant_fee: 0,
          card_appointment_type: ''
        });
      }
    });
  }
  selectdemaratology: any
  selectdemaratologytype(event: any): void {
    // ng-select gives either string OR object -> handle both
    const selectedAppointment = event?.value ?? event;
    this.selectdemaratology = selectedAppointment;

    // (optional) reset fee before API comes
    this.typeValidationForm.patchValue({
      card_appointment_type: selectedAppointment || '',
      consultant_fee: 0
    });

    const data = {
      selectedcardtype: this.selectedCardType,
      selectedappointment: selectedAppointment
    };
    this.inpatientservice.getappointmentamount_type(data).subscribe((res: any) => {
      const d = res?.data;
      let amount = 0;
      if (Array.isArray(d) && d.length > 0) {
        amount = Number(d[0]?.amount ?? d[0]?.fee ?? d[0]?.consultant_fee ?? 0);
      } else if (d && typeof d === 'object') {
        amount = Number(d?.amount ?? d?.fee ?? d?.consultant_fee ?? 0);
      } else {
        amount = Number(d ?? 0);
      }

      this.typeValidationForm.patchValue({
        consultant_fee: amount
      });


    }, (err) => {

      this.typeValidationForm.patchValue({ consultant_fee: 0 });
    });
  }


  selectplasticsurgytype(event: any): void {
    const selectplasticsurgytype = event;
    let fee = 0;
    switch (selectplasticsurgytype) {
      case 'General Plastic Surgery':
        fee = 500;
        break;
      case 'Emergency Plastic Surgery':
        fee = 800;
        break;
      case 'Repeat Card OP':
        fee = 0;
        break;
      case 'Free Card OP':
        fee = 0;
        break;
      default:
        fee = 0;
    }
    this.typeValidationForm.get('consultant_fee').setValue(fee);
  }

  upi_type: string;
  showTwoAmounts: string;
  upidr(event: string) {
    this.upi_type = event;
    this.showTwoAmounts = event;

    // Reset the form fields based on the payment type
    if (event === 'CASH') {
      this.clearFields(['upi_amount', 'transcation_id']); // Clear UPI related fields
    }
    else if (event === 'UPI') {
      this.clearFields(['cash_amount', 'transcation_id']); // Clear CASH related fields
    }
    else if (event === 'BOTH') {
      this.clearFields(['cash_amount', 'upi_amount']); // Clear both CASH and UPI amounts
    }
  }

  // Helper function to reset fields
  clearFields(fields: string[]) {
    fields.forEach(field => {
      this.typeValidationForm.get(field)?.setValue('');
    });
  }


  functionFordates() {
    const gotPatientType = this.typeValidationForm.get('patient_type')?.value;
    const opDate = new Date(this.typeValidationForm.value.op_date);
    if (!gotPatientType) {
      Swal.fire({
        icon: 'question',
        title: 'Give Patient Type',
        text: 'Required',
        timer: 1400
      });
      return;
    }
    if (gotPatientType === 'NEW') {
      const DAYS = Number(this.typeValidationForm.value.days_to_expiry || 0);
      opDate.setDate(opDate.getDate() + DAYS);
      this.typeValidationForm.patchValue({
        expiry_date: opDate.toISOString().split('T')[0]
      });
    }
    if (gotPatientType === 'OLD') {
      if (this.checkingGotValue === 'CARD EXISTS') {
        this.typeValidationForm.patchValue({
          days_to_expiry: 0,
          expiry_date: this.expiryDateIfOld,
          consultant_fee: 0
        });
      }
      if (this.checkingGotValue === 'CARD OVER') {
        const DAYS = Number(this.typeValidationForm.value.days_to_expiry || 0);
        opDate.setDate(opDate.getDate() + DAYS);
        this.typeValidationForm.patchValue({
          expiry_date: opDate.toISOString().split('T')[0]
        });
      }
    }
  }



  submitForm() {
    this.typesubmit = true;
    if (this.typeValidationForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: "question",
        title: "Please Give required Details",
        showCancelButton: false,
        timer: 1400
      });
      return; // Exit the function if form is invalid
    }

    // Handle "No Payment Need"
    else if (this.typeValidationForm.value.payment_types == "No Payment Need") {
      this.typeValidationForm.value.payment_types = 'No Payment Need';
      this.typeValidationForm.value.cash_cashless = '-';
      this.typeValidationForm.value.payment = '-';
      this.typeValidationForm.value.transcation_id = '-';
      this.callthisFunctionToSubmit();
    }
    else {
      // Validate payment type
      if (this.typeValidationForm.value.payment_types == '') {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Select Mode of Payment',
          text: 'Required',
          showCancelButton: false,
          timer: 1400
        });
        this.showSpinner = false;
        return; // Exit if no payment type selected
      }

      // Cash Payment validation
      else if (this.typeValidationForm.value.payment_types == 'CASH' &&
        (this.typeValidationForm.value.payment == '' || this.typeValidationForm.value.payment == null)) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Select Payment Way',
          text: 'Required',
          showCancelButton: false,
          timer: 1400
        });
        this.showSpinner = false;
        return; // Exit if Cash payment way is not selected
      }

      // Cashless Payment validation
      else if (this.typeValidationForm.value.payment_types == 'CASHLESS' &&
        (this.typeValidationForm.value.cash_cashless == '' || this.typeValidationForm.value.cash_cashless == null)) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Select Insurance Type',
          text: 'Required',
          showCancelButton: false,
          timer: 1400
        });
        this.showSpinner = false;
        return;
      }
      if (this.typeValidationForm.value.payment_types == 'CASH' && this.typeValidationForm.value.payment == 'BOTH') {
        const cashAmount = parseFloat(this.typeValidationForm.value.cash_amount);
        const upiAmount = parseFloat(this.typeValidationForm.value.upi_amount);
        const consultantFee = parseFloat(this.typeValidationForm.value.consultant_fee);
        if (isNaN(cashAmount) || isNaN(upiAmount)) {
          Swal.fire({
            position: "top-end",
            icon: "question",
            title: "Please Enter Both Cash and UPI Amounts",
            showConfirmButton: false,
            timer: 1500
          });
          return;
        }
        const totalAmount = cashAmount + upiAmount;
        if (totalAmount !== consultantFee) {
          Swal.fire({
            title: "Error",
            html: `
                <div style="text-align: left;">
                  <p>The total amount must be exactly equal to the consultant fee.</p>
                  <p>Please pay <strong>${consultantFee} Rps</strong> in total (Cash + UPI).</p>
                </div>`,
            icon: "warning"
          });
          return;
        }
      }
      this.callthisFunctionToSubmit();
    }
  }




  callthisFunctionToSubmit() {
    this.functionFordates();
    this.showSpinner = true
    this.typeValidationForm.value.discount_amount = this.typeValidationForm.value.consultant_fee * this.typeValidationForm.value.discount_per / 100;
    this.typeValidationForm.value.after_discount_total =
      this.typeValidationForm.value.consultant_fee - (this.typeValidationForm.value.consultant_fee * this.typeValidationForm.value.discount_per / 100)
    this.typeValidationForm.value.after_discount_total = parseFloat(this.typeValidationForm.value.after_discount_total.toFixed(2));
    this.typeValidationForm.value.user_id = localStorage.getItem('user_id');
    this.typeValidationForm.value.usr_nm = localStorage.getItem('usr_nm');
    console.log(this.typeValidationForm.value);

    // this.myservice.addpatients(this.typeValidationForm.value).subscribe((res: any) => {
    //   if (res.status == 200) {
    //     Swal.fire({
    //       position: "top-end", icon: "success", title: "Successfully Submitted",
    //       showConfirmButton: false, timer: 1400
    //     });
    //     this.showSpinner = false;
    //     this.typesubmit = false;
    //     this.typeValidationForm.reset();
    //     this.ngOnInit();
    //     this.checkingGotValue = ''
    //     this.expiryDateIfOld = ''
    //     this.stopPmntMode = true
    //     this.patientTypeCond = false;
    //     window.location.reload()
    //   } else {
    //     Swal.fire("Failed");
    //     this.showSpinner = false;
    //   }
    // });
  }

  clcick() {
    this.router.navigate(["/op-patients/op-patients-list"]);
  }

  formatDateString(dateString: string): string {
    if (dateString) {
      let dateParts = dateString.split('/');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to ISO format (YYYY-MM-DD)
    }
    return dateString;
  }

  gotTodayrevenuedata: any;
  patientsdata: any;
  grandTotal: any;
  cash: any;
  upi: any;
  both: any;

  gotBackDatesOP() {
    this.showSpinner = true;
    this.myservice.getBackDatesOP().subscribe((res: any) => {
      this.showSpinner = false;
      this.gotTodayrevenuedata = res.data;
      this.grandTotal = 0;
      this.cash = 0;
      this.upi = 0;
      this.both = 0;
      this.gotTodayrevenuedata.forEach((item) => {
        const total = parseInt(item.after_discount_total) || 0;
        this.grandTotal += total;
        if (item.payment_way === 'CASH') {
          this.cash += total;
        } else if (item.payment_way === 'UPI') {
          this.upi += total;
        } else if (item.payment_way === 'BOTH') {
          this.both += total;
        }
      });

      // Add index to each item in the data
      res.data.forEach((item, index) => {
        item.i = index + 1;
      });
      // Setup data for the table
      this.masterdata = res.data;
      this.patientsdata = res.data;
      this.clonedata = this.masterdata;
      // Initialize MatTableDataSource and paginator/sorter
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // Log for debugging
    });
  }




  //////mat table
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      'Total Amount',
    ];

    const exportData = this.masterdata_main.map((table: any) => [
      table.i,
      this.formatDate(table.date) || '-',
      table.card_appointment_type || '-',
      table.name || '-',
      table.address || '-',
      table.payment_way || 'FREE',
      table.after_discount_total + '/-' || '-'
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
      'Total Amount', // Label for the total row
      this.grandTotal + '/-' || '-', // The total amount in the last column
      '',
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exportData]); // Create sheet with headers and data
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'OP Report'); // Append the sheet to the workbook

    // Save the Excel file using file-saver
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


  printData(row) {
    sessionStorage.setItem('opprint', JSON.stringify(row))
    this.router.navigate(['op-print']);
  }

  print(row) {
    sessionStorage.setItem('vitalprint', JSON.stringify(row))
    this.router.navigate(['vital-print']);
  }

  lastnum: any;
  getoplastnumbers() {
    this.myservice.getoplastnumbers().subscribe((res) => {
      this.lastnum = res.data;
    });
  }

  gotdoctorname: any = [];

  getdoctorname() {
    this.myservice.getdoctorname().subscribe((res) => {
      this.gotdoctorname = res.data;
    })
  }

  changepn(e) {
    this.gotdoctorname.map((res) => {
      if (res.doctor_name == e) {
        this.typeValidationForm.patchValue({
          dpt_name: res.doctor_dept,
        });
      }
    });
  }
  selectedPatient: any
  searchByPhone() {
    const phone = this.typeValidationForm.get('phone_number')?.value;
    if (!phone) {
      this.typeValidationForm.reset();
      this.dataSource.data = [...this.masterdata];
      return;
    }
    if (phone.length !== 10) {
      return;
    }
    const filteredRecords = this.masterdata.filter(
      item => item.phone_number === phone
    );

    if (filteredRecords.length > 0) {
      this.typeValidationForm.patchValue(filteredRecords[0]);
      this.dataSource.data = filteredRecords;
    } else {
      this.dataSource.data = [];
    }
  }


  consultantcatdtype: any = []
  // getroomtypedata() {
  //   var data = {
  //     'selectedcardtype': this.selectedCardType
  //   }

  // }
  getcardoptions: any = []
  getcarddatadropdown() {
    this.service.getcard_type().subscribe(res => {
      this.showSpinner = false;
      this.getcardoptions = res.data;

    })
  }
  showcrdreferaldoctor: boolean = false;
  referedbydoctorname(event: any) {

    if (event == 'Doctor') {
      this.showcrdreferaldoctor = true;
    } else {
      this.showcrdreferaldoctor = false;
    }
  }
}