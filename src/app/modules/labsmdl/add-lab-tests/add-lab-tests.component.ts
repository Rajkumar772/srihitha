import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { LabsServicesService } from '../labs-services.service';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-add-lab-tests',
  templateUrl: './add-lab-tests.component.html',
  styleUrls: ['./add-lab-tests.component.scss']
})
export class AddLabTestsComponent {

  form: FormGroup;
  forFieldsform: FormGroup
  ngSelectControl = new FormControl();



  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'category', 'labtest', 'amount', 'view', 'edit']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4',];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = '';
  category: any;
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



  Editform: FormGroup;
  user_id: any;
  usr_nm: any;

  constructor(public formBuilder: FormBuilder, private myservice: LabsServicesService, public route: ActivatedRoute, private router: Router, public datePipe: DatePipe, public modalService: NgbModal) {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.form = this.formBuilder.group({
      category: ['', [Validators.required]],
      lab_type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });

    this.forFieldsform = this.formBuilder.group({
      field_name: ['', [Validators.required]],
      field_range: ['', [Validators.required]],
      field_units: ['', [Validators.required]]
    });

    this.Editform = this.formBuilder.group({
      lab_type: ['', [Validators.required]],
      amount: ['', [Validators.required]],
    });

    this.addCategory = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })


    this.get();
  }

  clcick() {
    this.router.navigate(['/labsmdl/Assign-lab-tests'])
  }

  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewtype(openPopforNew)
    }
  }

  dis(addNew) {
    this.modalService.dismissAll(addNew)
  }

  subs: boolean = false
  addCategory: FormGroup

  submitCategory(): void {
    this.subs = true;
    const inputValue = this.addCategory.value.new_type.trim();
    if (inputValue === '') {
      this.addCategory.get('new_type').setErrors({ required: true });
    }
    if (this.addCategory.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue
    };
    this.subs = true;
    this.myservice.Categorytype(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Procedure Category Type Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.addCategory.reset();
          this.subs = false;
          this.get();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Category Type Already exist!',
            timer: 1500
          })
          this.get();
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Category Type',
          icon: 'error'
        });
      }
    );
  }

  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  ngOnInit(): void {
    this.get()
  }

  get type() {
    return this.form.controls;
  }

  get valid() {
    return this.addCategory.controls
  }


  forStoringFields: any = []
  addBothFields() {
    if (this.forFieldsform.invalid || this.form.invalid) {
      Swal.fire('Please Give Details');
    } else {
      this.forStoringFields.push({
        'field_name': this.forFieldsform.value.field_name,
        'field_range': this.forFieldsform.value.field_range,
        'field_units': this.forFieldsform.value.field_units
      })
      this.forFieldsform.reset()
    }
  }

  typesubmit: boolean;
  typeSubmit() {
    this.typesubmit = true;
    if (this.form.invalid) {
      Swal.fire('Please Fill Lab Details');
    }
    else if (this.forStoringFields.length == 0) {
      Swal.fire('Add Fields');
    }
    else {
      var data = {
        data1: this.form.value,
        data2: this.forStoringFields,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.myservice.add_labtest(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.form.reset();
          this.get();
          this.forStoringFields = []
          this.typesubmit = false;
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  data: any

  get() {
    this.myservice.get_labtest().subscribe((res: any) => {
      this.data = res.data;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.myservice.getCategory().subscribe((res: any) => {
      this.category = res.data;
    });

  }

  remove(index) {
    this.forStoringFields.splice(index, 1);
  }

  delete() {
    var data = {
      id: this.updateData.id
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure to delete it ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.myservice.delete_labtest(data).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            this.get();
            this.modalService.dismissAll()
          }
        })
      }
    });
  }


  updateData: any;
  centerModal(centerDataModal, data) {
    this.updateData = data;
    this.Editform.patchValue({
      lab_type: data.labtest,
      amount: data.amount,
    })
    this.modalService.open(centerDataModal, { centered: true, size: 'lg' });
  }


  close23() {
    this.modalService.dismissAll()
  }


  edit() {
    if (this.Editform.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Enter details',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.updateData.labtest = this.Editform.value.lab_type;
      this.updateData.amount = this.Editform.value.amount;
      this.updateData.id = this.updateData.id;
      this.myservice.editDtls(this.updateData).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.get();
          this.modalService.dismissAll();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  labtestdlsData: any;
  record123(viewModal, row) {
    var data = {
      'group_id': row.id,
    }
    this.myservice.getlabtestFields(data).subscribe((res) => {
      this.labtestdlsData = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'lg' })
  }


  paymentload: boolean = false;
  paymentslot(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload = true
    } else if (as == 'CASH') {
      this.paymentload = false
    }
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


  exportTable(i, organizer_name) {
    TableUtil.exportTableToExcel(i, organizer_name);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.headerclass['background-color'] = event.target.value;
  }

  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
