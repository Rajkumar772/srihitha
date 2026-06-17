import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';


import { take } from "rxjs";
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LabsServicesService } from '../labs-services.service';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-lab-tests-reports',
  templateUrl: './lab-tests-reports.component.html',
  styleUrls: ['./lab-tests-reports.component.scss']
})
export class LabTestsReportsComponent {


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'date', 'uh_id', 'name', 'age', 'number', 'grandtotal',
    'completed_date', 'view_tests', 'view_results']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7'];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  showSpinner: boolean = false
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

  data: any;
  grand_total: any;
  date: any;
  submitt: boolean = false
  Labtest_srch: FormGroup

  ngOnInit(): void {
    this.mainGetCall();


  }

  business_ind: any
  labresultvalEdit: any
  constructor(private location: Location, public formBuilder: FormBuilder, public route: ActivatedRoute,
    private router: Router, public modalService: NgbModal,
    public myservice: LabsServicesService) {


    this.Labtest_srch = this.formBuilder.group({
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],

    })
    this.labresultvalEdit = this.formBuilder.group({
      lab_result: ['', [Validators.required]],
      result_id: ['', [Validators.required]],
      uh_id: ['', [Validators.required]],
      labtest_id: ['', [Validators.required]],
      id: ['', [Validators.required]]
    })
  }

  get validDate() {
    return this.Labtest_srch.controls
  }

  SearchDATE() {
    this.submitt = true;
    if (this.Labtest_srch.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'please fill details',
        icon: 'error',
        timer: 1500
      })
    }
    else {
      this.myservice.getlabsrchdata(this.Labtest_srch.value).subscribe((res: any) => {
        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        res.data.map((res, index) => {
          res.i = ++index;
        })

        this.labAssignData = []
        this.labAssignData = res.data;
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
  }

  tempoForResult: any;

  editLabRsltval(row, tempoForResult) {

    this.labresultvalEdit.patchValue({
      lab_result: row.value,
      result_id: row.id,
      uh_id: row.uh_id,
      labtest_id: row.labtest_id,
      id: row.patient_group_tests_id
    })

    this.tempoForResult = this.modalService.open(tempoForResult, { centered: true, size: 's' });
  }

  sub: boolean = false
  get validResult() {
    return this.labresultvalEdit.controls;
  }

  UpdateResultVal(showResults) {
    this.sub = true
    if (this.labresultvalEdit.invalid) {
      Swal.fire({
        position: "top-end",
        icon: "question",
        title: "Please Fill Details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.showSpinner = true
      this.myservice.updateEachLabtestResultval(this.labresultvalEdit.value).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          this.sub = false;
          this.modalService.dismissAll()
          this.callthisFunctiontoLift(this.labresultvalEdit.value, showResults)
          this.labresultvalEdit.reset();
        } else {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Oops...",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
    }
  }

  callthisFunctiontoLift(data1, showResults) {
    this.showSpinner = true
    this.myservice.getLabResultsEach(data1).subscribe((res) => {
      this.showSpinner = false
      this.resultsLab = res.data
    })
    this.modalService.open(showResults, { centered: true, size: 'lg' });
  }

  getlabreport() {
    this.myservice.getlabreport().subscribe((res) => {
    })
  }

  gotoaddlabs() {
    this.router.navigate(['/labsmdl/Assign-lab-tests'])
  }

  mainGetCall() {
    this.myservice.getmedicalreports().subscribe((res: any) => {
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.labAssignData = []
      this.labAssignData = res.data;
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  Testsdata: any;
  centerModal(centerDataModal: any, data) {
    this.grand_total = data.grandtotal;
    var data2 = {
      id: data.id,
    }
    this.myservice.getparticularlabdetials(data2).subscribe((res: any) => {
      this.Testsdata = res.data;
    })
    this.modalService.open(centerDataModal, { centered: true, size: 'lg' });
  }

  data1: any;
  resultsLab: any;
  test_assign_date: any
  completed_date: any;
  d_name: any;


  showLabResults(table, showResults) {
    this.d_name = table.d_name
    this.gender = table.gender
    this.test_assign_date = table.date
    this.completed_date = table.completed_date
    this.data1 = {
      'uh_id': table.uh_id,
      'completed_date': table.completed_date,
      'id': table.id,
    }
    this.myservice.getLabResultsEach(this.data1).subscribe((res) => {
      this.resultsLab = res.data;
    })
    // this.modalService.open(showResults, { centered: true, size: 'lg' });
    this.callthisFunctiontoLift(this.data1, showResults)
  }

  gender: any
  printResults(resultsLab) {
    this.modalService.dismissAll()
    sessionStorage.setItem('assigned_date', this.test_assign_date)
    sessionStorage.setItem('completed_date', this.completed_date)
    sessionStorage.setItem('d_name', this.d_name)
    sessionStorage.setItem('gender', this.gender)
    sessionStorage.setItem('labresults', JSON.stringify(resultsLab))
    this.router.navigate(['/lbresultsprint'])
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


  exportTable(i, organizer_name) {
    TableUtil.exportTableToExcel(i, organizer_name);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.headerclass['background-color'] = event.target.value;
  }

  labAssignData: any;

  getTotalCost() {
    var grandTotal = 0;
    this.labAssignData?.map((res) => {
      grandTotal += parseInt(res.after_discount_total) || 0;
    })
    return grandTotal;
  }


}
