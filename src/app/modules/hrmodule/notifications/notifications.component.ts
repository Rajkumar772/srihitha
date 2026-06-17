import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
import { HrmoduleserviceService } from '../hrmoduleservice.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
 addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'department', 'title', 'purpose'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3'];
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
  backgroundColor: '#bb9c23',
  color: 'rgb(41 115 70 / 97%)',
  paddingTop: '4px',
  paddingBottom: '4px',
  lineHeight: '1.1'
};
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: HrmoduleserviceService) { }

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.addemployeedetailsform = this.formBuilder.group({
      department: ['', [Validators.required]],
      title: ['', [Validators.required]],
      purpose: ['', [Validators.required]],
    });
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]]
    })
    this.getroomtypedata();
    this.getdepartmentdropdowndata();
  }
  typesubmit: boolean = false

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

exportTable() {
  TableUtil.exportTableToExcel('exportTable', 'room-types'); // table id, file name
}

  
  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.addemployeedetailsform.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        department: this.addemployeedetailsform.value.department,
        title: this.addemployeedetailsform.value.title,
        purpose: this.addemployeedetailsform.value.purpose,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.service.addnotifications(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.addemployeedetailsform.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any;
  getroomtypedata() {
    this.service.getnotifications().subscribe(res => {
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
  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }



  departmentdropdown; any = [];
  designationdropdown: any = [];
  //////department code starts
  getdepartmentdropdowndata() {
    this.service.getdepartmentdropdown().subscribe(res => {
      this.showSpinner = false;
      this.departmentdropdown = res.data;
      
    })
  }
}
