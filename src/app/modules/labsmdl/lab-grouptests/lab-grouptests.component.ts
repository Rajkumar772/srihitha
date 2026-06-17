import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { LabsServicesService } from '../labs-services.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';



@Component({
  selector: 'app-lab-grouptests',
  templateUrl: './lab-grouptests.component.html',
  styleUrls: ['./lab-grouptests.component.scss']
})
export class LabGrouptestsComponent {

  groupTestForm: any;

  groupCategoryForm: any;




  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'group_name', 'group_package_amount', 'view', 'edit']
  selectColumns: string[] = ['select1', 'select2', 'select3',];
  hideselect: boolean = false;
  isDownloading: boolean = false;
  editForm: FormGroup;
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

  doctor_patient_dts: FormGroup
  grouptestDts: FormGroup

  AddnewgroupCategoryForm: FormGroup;
  user_id: any;
  usr_nm: any;

  constructor(public formBuilder: FormBuilder, private myservice: LabsServicesService, public route: ActivatedRoute, private router: Router,
    public datePipe: DatePipe, public modalService: NgbModal) {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.groupTestForm = this.formBuilder.group({
      group_name: ['', Validators.required],
      group_package_amount: ['', Validators.required],
    });

    this.groupCategoryForm = this.formBuilder.group({
      category_id: ['', Validators.required],
      category_name: ['', Validators.required],
      labtest_id: ['', Validators.required],
      labtest_name: ['', Validators.required],
    });

    this.AddnewgroupCategoryForm = this.formBuilder.group({
      category_id: ['', Validators.required],
      category_name: ['', Validators.required],
      labtest_id: ['', Validators.required],
      labtest_name: ['', Validators.required],
      group_test_id: ['', Validators.required],
      group_name: ['', Validators.required],
      package_amount: ['', Validators.required]
    })

    this.getCAllsList();

  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  typesubmit: boolean = false

  get validOne() {
    return this.groupTestForm.controls
  }

  categoryList: any;

  patients_data: any;

  labGrouptestsdata: any;

  getCAllsList() {
    this.myservice.maingetCallforGroupTests().subscribe((res: any) => {
      this.labGrouptestsdata = res.data
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
      this.categoryList = res.data;
    });
    this.myservice.get_labtest().subscribe((res: any) => {
      this.medicaltest = res.data;
    })

  }


  medicalarray: any = []
  medicaltest: any;

  category_select(event) {
    this.medicalarray = this.medicaltest.filter((o: any) => o.category_id == event[0]);
    this.groupCategoryForm.patchValue({
      category_id: event[0],
      category_name: event[1],
    })
  }

  labtest_select(event) {
    this.groupCategoryForm.patchValue({
      labtest_id: event[0],
      labtest_name: event[1],
    })
  }

  totalCategoryLabtests: any = [];

  addCategoryLabTests() {
    if (this.groupTestForm.invalid || this.groupCategoryForm.invalid) {
      Swal.fire('Please Give Details');
    }
    else {
      const duplicateCheck = this.totalCategoryLabtests.some((res) => res.labtest_id === this.groupCategoryForm.value.labtest_id);
      if (!duplicateCheck) {
        this.totalCategoryLabtests.push({
          'labtest_id': this.groupCategoryForm.value.labtest_id,
          'category_id': this.groupCategoryForm.value.category_id,
          'category_name': this.groupCategoryForm.value.category_name,
          'labtest_name': this.groupCategoryForm.value.labtest_name,
        });
        this.groupCategoryForm.reset();
      }
      else {
        Swal.fire('Labtest already exists in this category');
      }
    }
  }

  delete(i) {
    this.totalCategoryLabtests.splice(i, 1);
  }

  Submit() {
    this.typesubmit = true;
    if (this.groupTestForm.invalid) {
      Swal.fire('Please Enter Details')
    } else if (this.totalCategoryLabtests.length == 0) {
      Swal.fire('Please Give Medical Lab Test')
    } else {
      var data = {
        form: this.groupTestForm.value,
        medicallistArr: this.totalCategoryLabtests,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.myservice.addGroupCategoryTests(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.typesubmit = false;
          this.groupTestForm.reset();
          this.totalCategoryLabtests = [];
          this.getCAllsList()
        } else {
          Swal.fire('Failed');
        }
      })
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


  categoryofTests: any = [];
  totalbycatgynLb: any = []

  record123(viewModal, row) {
    var data = {
      'group_id': row.id,
    }
    this.myservice.findandGetGroupCategoryTests(data).subscribe((res) => {
      this.totalbycatgynLb = res.data
      res.data.forEach(obj => {
        const foundIndex = this.categoryofTests.findIndex(item => item.category_id === obj.category_id);
        if (foundIndex === -1) {
          this.categoryofTests.push(obj);
        }
      });
    })
    this.modalService.open(viewModal, { centered: true, size: 'lg' })
  }


  categoryByLabTests: any = [];

  record999(labTestmodla, row) {
    this.categoryByLabTests = this.totalbycatgynLb.filter(item => item.category_id === row.category_id)
    this.modalService.open(labTestmodla, { centered: true, size: 's' })
  }


  ////////////////////// ADD NEW GROUP TESTS /////////////////////////////////////////////
  OldtotalCategoryLabtests: any = [];
  centerModal(centerDataModal, row) {

    this.AddnewgroupCategoryForm.reset();
    this.OldtotalCategoryLabtests = []
    this.NewtotalCategoryLabtests = []
    this.Newmedicalarray = []
    this.AddnewgroupCategoryForm.patchValue({
      group_test_id: row.id,
      group_name: row.group_name,
      package_amount: row.group_package_amount
    })
    var data = {
      'group_id': row.id,
    }
    this.myservice.findandGetGroupCategoryTests(data).subscribe((res) => {
      this.OldtotalCategoryLabtests = res.data
    })
    this.modalService.open(centerDataModal, { centered: true, size: 'xl' })
  }


  Newmedicalarray: any = []


  Newcategory_select(event) {
    this.Newmedicalarray = this.medicaltest.filter((o: any) => o.category_id == event[0]);
    this.AddnewgroupCategoryForm.patchValue({
      category_id: event[0],
      category_name: event[1],
    })
  }


  Newlabtest_select(event) {
    this.AddnewgroupCategoryForm.patchValue({
      labtest_id: event[0],
      labtest_name: event[1],
    })
  }





  NewtotalCategoryLabtests: any = [];


  NewaddCategoryLabTests() {

    if (this.AddnewgroupCategoryForm.invalid) {
      Swal.fire('Please Give Details');
    }
    else {
      const duplicateCheckOld = this.OldtotalCategoryLabtests.some((res) => res.labtest_id === this.AddnewgroupCategoryForm.value.labtest_id);
      const duplicateCheckNew = this.NewtotalCategoryLabtests.some((res) => res.labtest_id === this.AddnewgroupCategoryForm.value.labtest_id);
      if (!duplicateCheckOld && !duplicateCheckNew) {
        this.NewtotalCategoryLabtests.push({
          'labtest_id': this.AddnewgroupCategoryForm.value.labtest_id,
          'category_id': this.AddnewgroupCategoryForm.value.category_id,
          'category_name': this.AddnewgroupCategoryForm.value.category_name,
          'labtest_name': this.AddnewgroupCategoryForm.value.labtest_name,
          'group_test_id': this.AddnewgroupCategoryForm.value.group_test_id,
          'group_name': this.AddnewgroupCategoryForm.value.group_name,
          'package_amount': this.AddnewgroupCategoryForm.value.package_amount,
        });
        this.AddnewgroupCategoryForm.get('labtest_id')?.reset();
        this.AddnewgroupCategoryForm.get('category_id')?.reset();
        this.AddnewgroupCategoryForm.get('category_name')?.reset();
        this.AddnewgroupCategoryForm.get('labtest_name')?.reset();
      }
      else {
        Swal.fire('Labtest already exists in this category');
      }
    }

  }

  deleteNew(i) {
    this.NewtotalCategoryLabtests.splice(i, 1);
  }

  SubmitNew() {
    if (this.NewtotalCategoryLabtests.length == 0) {
      Swal.fire('Please Give Medical Lab Test')
    } else {
      var data = {
        medicallistArr: this.NewtotalCategoryLabtests
      }
      this.myservice.addingNEWGroupCategoryTests(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.modalService.dismissAll()
          this.AddnewgroupCategoryForm.reset();
          this.NewtotalCategoryLabtests = [];
          this.OldtotalCategoryLabtests = [];
          this.getCAllsList()
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }


}
