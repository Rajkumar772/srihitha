
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { FireserviceService } from '../fireservice.service';

@Component({
  selector: 'app-mockdrill',
  templateUrl: './mockdrill.component.html',
  styleUrls: ['./mockdrill.component.scss']
})
export class MockdrillComponent implements OnInit {
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;
  nextdisplayedColumns: string[] = ['i', 'drill_date','startTime','location','conductedby','totalparticipants','fireofficername','typeofdrill'];
  selectColumns: string[] = ['selectSlno','select1','select2','select3','select4','select5','select6','select7'];
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
  drillform: FormGroup;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: FireserviceService) {
    this.drillform = this.formBuilder.group({
      drill_date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      location: ['', [Validators.required]],
      conductedby: ['', [Validators.required]],
      totalparticipants: ['', [Validators.required]],
      fireofficername: ['', [Validators.required]],
      typeofdrill: ['', [Validators.required]]
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
    TableUtil.exportTableToExcel('exportTable', 'room-types');
  }


  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.drillform.invalid) {
      alert("Please enter details");
      this.showSpinner  = false
      return
    } else {
      var data = {
        drill_date: this.drillform.value.drill_date,
        startTime: this.drillform.value.startTime,
        location: this.drillform.value.location,
        conductedby: this.drillform.value.conductedby,
        totalparticipants: this.drillform.value.totalparticipants,
        fireofficername: this.drillform.value.fireofficername,
        typeofdrill: this.drillform.value.typeofdrill,
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
          this.drillform.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }
  get f() {
    return this.drillform.controls
  }
  showSpinner: boolean = false;
  casefiledata: any;
  getroomtypedata() {
    this.service.getmockdrilldata().subscribe(res => {
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
