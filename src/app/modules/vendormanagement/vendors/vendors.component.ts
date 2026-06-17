import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { VendorserviceService } from '../vendorservice.service';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  submitfromtotime: FormGroup;
  editSupplierForm: FormGroup;
  submitted: boolean;
  submittedd: boolean;
  showSpinner: boolean;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

  nextdisplayedColumns: string[] = ['i', 'name', 'number', 'vendor_type', 'vendor_address', 'vendor_category', 'edit']
  selectColumns: string[] = ['select1', 'select2', 'select3',];

  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
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

  constructor(private formBuilder: FormBuilder,
    private service: VendorserviceService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.submitfromtotime = this.formBuilder.group({
      vendor_name: ['', Validators.required],
      vendor_number: ['', Validators.required],
      vendor_category: ['', Validators.required],
      vendor_address: ['', Validators.required],
      vendor_type: ['', Validators.required],
      user_id: [''],
      usr_nm: [''],
    });

    this.editSupplierForm = this.formBuilder.group({
      vendor_name: ['', Validators.required],
      vendor_number: ['', Validators.required],
      vendor_category: ['', Validators.required],
      vendor_address: ['', Validators.required],
      vendor_type: ['', Validators.required],
      edit_id: [''],
      user_id: [''],
      usr_nm: [''],
    });

    this.getsupplierdata();
  }

  get valid() {
    return this.submitfromtotime.controls;
  }

  get validEdit() {
    return this.editSupplierForm.controls;
  }



  getsupplierdata() {
    this.service.getsupplierdata().subscribe((res) => {
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  clcick() {
    this.router.navigate(['/pharmacy/additems'])
  }

  submitSupplier() {
    this.submitted = true
    if (this.submitfromtotime.invalid) {
      Swal.fire({
        icon: 'question',
        title: 'Fill All Details',
        text: 'Required',
        timer: 1500
      })
    }
    else {
      this.submitfromtotime.value.user_id = localStorage.getItem('user_id'),
        this.submitfromtotime.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.vendordata(this.submitfromtotime.value).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully submitted",
              showConfirmButton: false,
              timer: 1500,
            });
            this.getsupplierdata()
            this.submitfromtotime.reset()
            this.showSpinner = false;
            this.submitted = false;
          }
          else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Not Submiited",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    }
  }



  editsupplierdts(editSupplierTmpo, row) {
    this.editSupplierForm.patchValue({
      vendor_name: row.name,
      vendor_number: row.number,
      vendor_category: row.vendor_category,
      vendor_type: row.vendor_type,

      vendor_address: row.vendor_address,
      edit_id: row.id
    })
    this.modalService.open(editSupplierTmpo, { size: 'lg', centered: true })
  }


  updtSpplrsdts() {
    this.submittedd = true
    if (this.editSupplierForm.invalid) {
      Swal.fire({
        icon: 'question',
        title: 'Fill All Details',
        text: 'Required',
        timer: 1500
      })
    }
    else {
      this.editSupplierForm.value.user_id = localStorage.getItem('user_id'),
        this.editSupplierForm.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.updatevendorsdata(this.editSupplierForm.value).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully updated",
              showConfirmButton: false,
              timer: 1500,
            });
            this.getsupplierdata()
            this.showSpinner = false;
            this.submittedd = false;
            this.modalService.dismissAll()
          }
          else {
            Swal.fire({
              position: "top-end",
              icon: "error",
              title: "Not updated",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
    }
  }


  dltSpplrsdts() {
    var data = {
      id: this.editSupplierForm.value.edit_id
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
        this.showSpinner = true;
        // this.service.dlteSupplrdts(data).subscribe((res) => {
        //   this.showSpinner = false;
        //   if (res.status == 200) {
        //     Swal.fire({
        //       title: 'DELETED',
        //       position: 'top-end',
        //       text: 'DELETED SUCCESSFULLY',
        //       icon: 'success',
        //       timer: 1500
        //     })
        //     this.modalService.dismissAll()
        //     this.getsupplierdata()
        //   }

        // })

      }
    })
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
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
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
  modalDismiss() {
    this.modalService.dismissAll();
  }
  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }
  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }

}
