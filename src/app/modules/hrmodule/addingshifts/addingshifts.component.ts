import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HrmoduleserviceService } from '../hrmoduleservice.service';
import { TableUtil } from 'src/app/tableUtil';
@Component({
  selector: 'app-addingshifts',
  templateUrl: './addingshifts.component.html',
  styleUrls: ['./addingshifts.component.scss']
})
export class AddingshiftsComponent implements OnInit {
  Registerform: FormGroup;
  formBuilder: any;
  submitted: boolean;
  item_image: any;
  filetypes: any;
  reviewimg: string;
  imagedata: { item_image: string; filetype: any; }[];
  review: boolean;
  showSpinner: boolean = false;
  //  displayedColumns: string[] = ['id', 'image'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;
  nextdisplayedColumns: string[] = ['i', 'empname', 'number', 'fromdate', 'todate', 'shifttype'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5'];
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

  dataSource!: MatTableDataSource<any>;
  searchKey: string = ''; user_idadmin: any; addshifttimings: FormGroup
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private service: HrmoduleserviceService, private modalService: NgbModal) {
    this.Registerform = this.fb.group({
      // category_name         : ['', [Validators.required]],
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
      shifttype: ['', [Validators.required]],
      employeename: ['', [Validators.required]],
      department: ['', [Validators.required]]
    });
    this.addshifttimings = this.fb.group({
      new_type: ['', [Validators.required]]
    })
    this.user_idadmin = localStorage.getItem('user_role')
  }
  ngOnInit(): void {
    this.getleavereportdata();
    this.user_idadmin = localStorage.getItem('user_role');
    this.gotDataAllemployeedata();
    this.getdepartmentdropdowndata();
  }

  categoryubmit() {
    this.showSpinner = true;
    this.submitted = true;
    if (this.Registerform.invalid) {
      alert("Please enter details");

    }
    else {
      const empValue = this.Registerform.value.employeename; // "Raj Kumar1"
      var empnameid = empValue.split(',');
      var empname = empnameid[0];
      var empid = empnameid[1];
      var data = {
        fromdate: this.Registerform.value.fromdate,
        todate: this.Registerform.value.todate,
        shifttype: this.Registerform.value.shifttype,
        empname: empname,
        empid: empid,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        number: localStorage.getItem('number'),
      };
      this.service.addshiftemployee(data).subscribe((res: any) => {
        if (res.status == 200) {
          this.showSpinner = false;
          alert('success');
          this.review = false;
          this.getleavereportdata();
          this.Registerform.reset();
          empname = '';
          empid = '';
        } else {
          this.showSpinner = false;
          alert('failed');
        }
      });
    }
  }



  get valid() {
    return this.Registerform.controls;
  }


  casefiledata: any = [];
  getleavereportdata() {
    var data = {
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      user_role: localStorage.getItem('user_role'),
    }
    this.service.getshiftsdata(data).subscribe(res => {
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
 



  popupImgUrl: string = '';
  isImgPopupOpen: boolean = false;


  imagepopup(url: string) {
    if (!url) return;

    const cleanUrl = url.toLowerCase().split('?')[0];

  
    if (cleanUrl.endsWith('.pdf')) {
      window.open(url, '_blank');
      return;
    }

    // ✅ If Image -> open your existing modal
    this.popupImgUrl = url;
    this.isImgPopupOpen = true;
  }

  closeImgPopup() {
    this.isImgPopupOpen = false;
    this.popupImgUrl = '';
  }
  isPdf(url: string): boolean {
    if (!url) return false;
    return url.toLowerCase().split('?')[0].endsWith('.pdf');
  }

  get f() {
    return this.Registerform.controls
  }

  statusList = [
    { label: 'Pending', value: 'NULL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' }
  ];

  getStatusClass(st: any) {
    const s = String(st ?? 'NULL').toUpperCase();
    return {
      'st-blue': (s === 'NULL' || s === 'PENDING'),
      'st-green': (s === 'APPROVED'),
      'st-red': (s === 'REJECTED')
    };
  }



  // when api loads, convert null -> 'NULL' so dropdown selects correctly
  patchStatus(rows: any[]) {
    rows.forEach(r => r.status = r.status ? r.status.toString().toUpperCase() : 'NULL');
  }



  onStatusChange(row: any) {
    const st = String(row.status ?? 'NULL').toUpperCase();
    const prev = String(row._prevStatus ?? 'NULL').toUpperCase();

    // display text only (for user)
    const displayStatus = (st === 'NULL') ? 'PENDING' : st;

    if (st === 'NULL' || st === 'APPROVED') {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to set status to ${displayStatus}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // ✅ keep saving actual value (NULL/APPROVED)
          row.status = st;
          this.updateStatus(row, null);
        } else {
          row.status = prev;
        }
      });
      return;
    }

    if (st === 'REJECTED') {
      Swal.fire({
        title: 'Reject Reason',
        input: 'text',
        inputPlaceholder: 'Enter reason',
        inputValidator: (value) => !value ? 'Reject reason is required' : undefined,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          row.status = 'REJECTED';
          this.updateStatus(row, result.value);
        } else {
          row.status = prev;
        }
      });
    }
  }

  updateStatus(row: any, rejectReason: string | null) {
    const payload = {
      id: row.id,
      status: row.status,
      reject_reason: rejectReason,
      user_id: row.user_id
    };
   
    this.service.updateLeaveStatus(payload).subscribe((res) => {
      // Swal.fire('Updated Successfully', '', 'success');
      if (res.status == 200) {
        this.showSpinner = false;
        alert('success');
        this.review = false;
        this.getleavereportdata();
        this.Registerform.reset();
      } else {
        this.showSpinner = false;
        alert('failed');
      }
    });
  }

  getemployeelistdata: any;
  // showSpinner: boolean = false;
  gotDataAllemployeedata() {
    this.showSpinner = true
    this.service.getemployeelist().subscribe((res) => {
      // this.showSpinner = false
      this.getemployeelistdata = res.data;
      

    });
  }
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }




  /////adding shift timings
  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }
  dis(addNew) {
    this.modalService.dismissAll(addNew)
  }
  form: FormGroup;
  forFieldsform: FormGroup
  ngSelectControl = new FormControl();
  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewtype(openPopforNew)
    }
  }
  subs: boolean = false;
  submitCategory(): void {
    this.subs = true;
    const inputValue = this.addshifttimings.value.new_type.trim();
    if (inputValue === '') {
      this.addshifttimings.get('new_type').setErrors({ required: true });
    }
    if (this.addshifttimings.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      number: localStorage.getItem('number'),
    };
    this.subs = true;
  
    this.service.shifttimingsadd(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Shift Timings Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.addshifttimings.reset();
          this.getdepartmentdropdowndata();
          this.subs = false;
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Shift Timings Type Already exist!',
            timer: 1500
          })
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Shift Timings',
          icon: 'error'
        });
      }
    );
  }
  departmentdropdown; any = [];
  shifttimings: any = [];
  //////department code starts
  getdepartmentdropdowndata() {
    this.service.getshifttimingsdropdown().subscribe(res => {
      this.showSpinner = false;
      this.shifttimings = res.data;
      
    })
  }
    modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }
}
