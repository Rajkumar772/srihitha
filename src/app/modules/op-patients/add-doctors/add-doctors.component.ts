import { Component, ViewChild } from '@angular/core';
import { OpServicesService } from '../op-services.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { ka } from 'date-fns/esm/locale';

@Component({
  selector: 'app-add-doctors',
  templateUrl: './add-doctors.component.html',
  styleUrls: ['./add-doctors.component.scss']
})
export class AddDoctorsComponent {

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'doctor_name', 'doctor_age', 'doctor_gender', 'doctor_number', 'doctor_dept','qualification', 'license_number', 'doctor_timings'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6','select10', 'select7', 'select8'];
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

  breadCrumbItems: Array<{}>;
  addDoctorForm: FormGroup;
  addNew: FormGroup;
  addNewtime: FormGroup;
  submitte: boolean = false

  showSpinner: boolean = false
  ngOnInit(): void {

    this.get();
  }
  constructor(public formBuilder: FormBuilder, private myservice: OpServicesService,
    private router: Router, public modalService: NgbModal) {

    this.addDoctorForm = this.formBuilder.group({
      doctor_name: ["", [Validators.required]],
      doctor_age: ["", [Validators.required]],
      doctor_gender: ["", [Validators.required]],
      doctor_number: ["", [Validators.required]],
      doctor_address: ["", [Validators.required]],
      license_number: ["", [Validators.required]],
      doctor_timings: ["", [Validators.required]],
      doctor_charges: [""],
      doctor_dept: ["", [Validators.required]],
      doctor_experience: ["", Validators.required],
      qualification:["",[Validators.required]],
      doctor_email: [""],
      description: [""],
      user_id: [''],
      usr_nm: [''],
    });
    this.addNew = this.formBuilder.group({
      new_type: [""]
    });
    this.addNewtime = this.formBuilder.group({
      new_time: [""]
    })

    this.getDoctors()
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  get valid() {
    return this.addDoctorForm.controls
  }


  addDoctor() {
    this.submitte = true;
    this.showSpinner = true
    if (this.addDoctorForm.invalid) {
      this.showSpinner = false
      return;
    } else {
      this.addDoctorForm.value.user_id = localStorage.getItem('user_id'),
        this.addDoctorForm.value.usr_nm = localStorage.getItem('usr_nm'),
        this.myservice.Add_doctor(this.addDoctorForm.value).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Successfully Submitted',
              showConfirmButton: false,
              timer: 1500
            });
            this.showSpinner = false
            this.submitte = false;
            this.addDoctorForm.reset();
            this.getDoctors();
          } else {
            Swal.fire('Failed');
            this.showSpinner = false
          }
        })
    }
  }



  hideme: boolean[] = [];
  data: any = [];


  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  doctorData: any = [];
  getDoctors() {
    this.myservice.getDoctorsData().subscribe((res) => {
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


  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }



  gotodoctorslist() {
    this.router.navigate(['/op-patients/doctors-list']);
  }

  department: any[];
  timings: any[];

  get() {
    this.myservice.getdepartment().subscribe((res: any) => {
      this.department = res.data;
    });
    this.myservice.gettimings().subscribe((res: any) => {
      this.timings = res.data;
    });
  }

  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.addnewtype(openPopforNew)
    }
  }

  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  dis() {
    this.modalService.dismissAll()
  }

  sub: boolean = false;
  subs: boolean = false;
  submitNew() {
    this.sub = true
    if (this.addNew.invalid) {
      alert("Please Add Type")
    }
    else {
      var data = {
        'name': this.addNew.value.new_type
      }
      this.myservice.addNewdepartment(data).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            title: "Good job!",
            text: "New Department Type Added",
            icon: "success"
          })
          this.modalService.dismissAll()
          this.addNew.reset()
          this.get()
        }
      })
    }
  }

  submitNewtime() {
    this.subs = true
    if (this.addNewtime.invalid) {
      alert("Please Add Type")
    }
    else {
      var data = {
        'name': this.addNewtime.value.new_time
      }
      this.myservice.addNewtimings(data).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            title: "Good job!",
            text: "New Timing Added",
            icon: "success"
          })
          this.modalService.dismissAll()
          this.addNew.reset()
          this.get()
        }
      })
    }
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


  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }

  rowData: any;

  viewDetails(row, viewTemplate) {
    this.rowData = [row]
    this.modalService.open(viewTemplate, { centered: true, size: "lg" });
  }



}
