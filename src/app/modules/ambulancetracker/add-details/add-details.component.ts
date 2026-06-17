import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbulancetrackerService } from '../ambulancetracker.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss']
})
export class AddDetailsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  initialValues;
  edit: boolean = false;
  nextdisplayedColumns: string[] = [
    'i',
    'tripcreatedfrom',
    'tripcreatedto',
    'patientname',
    'patientmobilenumber',
    'pickuplocation',
    'droplocation',
    'vehiclenumber',
    'drivername',
    'drivercontact',
    'remarks',
    'amount'
  ];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10', 'select11', 'select12'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any;
  age: any;
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };
  tripdatewise: FormGroup;
  submitted: boolean = false;
  ambulanceForm!: FormGroup;
  showSpinner: boolean = false;
  vehicleTypes: string[] = [
    'Basic Life Support (BLS)',
    'Advanced Life Support (ALS)',
    'Patient Transport',
    'ICU Ambulance'
  ];

  constructor(
    private fb: FormBuilder,
    private ambulanceSrv: AmbulancetrackerService
  ) { }

  ngOnInit(): void {
    this.ambulanceForm = this.fb.group({
      tripcreatedfrom: ['', Validators.required],
      tripcreatedto: ['', Validators.required],
      patientname: ['', Validators.required],
      patientmobilenumber: ['', Validators.required],
      pickuplocation: ['', Validators.required],
      droplocation: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      driverName: ['', Validators.required],
      driverContact: ['', Validators.required],
      remarks: ['', Validators.required],
      amount: ['', Validators.required],
    });
    // this.SearchDATE();
    this.getvehicledropdown();
    this.tripdatewise = this.fb.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
  }

  save() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.ambulanceForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        tripcreatedfrom: this.ambulanceForm.value.tripcreatedfrom,
        tripcreatedto: this.ambulanceForm.value.tripcreatedto,
        patientname: this.ambulanceForm.value.patientname,
        patientmobilenumber: this.ambulanceForm.value.patientmobilenumber,
        pickuplocation: this.ambulanceForm.value.pickuplocation,
        droplocation: this.ambulanceForm.value.droplocation,
        vehicleNumber: this.ambulanceForm.value.vehicleNumber,
        driverName: this.ambulanceForm.value.driverName,
        driverContact: this.ambulanceForm.value.driverContact,
        remarks: this.ambulanceForm.value.remarks,
        amount: this.ambulanceForm.value.amount,
      }
      this.ambulanceSrv.adddetails(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.ambulanceForm.reset();
          this.showSpinner = false;
        } else {
          Swal.fire('Failed');
          this.showSpinner = false;
        }
      })
    }
  }
  get f() {
    return this.ambulanceForm.controls
  }
  casefiledata: any;
  totalAmount: any;
  SearchDATE() {
    this.ambulanceSrv.getAmbulances(this.tripdatewise.value).subscribe((res: any) => {
      this.showSpinner = false;
      this.casefiledata = res.data;
      res.data.map((res, index) => res.i = ++index);
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalAmount = res.data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      
    }, error => {
      this.showSpinner = false;
    });
  }


  //table code Star
  applyFilter(event: any) {
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

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.headerclass['background-color'] = event.target.value;
  }
  getdata: any = []
  getvehicledropdown() {
    this.ambulanceSrv.getvehicledropdown().subscribe((res: any) => {
      this.showSpinner = false;
      this.getdata = res.data;
   
    })
  }
  selectvehiclenumber(event: any) {
  


  }

}
