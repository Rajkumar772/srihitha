import { Component, ViewChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NuresserviceService } from '../nuresservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nursingtraining',
  templateUrl: './nursingtraining.component.html',
  styleUrls: ['./nursingtraining.component.scss']
})
export class NursingtrainingComponent implements OnInit {
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;
  // nextdisplayedColumns: string[] = ['i', 'drill_date','startTime','location','conductedby','totalparticipants','fireofficername','typeofdrill'];
  nextdisplayedColumns: string[] = [
  'i', 
  'trainingid', 
  'name', 
  'department', 
  'trainingprogramname', 
  'trainingtype', 
  'startdate', 
  'enddate', 
  'Duration', 
  'traininglocation'
];
  selectColumns: string[] = ['selectSlno','select1','select2','select3','select4','select5','select6','select7','select8','select9'];
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
  uh_id: any
  trainingform: FormGroup;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: NuresserviceService) {
    this.trainingform = this.formBuilder.group({
      trainingid: ['', [Validators.required]],
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      trainingprogramname: ['', [Validators.required]],
      trainingtype: ['', [Validators.required]],
      startdate: ['', [Validators.required]],
      enddate: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      traininglocation: ['', [Validators.required]],
    })
  }

  user_id: any;
  usr_nm: any; startTime = '';

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.getroomtypedata();
  }


  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  exportColumns: string[] = ['i', 'roomtype'];  
  exportTable() {
    // TableUtil.exportTableToExcel('exportTable', 'room-types');
  }


  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.trainingform.invalid) {
      alert("Please enter details");
      this.showSpinner  = false
      return
    } else {
      var data = {
        trainingid: this.trainingform.value.trainingid,
        name: this.trainingform.value.name,
        trainingprogramname: this.trainingform.value.trainingprogramname,
         department: this.trainingform.value.department,
        trainingtype: this.trainingform.value.trainingtype,
        startdate: this.trainingform.value.startdate,
        enddate: this.trainingform.value.enddate,
        duration: this.trainingform.value.duration,
        traininglocation: this.trainingform.value.traininglocation,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      
      this.service.drillpost(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.trainingform.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }
  get f() {
    return this.trainingform.controls
  }
  showSpinner: boolean = false;
  casefiledata: any;
  getroomtypedata() {
    this.service.getnursetrainingdata().subscribe(res => {
     
      this.showSpinner = false;
      this.casefiledata = res.data;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.showSpinner = false;
    })
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
  patients_data: any = [];

}
