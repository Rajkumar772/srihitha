

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { OpServicesService } from '../op-services.service';


@Component({
  selector: 'app-add-procedures',
  templateUrl: './add-procedures.component.html',
  styleUrls: ['./add-procedures.component.scss']
})
export class AddProceduresComponent implements OnInit {

  addproceduretypesForm: FormGroup;
  editproceduretypesForm: FormGroup;

  DerndAesproceduretypeForm: FormGroup;
  editDerndAesproceduretypeForm: FormGroup;

  subDerndAesproceduretypeForm: FormGroup;
  editsubDerndAesproceduretypeForm: FormGroup;


  submitted: boolean = false;
  submittedd: boolean = false;
  submitted2: boolean = false;
  submittedd2: boolean = false;
  submitted3: boolean = false;
  submittedd3: boolean = false;
  showSpinner: boolean = false;


  user_id: any;
  usr_nm: any;

  ///////////// first

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'procedure_type', 'edit', 'delete'];
  selectColumns: string[] = ['selectSlno', 'select1'];

  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  clonedata: any[] = [];
  cust_color: string = 'blue';
  newOccupationForm: any;
  headerclass = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'blue',
    'color': 'white'
  };

  //////////////////second

  dataSourceTwo: MatTableDataSource<any>;

  @ViewChild('categoryPaginator', { read: MatPaginator }) categoryPaginator: MatPaginator;

  nextdisplayedColumnsTwo: string[] = ['i', 'procedure_type', 'der_aes_procedure_type', 'edit', 'delete']

  selectColumnsTwo: string[] = ['select1', 'select2', 'select3'];


  hideselect2: boolean = false;
  reset2: any = ''
  masterdata2: any = [];

  clonedata2: any[] = [];
  cust_color2: string = 'blue';
  headerclass2 = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'blue',
    'color': 'white'
  };


  //////////////////third

  dataSourceThree: MatTableDataSource<any>;

  @ViewChild('subcategoryPaginator', { read: MatPaginator }) subcategoryPaginator: MatPaginator;

  nextdisplayedColumnsThree: string[] = ['i', 'procedure_type', 'der_aes_procedure_type',
    'sub_der_aes_procedure_type', 'edit', 'delete']

  selectColumnsThree: string[] = ['select1', 'select2', 'select3', 'select4'];

  hideselect3: boolean = false;
  reset3: any = ''
  masterdata3: any = [];

  clonedata3: any[] = [];
  cust_color3: string = 'blue';
  headerclass3 = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'blue',
    'color': 'white'
  };

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private service: OpServicesService, public router: Router) { }

  ngOnInit(): void {


    this.getproceduretype();
    this.getDerndAesproceduretype();
    this.getsubDerndAesproceduretype();
    this.gettypedata();

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.addproceduretypesForm = this.formBuilder.group({
      procedure_type: ['', [Validators.required]],
    });

    this.editproceduretypesForm = this.formBuilder.group({
      procedure_type: ['', [Validators.required]]
    })

    this.DerndAesproceduretypeForm = this.formBuilder.group({
      procedure_type: ['', [Validators.required]],
      procedure_type_id: ['', [Validators.required]],
      der_aes_procedure_type: ['', [Validators.required]],
    })

    this.editDerndAesproceduretypeForm = this.formBuilder.group({
      der_aes_procedure_type: ['', [Validators.required]],
    })

    this.subDerndAesproceduretypeForm = this.formBuilder.group({
      procedure_type: ['', [Validators.required]],
      procedure_type_id: ['', [Validators.required]],
      der_aes_procedure_type: ['', [Validators.required]],
      der_aes_procedure_type_id: ['', [Validators.required]],
      sub_der_aes_procedure_type: ['', [Validators.required]]
    })

    this.editsubDerndAesproceduretypeForm = this.formBuilder.group({
      sub_der_aes_procedure_type: ['', [Validators.required]]
    })

  }


  ////////////first form

  get f() {
    return this.addproceduretypesForm.controls
  }
  get g() {
    return this.editproceduretypesForm.controls
  }

  submitproceduretype() {
    this.submitted = true;
    if (this.addproceduretypesForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        procedure_type: this.addproceduretypesForm.value.procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.showSpinner = true
      this.service.Add_proceduretype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.showSpinner = false;
          this.submitted = false;
          this.addproceduretypesForm.reset();
          this.modalService.dismissAll();
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  getproceduretype() {
    this.showSpinner = true;
    this.service.getproceduretype().subscribe(res => {
      this.showSpinner = false;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.showSpinner = false;
    })

  }

  dataget: any;
  editdata(data: any, openmodel) {
    this.dataget = data;
    this.editproceduretypesForm.patchValue({
      procedure_type: this.dataget.procedure_type,
    })
    this.modalService.open(openmodel, { size: 's', centered: true })
  }

  editproceduretype() {
    this.submittedd = true;
    if (this.editproceduretypesForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        procedure_type: this.editproceduretypesForm.value.procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        id: this.dataget.id
      }
      this.showSpinner = true
      this.service.editproceduretype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
          this.showSpinner = false;
          this.addproceduretypesForm.reset();
          this.modalService.dismissAll();
          this.submittedd = false;
        } else {
          Swal.fire('Failed');
        }
      })
    }
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
        this.showSpinner = true
        this.service.deleteproceduretype(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.showSpinner = false
            this.getproceduretype()
          } else {
            alert("Failed")
          }
        })
      }
    });
  }

  ///////////////second form

  get h() {
    return this.DerndAesproceduretypeForm.controls
  }

  get l() {
    return this.editDerndAesproceduretypeForm.controls
  }

  submitDerndAesproceduretype() {
    this.submitted2 = true;
    if (this.DerndAesproceduretypeForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        procedure_type_id: this.DerndAesproceduretypeForm.value.procedure_type_id,
        procedure_type: this.DerndAesproceduretypeForm.value.procedure_type,
        der_aes_procedure_type: this.DerndAesproceduretypeForm.value.der_aes_procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.showSpinner = true
      this.service.Add_DerndAesproceduretype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted2 = false;
          this.showSpinner = false;
          this.DerndAesproceduretypeForm.reset();
          this.modalService.dismissAll();
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  getDerndAesproceduretype() {
    this.showSpinner = true;
    this.service.getDerndAesproceduretype().subscribe(res => {
      this.showSpinner = false;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata2 = res.data;
      this.clonedata2 = this.masterdata2;
      this.dataSourceTwo = new MatTableDataSource(res.data);
      this.dataSourceTwo.paginator = this.categoryPaginator;
      this.dataSourceTwo.sort = this.sort;
    }, error => {
      this.showSpinner = false;
    })

  }

  dataget2: any;
  editdatasecond(data: any, openmodelsecond) {
    this.dataget2 = data;
    this.editDerndAesproceduretypeForm.patchValue({
      der_aes_procedure_type: this.dataget2.der_aes_procedure_type,
    })
    this.modalService.open(openmodelsecond, { size: 's', centered: true })
  }

  editprocedurecategorytype() {
    this.submittedd2 = true;
    if (this.editDerndAesproceduretypeForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        der_aes_procedure_type: this.editDerndAesproceduretypeForm.value.der_aes_procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        id: this.dataget2.id
      }
      this.showSpinner = true
      this.service.editprocedurecategorytype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
          this.showSpinner = false;
          this.DerndAesproceduretypeForm.reset();
          this.modalService.dismissAll();
          this.submittedd2 = false;
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  deletesecond(data) {
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
        this.showSpinner = true
        this.service.deleteprocedurecategorytype(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.showSpinner = false
            this.getDerndAesproceduretype()
          } else {
            alert("Failed")
          }
        })
      }
    });
  }

  ////////////third form

  get m() {
    return this.subDerndAesproceduretypeForm.controls
  }

  get n() {
    return this.editsubDerndAesproceduretypeForm.controls
  }

  submitSubDerndAesproceduretype() {
    this.submitted3 = true;
    if (this.subDerndAesproceduretypeForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        procedure_type_id: this.subDerndAesproceduretypeForm.value.procedure_type_id,
        procedure_type: this.subDerndAesproceduretypeForm.value.procedure_type,
        der_aes_procedure_type_id: this.subDerndAesproceduretypeForm.value.der_aes_procedure_type_id,
        der_aes_procedure_type: this.subDerndAesproceduretypeForm.value.der_aes_procedure_type,
        sub_der_aes_procedure_type: this.subDerndAesproceduretypeForm.value.sub_der_aes_procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.showSpinner = true
      this.service.Add_Sub_DerndAesproceduretype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted3 = false;
          this.showSpinner = false;
          this.subDerndAesproceduretypeForm.reset();
          this.modalService.dismissAll();
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  getsubDerndAesproceduretype() {
    this.showSpinner = true;
    this.service.getsubDerndAesproceduretype().subscribe(res => {
      this.showSpinner = false;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.masterdata3 = res.data;
      this.clonedata3 = this.masterdata3;
      this.dataSourceThree = new MatTableDataSource(res.data);
      this.dataSourceThree.paginator = this.subcategoryPaginator;
      this.dataSourceThree.sort = this.sort;
    }, error => {
      this.showSpinner = false;
    })
  }

  dataget3: any;
  editdatathird(data: any, openmodelthird) {
    this.dataget3 = data;
    this.editsubDerndAesproceduretypeForm.patchValue({
      sub_der_aes_procedure_type: this.dataget3.sub_der_aes_procedure_type,
    })
    this.modalService.open(openmodelthird, { size: 's', centered: true })
  }

  editproceduresubcategorytype() {
    this.submittedd3 = true;
    if (this.editsubDerndAesproceduretypeForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        sub_der_aes_procedure_type: this.editsubDerndAesproceduretypeForm.value.sub_der_aes_procedure_type,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        id: this.dataget3.id
      }
      this.showSpinner = true
      this.service.editproceduresubcategorytype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Updated',
            showConfirmButton: false,
            timer: 1500
          });
          this.getproceduretype();
          this.getDerndAesproceduretype();
          this.getsubDerndAesproceduretype();
          this.gettypedata();
          this.showSpinner = false;
          this.subDerndAesproceduretypeForm.reset();
          this.modalService.dismissAll();
          this.submittedd3 = false;
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  deletethird(data) {
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
        this.showSpinner = true
        this.service.deletesubDerndAesproceduretype(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.showSpinner = false
            this.getsubDerndAesproceduretype()
          } else {
            alert("Failed")
          }
        })
      }
    });
  }


  /////////////

  proceduredata: any;
  gettypedata() {
    this.showSpinner = true;
    this.service.gettypedata().subscribe(res => {
      this.showSpinner = false;
      this.proceduredata = res.data;
    }
    )
  }

  changeproceduretype(e) {
    this.DerndAesproceduretypeForm.patchValue({
      procedure_type: e.procedure_type,
      procedure_type_id: e.procedure_type_id,
      der_aes_procedure_type: '',
    })
  }

  subproceduredata: any

  changesubproceduretype(event: any) {
    this.subDerndAesproceduretypeForm.patchValue({
      der_aes_procedure_type_id: '',
      der_aes_procedure_type: '',
      sub_der_aes_procedure_type: ''
    })
    this.subDerndAesproceduretypeForm.patchValue({
      procedure_type_id: event.id,
      procedure_type: event.procedure_type,
    })
    var data = {
      procedure_type_id: event.id
    }
    this.subproceduredata = []
    this.showSpinner = true;
    this.service.getproceduredata(data).subscribe(res => {
      this.showSpinner = false;
      this.subproceduredata = res.data

    });
  }

  changesubcatproceduretype(event: any) {
    this.subDerndAesproceduretypeForm.patchValue({
      der_aes_procedure_type_id: event.id,
      der_aes_procedure_type: event.der_aes_procedure_type,
    })
    this.subDerndAesproceduretypeForm.patchValue({
      sub_der_aes_procedure_type: ''
    })
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

  //table code Star 2
  applyFilter2(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTwo.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggle2(index) {
    if (index) {
      this.hideselect2 = !this.hideselect2;
    } else {
      this.hideselect2 = false;
      this.headerclass2['background-color'] = 'blue';
      this.reset2 = '';
    }
    this.clonedata2 = this.masterdata2;
    this.dataSourceTwo = new MatTableDataSource(this.clonedata2);
    this.dataSourceTwo.paginator = this.categoryPaginator;
    this.dataSourceTwo.sort = null;
    this.dataSourceTwo.sort = this.sort;
  }

  columnfilterdata2(object, index) {
    if (object == undefined) {
      this.clonedata2 = this.masterdata2;
      this.reset2 = '';
    } else {
      if (index == 0) {
        this.clonedata2 = this.clonedata2.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSourceTwo = new MatTableDataSource(this.clonedata2);
  }

  changecolor2(colorclass) {
    this.headerclass2['background-color'] = colorclass;
  }

  changeCustomColor2(event) {
    this.headerclass2['background-color'] = event.target.value;
  }


  //table code Star 3
  applyFilter3(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceThree.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggle3(index) {
    if (index) {
      this.hideselect3 = !this.hideselect3;
    } else {
      this.hideselect3 = false;
      this.headerclass3['background-color'] = 'blue';
      this.reset3 = '';
    }
    this.clonedata3 = this.masterdata3;
    this.dataSourceThree = new MatTableDataSource(this.clonedata3);
    this.dataSourceThree.paginator = this.subcategoryPaginator;
    this.dataSourceThree.sort = null;
    this.dataSourceThree.sort = this.sort;
  }

  columnfilterdata3(object, index) {
    if (object == undefined) {
      this.clonedata3 = this.masterdata3;
      this.reset3 = '';
    } else {
      if (index == 0) {
        this.clonedata3 = this.clonedata3.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSourceThree = new MatTableDataSource(this.clonedata3);
  }

  changecolor3(colorclass) {
    this.headerclass3['background-color'] = colorclass;
  }

  changeCustomColor3(event) {
    this.headerclass3['background-color'] = event.target.value;
  }

}
