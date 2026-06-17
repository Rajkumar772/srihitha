import { Component, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DiagnosticServicesService } from '../diagnostic-services.service';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-diagnostic-tests',
  templateUrl: './add-diagnostic-tests.component.html',
  styleUrls: ['./add-diagnostic-tests.component.scss']
})
export class AddDiagnosticTestsComponent implements OnInit {

  adddiagnTestForm: FormGroup;


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'd_test_date', 'd_test_name', 'd_test_amount', 'view']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4'];
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



  now: any;

  showSpinner: boolean = false;

  editdiagnTestForm: FormGroup

  constructor(public router: Router, private formbuilder: FormBuilder, private service: DiagnosticServicesService,
    private modalService: NgbModal, public datePipe: DatePipe) {


    this.now = datePipe.transform(new Date(), "yyyy-MM-dd");


    this.adddiagnTestForm = this.formbuilder.group({

      d_test_date: [this.now, [Validators.required]],
      d_test_name: [, [Validators.required]],
      d_test_amount: ['', [Validators.required]],

    });

    this.editdiagnTestForm = this.formbuilder.group({

      d_test_date: [this.now, [Validators.required]],
      d_test_name: [, [Validators.required]],
      d_test_amount: ['', [Validators.required]],
      id: ['']

    });

  }

  clcick() {
    this.router.navigate(['/diagnostic-tests/Assign-diagnostic-tests'])
  }

  ngOnInit(): void {
    this.getTestnames();
  }


  submitted: boolean = false;


  get valid() {
    return this.adddiagnTestForm.controls;
  }




  AddTest() {
    this.submitted = true

    if (this.adddiagnTestForm.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }

    else {
      this.showSpinner = true
      
      var data = {
        d_test_date: this.adddiagnTestForm.value.d_test_date,
        d_test_name: this.adddiagnTestForm.value.d_test_name,
        d_test_amount: this.adddiagnTestForm.value.d_test_amount,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm')
      }
      this.service.adddiagnoTest(data).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            title: 'Submitted Successfully',
            position: 'top-end',
            icon: 'success',
            timer: 1500,
          })
          this.adddiagnTestForm.reset()
          this.modalService.dismissAll()
          this.getTestnames()
          this.submitted = false
          this.adddiagnTestForm.get('d_test_date').setValue(this.now);
        }
        else {
          Swal.fire({
            title: 'Failed',
            position: 'top-end',
            icon: 'error',
            timer: 1500,
          })
        }
      })
    }

  }




  getTestnames() {
    this.showSpinner = true;
    this.service.getdiagnosticTests().subscribe((res) => {
      this.showSpinner = false;
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




  openPopupview(openPopup) {
    this.modalService.open(openPopup, { size: 'lg', centered: true })
  }






  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  dismiss() {
    this.modalService.dismissAll();
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

  submitt: boolean = false;


  get validEdit() {
    return this.editdiagnTestForm.controls;
  }


  record(viewModal, row) {
    this.editdiagnTestForm.patchValue({
      d_test_date: row.d_test_date,
      d_test_name: row.d_test_name,
      d_test_amount: row.d_test_amount,
      id: row.id
    })
    this.modalService.open(viewModal, { size: 'lg', centered: true })

  }


  editTest() {
    this.submitt = true

    if (this.editdiagnTestForm.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      this.showSpinner = true
      this.service.editdiagnoTest(this.editdiagnTestForm.value).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            title: 'Submitted Successfully',
            position: 'top-end',
            icon: 'success',
            timer: 1500,
          })
          this.modalService.dismissAll()
          this.getTestnames()
          this.submitt = false
        }
        else {
          Swal.fire({
            title: 'Failed',
            position: 'top-end',
            icon: 'error',
            timer: 1500,
          })
        }
      })
    }
  }

  dltTest() {
    Swal.fire({
      title: "Do you want to Delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner = true
        this.service.dltdiagnoTest(this.editdiagnTestForm.value).subscribe((res) => {
          this.showSpinner = false
          if (res.status == 200) {
            Swal.fire({
              title: 'Submitted Successfully',
              position: 'top-end',
              icon: 'success',
              timer: 1500,
            })
            this.modalService.dismissAll()
            this.getTestnames()
            this.submitted = false
          }
          else {
            Swal.fire({
              title: 'Failed',
              position: 'top-end',
              icon: 'error',
              timer: 1500,
            })
          }
        })
      }
    });
  }

  exportTable(i, organizer_name) {
    TableUtil.exportTableToExcel(i, organizer_name);
  }


  gjhsf() {
    Swal.fire('Alert Title', 'Alert message here', 'warning');
  }


}
