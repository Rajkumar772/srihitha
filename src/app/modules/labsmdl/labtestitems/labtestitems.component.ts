import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-labtestitems',
  templateUrl: './labtestitems.component.html',
  styleUrls: ['./labtestitems.component.scss']
})
export class LabtestitemsComponent implements OnInit {

  submitlabItmsForm: FormGroup;
  addCategoryForm: FormGroup
  editlabItmsForm: FormGroup;
  KitForm: FormGroup;
  submitted: boolean;
  submittedd: boolean;
  showSpinner: boolean;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for

  nextdisplayedColumns: string[] = ['i', 'category_name', 'lab_product_name', 'kit_name', 'hsn_code', 'delete']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4', 'select5'];

  ngSelectControl = new FormControl();

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

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.submitlabItmsForm = this.formBuilder.group({
      category_id: [''],
      category_name: ['', [Validators.required]],
      lab_product_id: [''],
      lab_product_name: ['', Validators.required],
      kit_id: [''],
      kit_name: ['', [Validators.required]],
      hsn_code: ['', Validators.required],

    });

    this.addCategoryForm = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })

    this.KitForm = this.formBuilder.group({
      kit_name: ['', [Validators.required]],
      hsn_code: ['', Validators.required],

    })

    this.getlabItmsdata();
    this.getlabCategory();
    this.getLabKit();

  }

  get valid() {
    return this.submitlabItmsForm.controls;
  }

  get validEdit() {
    return this.editlabItmsForm.controls;
  }

  get validd() {
    return this.addCategoryForm.controls;
  }

  category: any = [];

  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  dis(addNew) {
    this.modalService.dismissAll(addNew)
  }

  getlabCategory() {
    this.myservice.getCategory().subscribe((res: any) => {
      this.category = res.data;
    });
  }

  labtestarray: any
  getlabtest(event: any) {
    this.submitlabItmsForm.patchValue({
      lab_product_id: '',
      lab_product_name: '',
      kit_name: '',
      hsn_code:''

    })
    this.submitlabItmsForm.patchValue({
      category_id: event.id,
      category_name: event.new_type,
    })
    var data = {
      category_id: event.id
    }
    this.labtestarray = []
    this.showSpinner = true;
    this.myservice.getlabtestdata(data).subscribe(res => {
      this.showSpinner = false;
      this.labtestarray = res.data
    });
  }

  changelabtest(event: any) {
    this.submitlabItmsForm.patchValue({
      lab_product_id: event.id,
      lab_product_name: event.labtest,
    })
    this.submitlabItmsForm.patchValue({
      kit_name: '',
      hsn_code:''
    })
  }

  submitlabItms() {
    this.submitted = true
    if (this.submitlabItmsForm.invalid) {
      Swal.fire({
        icon: 'question',
        title: 'Fill All Details',
        text: 'Required',
        timer: 1500
      })
    }
    else {
      var data = {
        data1: this.submitlabItmsForm.value,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.showSpinner = true;
      this.myservice.submitlabItms(data).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully submitted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.getlabItmsdata()
          this.submitlabItmsForm.reset()
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

  getlabItmsdata() {
    this.myservice.getlabItmsdata().subscribe((res) => {
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

  delete(data) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      position: 'top-end',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner = true;
        this.myservice.dltLabItemsdts(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.showSpinner = false;
            this.getlabItmsdata()
          } else {
            alert("Failed")
          }
        })
      }
    });
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


  ////////

  openKitInsert(addKitTempo) {
    this.modalService.open(addKitTempo, { size: 'lg', centered: true });
  }

  submit: boolean = false
  get validCat() {
    return this.KitForm.controls;
  }

  addLabKit() {
    this.submit = true
    if (this.KitForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Give Category',
        showConfirmButton: false,
        timer: 1500,
      });
    }
    else {
      this.showSpinner = true
      this.myservice.addKitformdata(this.KitForm.value).subscribe((res) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Successfully Upadted",
            showConfirmButton: false,
            timer: 1500,
          });
          this.submit = false;
          this.KitForm.reset();
          this.getLabKit()
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
      })
    }
  }

  kitarray: any = [];

  getLabKit() {
    this.showSpinner = true
    this.myservice.getLabKit().subscribe((res) => {
      this.showSpinner = false
      this.kitarray = res.data
    })
  }

  Kitselect(e) {
    this.submitlabItmsForm.patchValue({
      kit_id: e.kit_id,
      kit_name: e.kit_name,
      hsn_code: e.hsn_code
    })
  }

}
