import { Component, ViewChild } from '@angular/core';
import { OpServicesService } from '../op-services.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.scss']
})
export class DoctorsListComponent {



  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'doctor_name', 'doctor_age', 'doctor_gender', 'doctor_number', 'doctor_dept','qualification', 'license_number', 'doctor_timings', 'de'];
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6','select10', 'select7', 'select8'];
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



  breadCrumbItems: Array<{}>;

  submitte: boolean = false

  ngOnInit(): void {
  
  }

  constructor(public formBuilder: FormBuilder, private myservice: OpServicesService,
    private router: Router, public modalService: NgbModal) {
    this.getDoctors()
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  hideme: boolean[] = [];
  data: any = [];

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  doctorData: any = [];
  getDoctors() {
    this.myservice.getDoctorsData().subscribe((res) => {
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

  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
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


  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }



  rowData: any;

  viewDetails(row, viewTemplate) {
    this.rowData = [row]
    this.modalService.open(viewTemplate, { centered: true, size: "lg" });
  }


  Goadddoctors() {
    this.router.navigate(['/op-patients/add-doctors']);
  }

  delete(id) {
    Swal.fire({
      position: 'top-end',
      title: 'Are you sure?',
      text: "Once deleted, you will not be able to recover this item!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.myservice.deletedoctor(id).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              title: 'Deleted ',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
          });
          this.getDoctors()
          }
        })
      }
    });
  }

}
