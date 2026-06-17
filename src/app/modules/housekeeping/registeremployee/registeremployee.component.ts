import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { HrmoduleserviceService } from '../hrmoduleservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { HousekeepingService } from '../housekeeping.service';


@Component({
  selector: 'app-registeremployee',
  templateUrl: './registeremployee.component.html',
  styleUrls: ['./registeremployee.component.scss']
})
export class RegisteremployeeComponent implements OnInit {

  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i','edit','view', 'employeementthrough', 'empidmanual', 'title', 'full_name', 'email', 'phone', 'address_1', 'emergency_name', 'emergency_phone', 'secondaryemergency_name', 'secondaryemergency_phone', 'qualification', 'department', 'designation', 'date_of_joining'];
  selectColumns: string[] = ['selectSlno','select2','select17', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10', 'select11', 'select12', 'select13', 'select14', 'select15', 'select16'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any;
  age: any; adddepartment: FormGroup; adddesignation: FormGroup;
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: HousekeepingService) {
    this.addemployeedetailsform = this.formBuilder.group({
      full_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],

      address_1: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.pattern('^[a-zA-Z0-9\\s,./#-]+$')
        ]
      ],
      emergency_name: ['', Validators.required],
      emergency_phone: ['', Validators.required],
      secondaryemergency_name: ['', Validators.required],
      secondaryemergency_phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      qualification: ['', Validators.required],
      employeementthrough: ['', Validators.required],
      empidmanual: ['', Validators.required],
      title: ['', Validators.required],
      referaldetails: ['']
    });
    this.adddepartment = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })

    this.adddesignation = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
    this.updateform = this.formBuilder.group({
      assigned_date: ['', [Validators.required]],
      area: ['', [Validators.required]],
      floornumber: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });


  }

  user_id: any;
  usr_nm: any;
  user_role: any;
  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.user_role = localStorage.getItem("user_role");

    // this.updateform = this.formBuilder.group({
    //   update_roomtype: ['', [Validators.required]]
    // })
    this.getroomtypedata();
  }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }
  numericOnly(event): boolean {
    let patt = /^([0-9,.,_,/-])$/;
    let result = patt.test(event.key);
    return result;
  }

  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any = [];
  getroomtypedata() {
    this.service.gethousekeeping().subscribe(res => {
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
  dataget: any;
  ////dynamicaaly add dropdown options department


  subs: boolean = false

  ///add designation dropdown code starts

  // form: FormGroup;
  //   forFieldsform: FormGroup
  ngSelectControls = new FormControl();
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }
  modalDismissemployee(addNew) {
    this.modalService.dismissAll(addNew)
  }
  fullname: any; phone: any; ids: any;

  editdata(data: any, openmodel) {
    this.dataget = data;
    this.fullname = this.dataget.full_name;
    this.phone = this.dataget.phone;
    // this.updateform.patchValue({
    //   update_roomtype: this.dataget.roomtype,

    // })
    this.modalService.open(openmodel, { size: 'xl', centered: true })
  }

  editaddroomtype() {
    if (this.updateform.invalid) {
      alert("Please enter details");
    }
    else {
      var data = {
        assigned_date: this.updateform.value.assigned_date,
        area: this.updateform.value.area,
        floornumber: this.updateform.value.floornumber,
        remarks: this.updateform.value.remarks,
        id: this.dataget.id,
        'fullname': this.fullname,
        'phone': this.phone,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      
      this.service.assignworktype(data).subscribe(res => {
        if (res.status == 200) {
          alert('successfully updated');
          this.getroomtypedata();
          this.showSpinner = false;
          this.addemployeedetailsform.reset();
          this.modalService.dismissAll();
        }
      },
        error => {
          this.showSpinner = false;
        });
    }
  }

  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }

  equipmentData: any=[];
  record123(viewModal, row) {
    var data = {
      'main_id': row.id,
    }
    this.service.viewhousekeepingreport(data).subscribe((res) => {
      this.equipmentData = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'xl' })
  }

}
