import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { AmbulancetrackerService } from '../ambulancetracker.service';



@Component({
  selector: 'app-ambulanceanalysis',
  templateUrl: './ambulanceanalysis.component.html',
  styleUrls: ['./ambulanceanalysis.component.scss']
})
export class AmbulanceanalysisComponent implements OnInit {
 dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  nextdisplayedColumns: string[] = ['i', 'department', 'designation', 'date_of_joining', 'employeementthrough', 'empidmanual', 'title', 'full_name', 'gender', 'email', 'phone', 'address_1', 'emergency_name', 'emergency_phone', 'secondaryemergency_name', 'secondaryemergency_phone', 'qualification', 'referaldetails'];
  selectColumns: string[] = ['selectSlno', 'select11', 'select12', 'select13', 'select16', 'select17', 'select18', 'select2', 'select24', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10', 'select19'];
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
  constructor(private service: AmbulancetrackerService) {

  }
  ngOnInit(): void {
    this.getmovablecount();
    // this.getroomtypedata();

  }

  getCardGradient(index: number): string {
    const hue = (index * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 70%, 40%))`;
  }


  departmentwisecounts: any = []
  getmovablecount() {
    // this.service.hremployeeanalysis().subscribe((res: any) => {
    //   this.departmentwisecounts = res.data;
    // })
  }

  showSpinner: boolean = false;
  casefiledata: any = [];

  selectedDepartmentTitle: string = '';

  ondeparmentselect(dept: any) {
    this.selectedDepartmentTitle = dept.department;
    let departmentName = dept.department;
    let status = dept.status;
    if (departmentName.includes('Total')) {
      departmentName = null;
    } else {
      departmentName = departmentName
        .replace(/(Active|Terminated|Resigned)?\s*Employees/i, '')
        .trim();
    }
    const data = {
      department: departmentName,
      status: status
    };
    // this.service.gethrdepartmentcardwisedata(data).subscribe(res => {
    //   this.showSpinner = false;
    //   res.data.map((res, index) => {
    //     res.i = ++index;
    //   });
    //   this.masterdata = res.data;
    //   this.dataSource = new MatTableDataSource(res.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
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
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }
}
