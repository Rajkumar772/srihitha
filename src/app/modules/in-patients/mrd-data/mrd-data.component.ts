import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-mrd-data',
  templateUrl: './mrd-data.component.html',
  styleUrls: ['./mrd-data.component.scss']

})






export class MrdDataComponent implements OnInit {


  showSpinner: boolean = false

  searchFilterForm: FormGroup;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  nextdisplayedColumns: string[] = ['i', 'uh_id', 'ip_number', 'mrd_no', 'name_of_the_patient	', 'date_of_discharge', 'time_of_discharge', 'mrd_date', 'mrd_time',
    'submitted_by', 'hand_over', 'update'
  ];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3'];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'black',
    'color': 'white'
  };

  updateFormMRD: FormGroup;



  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private service: InPatienrservicesService,
    private router: Router, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.mainGetcall()


    this.updateFormMRD = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      ip_number: ['', [Validators.required]],
      mrd_no: ['', [Validators.required]],
      name_of_the_patient: ['', [Validators.required]],
      date_of_discharge: ['', [Validators.required]],
      time_of_discharge: ['', [Validators.required]],
      mrd_date: ['', [Validators.required]],
      mrd_time: ['', [Validators.required]],
      submitted_by: ['', [Validators.required]],
      hand_over: ['', [Validators.required]],
      record_id: ['']
    })


    this.searchFilterForm = this.formBuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]]
    })




  }




  SearchDATE() {
    this.submitt = true;

    if (this.searchFilterForm.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'please fill details',
        icon: 'error',
        timer: 1500
      })
    }
    else {
      this.showSpinner = true
      this.service.getSearchForMRDreports(this.searchFilterForm.value).subscribe((res: any) => {
        this.showSpinner = false
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
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }
  }














  submitt: boolean = false
  get validDate() {
    return this.searchFilterForm.controls;
  }





  submitted: boolean = false
  get validMrd() {
    return this.updateFormMRD.controls;
  }




  mainGetcall() {
    this.showSpinner = true
    this.service.mrddatareportsget().subscribe((res: any) => {
      this.showSpinner = false
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  //////////////////////// medicine code  end *****************************************
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
      this.headerclass['background-color'] = 'black';
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

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }



  updateMRDdetails(data, editFormTempo) {

    this.updateFormMRD.patchValue({
      uh_id: data.uh_id,
      ip_number: data.ip_number,
      mrd_no: data.mrd_no,
      name_of_the_patient: data.name_of_the_patient,
      date_of_discharge: data.date_of_discharge,
      time_of_discharge: data.time_of_discharge,
      mrd_date: data.mrd_date,
      mrd_time: data.mrd_time,
      submitted_by: data.submitted_by,
      hand_over: data.hand_over,
      record_id: data.id
    });
    this.modalService.open(editFormTempo, { centered: true, size: "lg" });
  }

  updateMRDForm() {
    this.submitted = true

    if (this.updateFormMRD.invalid) {
      alert("Please fill all details")
    }
    else {

      this.service.updateMRDrecord(this.updateFormMRD.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Upadted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submitted = false;
          this.updateFormMRD.reset();
          this.mainGetcall()
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

}
