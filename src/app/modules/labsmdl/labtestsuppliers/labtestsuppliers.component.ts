import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { raceWith } from 'rxjs';
import { LabsServicesService } from '../labs-services.service';

@Component({
  selector: 'app-labtestsuppliers',
  templateUrl: './labtestsuppliers.component.html',
  styleUrls: ['./labtestsuppliers.component.scss']
})
export class LabtestsuppliersComponent implements OnInit {

  submitlabtestSupplierForm: FormGroup;
  editlabtestSupplierForm: FormGroup;
  submitted: boolean;
  submittedd: boolean;
  showSpinner: boolean;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

  nextdisplayedColumns: string[] = ['i', 'supplier_name', 'supplier_number', 'supp_landline_no', 'supplier_address', 'supplier_gst',
    'dl_no1', 'dl_no2', 'edit']
  selectColumns: string[] = ['select1', 'select2', 'select3',];

  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'dodgerblue ',
    'color': 'white'
  };

  constructor(private formBuilder: FormBuilder,
    private myservice: LabsServicesService,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    this.submitlabtestSupplierForm = this.formBuilder.group({
      supplier_name: ['', Validators.required],
      supplier_number: ['', Validators.required],
      supplier_gst: ['', Validators.required],
      supplier_address: ['', Validators.required],
      supp_landline_no: ['',],
      dl_no1: ['', [Validators.required]],
      dl_no2: ['', [Validators.required]],
      user_id: [''],
      usr_nm: [''],
    });

    this.editlabtestSupplierForm = this.formBuilder.group({
      supplier_name: ['', Validators.required],
      supplier_number: ['', Validators.required],
      supplier_gst: ['', Validators.required],
      supplier_address: ['', Validators.required],
      supp_landline_no: ['',],
      dl_no1: ['', [Validators.required]],
      dl_no2: ['', [Validators.required]],
      edit_id: ['']
    });

    this.getlabtestSupplierdata();
  }

  get valid() {
    return this.submitlabtestSupplierForm.controls;
  }

  get validEdit() {
    return this.editlabtestSupplierForm.controls;
  }

  submitlabtestSupplier() {
    this.submitted = true
    if (this.submitlabtestSupplierForm.invalid) {
      Swal.fire({
        icon: 'question',
        title: 'Fill All Details',
        text: 'Required',
        timer: 1500
      })
    }
    else {
      this.submitlabtestSupplierForm.value.user_id = localStorage.getItem('user_id'),
        this.submitlabtestSupplierForm.value.usr_nm = localStorage.getItem('usr_nm'),
        this.showSpinner = true;
      this.myservice.submitlabtestSupplier(this.submitlabtestSupplierForm.value).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully submitted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.getlabtestSupplierdata()
          this.submitlabtestSupplierForm.reset()
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

  getlabtestSupplierdata() {
    this.myservice.getlabtestSupplierdata().subscribe((res) => {
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

  editLabsupplierdts(editLabSupplierTmpo, row) {
    this.editlabtestSupplierForm.patchValue({
      supplier_name: row.supplier_name,
      supplier_number: row.supplier_number,
      supplier_gst: row.supplier_gst,
      supp_landline_no: row.supp_landline_no,
      dl_no1: row.dl_no1,
      dl_no2: row.dl_no2,
      supplier_address: row.supplier_address,
      edit_id: row.id
    })
    this.modalService.open(editLabSupplierTmpo, { size: 'lg', centered: true })
  }

  updtLabSpplrsdts() {
    this.submittedd = true
    if (this.editlabtestSupplierForm.invalid) {
      Swal.fire({
        icon: 'question',
        title: 'Fill All Details',
        text: 'Required',
        timer: 1500
      })
    }
    else {
      this.myservice.updtLabSpplrsdts(this.editlabtestSupplierForm.value).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully updated",
            showConfirmButton: false,
            timer: 1500,
          });
          this.getlabtestSupplierdata()
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

  dltLabSpplrsdts() {
    var data = {
      id: this.editlabtestSupplierForm.value.edit_id
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
        this.myservice.dltLabSpplrsdts(data).subscribe((res) => {
          this.showSpinner = false;
          if (res.status == 200) {
            Swal.fire({
              title: 'DELETED',
              position: 'top-end',
              text: 'DELETED SUCCESSFULLY',
              icon: 'success',
              timer: 1500
            })
            this.modalService.dismissAll()
            this.getlabtestSupplierdata()
          }

        })

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
