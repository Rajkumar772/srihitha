import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PharmaserviceService } from '../pharmaservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicine-manufacturers',
  templateUrl: './medicine-manufacturers.component.html',
  styleUrls: ['./medicine-manufacturers.component.scss']
})
export class MedicineManufacturersComponent implements OnInit {


  pharma_manfacturer: FormGroup;
  editform: FormGroup;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'manufacturer_name', 'edit']
  selectColumns: string[] = ['select1', 'select2'];
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

  constructor(
    private service: PharmaserviceService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public router: Router
  ) { }


  ngOnInit(): void {
    this.pharma_manfacturer = this.formBuilder.group({
      manufacturer_name: ['', [Validators.required]],
      user_id: [''],
      usr_nm: [''],
    });
    this.editform = this.formBuilder.group({
      manufacturer_name: ['', [Validators.required]],
      id: [''],
      user_id: [''],
      usr_nm: [''],
    });
    this.getmadallogindata();
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



  get valid() {
    return this.pharma_manfacturer.controls
  }

  get validEdit() {
    return this.editform.controls
  }

  typesubmit: boolean = false;

  submitted: boolean = false;
  Submit() {
    this.submitted = true;
    if (this.pharma_manfacturer.invalid) {
      alert('please fill the details');
      return;
    } else {
      this.pharma_manfacturer.value.user_id = localStorage.getItem('user_id'),
        this.pharma_manfacturer.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.addpharmaManfactures(this.pharma_manfacturer.value).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Successfully Submitted',
              showConfirmButton: false,
              timer: 1500,
            });
            this.submitted = false;
            this.pharma_manfacturer.reset();
            this.getmadallogindata()
          } else {
            Swal.fire('Failed');
          }
        });
    }
  }



  getmadallogindata() {
    this.service.getpharmaManfacturers().subscribe((res) => {
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


  editdata: any;


  showSpinner: boolean = false;





  modalDismiss() {
    this.modalService.dismissAll();
  }


  exportTable(id, name) {

    TableUtil.exportTableToExcel(id, name);
  }

  clcick() {
    this.router.navigate(['/pharmacy/suppliers'])
  }
  user_id: any

  editMedicines(editDltTempo, row) {
    this.editdata = row;
    this.editform.patchValue({
      manufacturer_name: row.manufacturer_name,
      id: row.id
    });
    this.modalService.open(editDltTempo, { size: 'xl', centered: true });
  }


  updtMdcnssdts() {
    this.typesubmit = true
    if (this.editform.invalid) {
      alert("Please fill all details")
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please fill all details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.editform.value.user_id = localStorage.getItem('user_id'),
        this.editform.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.editManfacturersDts(this.editform.value).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Successfully Upadted",
              showConfirmButton: false,
              timer: 1500,
            });
            this.submitted = false;
            this.editform.reset();
            this.getmadallogindata()
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



  dltMdcnsdts() {

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
        this.service.dltmanufacturer(this.editform.value).subscribe((res) => {
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
            this.getmadallogindata()
          }

        })

      }
    })
  }




}
