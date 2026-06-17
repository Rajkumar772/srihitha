import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { StaffServiceService } from '../staff-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'name', 'age', 'gender', 'number', 'address', 'timings',
    'deprtmnt', 'experience', 'joining_date', 'proof', 'work_exp', 'description'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6',
    'select7', 'select8', 'select9', 'select10', 'select11', 'select12', 'select13'];
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
    'backgroundColor': 'black',
    'color': 'white'
  };


  editForm: FormGroup
  staff_search: FormGroup
  submitt: boolean = false
  constructor(public router: Router, public formBuilder: FormBuilder, public modalService: NgbModal,
    public service: StaffServiceService) {
    this.editForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      timings: ['', [Validators.required]],
      deprtmnt: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      joining_date: ['', [Validators.required]],
      proof: ['', [Validators.required]],
      work_exp: ['', [Validators.required]],
      description: ['']
    })
    this.staff_search = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
    })
  }

  get validDate() {
    return this.staff_search.controls
  }

  gotostaff() {
    this.router.navigate(['/staff/add-staff'])
  }

  ngOnInit(): void {
    this.getStaff()
  }

  doctorData: any = [];
  hideme: boolean[] = [];
  department: any[];
  timings: any[];

  getStaff() {
    this.service.getStaffData().subscribe((res) => {
      
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

  SearchDATE() {
    this.submitt = true
    if (this.staff_search.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.service.getstaffsrchdata(this.staff_search.value).subscribe((res) => {
        

        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        res.data.map((res, index) => {
          res.i = ++index;
        })
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })

    }

  }



  get() {
    this.service.getdepartment().subscribe((res: any) => {
      this.department = res.data;
    });
    this.service.gettimings().subscribe((res: any) => {
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

  staff: any;
  submitted: boolean = false;
  editPatientDetails(data, editFormTempo) {
    this.staff = data.id;
    this.editForm.patchValue({
      name: data.name,
      age: data.age,
      number: data.number,
      gender: data.gender,
      timings: data.timings,
      experience: data.experience,
      description: data.description,
      address: data.address,
      deprtmnt: data.deprtmnt,
      joining_date: data.joining_date,
      proof: data.proof,
      work_exp: data.work_exp,

    });
    this.modalService.open(editFormTempo, { centered: true, size: "lg" });
  }

  editData() {
    this.submitted = true
    if (this.editForm.invalid) {
      alert("Please fill all details")
    }
    else {
      this.editForm.value.staff = this.staff;
      this.service.EditStaff(this.editForm.value).subscribe((res: any) => {
       
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Upadted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submitted = false;
          this.editForm.reset();
          this.getStaff()
          this.modalService.dismissAll();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
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












}
