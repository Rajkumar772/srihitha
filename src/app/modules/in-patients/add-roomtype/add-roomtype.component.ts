import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-add-roomtype',
  templateUrl: './add-roomtype.component.html',
  styleUrls: ['./add-roomtype.component.scss']
})
export class AddRoomtypeComponent implements OnInit {
  roomdropdownreport: any = []
  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  submittedd: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'bed_type', 'floor_type', 'room_number', 'bed_no', 'price', 'description', 'edit', 'delete'];
  selectColumns: string[] = ['selectSlno', 'select1', 'selectone', 'select2', 'select3', 'select4', 'select5'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any;
  age: any;
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };
  addCategory: FormGroup;
  constructor(private modalService: NgbModal, public router: Router,
    private formBuilder: FormBuilder, private service: InPatienrservicesService) {


    this.addCategory = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
  }

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.roomdropdown()
    this.addemployeedetailsform = this.formBuilder.group({
      name: ['', [Validators.required]],
      floor_type: ['', [Validators.required]],
      rooms_price: ['', [Validators.required]],
      room_condition: ['', [Validators.required]],
      room_condition_ind: [''],
      rooms: ['', [Validators.required]],
      bed_no: ['', [Validators.required]],
      desc: [''],

    });
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]],
      rooms_update: ['', [Validators.required]],
      beds_update: ['', [Validators.required]],
      update_price: ['', [Validators.required]],
      update_desc: [''],
      update_floor_type: ['', [Validators.required]],
    })
    this.getroomtypedata();
    this.getroomsdatas();
  }
  // openusercreation(openroomtype) {
  //   this.modalService.open(openroomtype, { size: 'xl', centered: true });
  // }

  roomcondition(event: any) {
    var a = event;
    if (a == 'AC') {
      this.addemployeedetailsform.patchValue({
        room_condition: 'AC',
        room_condition_ind: '1',
      })
    }
    else {
      this.addemployeedetailsform.patchValue({
        room_condition: 'NON-AC',
        room_condition_ind: '2',
      })
    }
  }

  clcick() {
    this.router.navigate(["/in-patients/add-type"])
  }
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }

  // Accept Input As a Number Only
  numericOnly(event): boolean {
    let patt = /^([0-9,/,.,])$/;
    let result = patt.test(event.key);
    return result;
  }

  submitroomtype() {
    this.submitted = true;
    if (this.addemployeedetailsform.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        name: this.addemployeedetailsform.value.name,
        floor_type: this.addemployeedetailsform.value.floor_type,
        rooms_price: this.addemployeedetailsform.value.rooms_price,
        room_condition: this.addemployeedetailsform.value.room_condition,
        room_condition_ind: this.addemployeedetailsform.value.room_condition_ind,
        rooms: this.addemployeedetailsform.value.rooms,
        bed_no: this.addemployeedetailsform.value.bed_no,
        desc: this.addemployeedetailsform.value.desc,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }


      this.service.addroomtype(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.addemployeedetailsform.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();

        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  get f() {
    return this.addemployeedetailsform.controls
  }
  get g() {
    return this.updateform.controls
  }
  showSpinner: boolean = false;
  roomsdata: any;
  getroomtypedata() {
    this.showSpinner = true;
    this.service.getroomsdata().subscribe(res => {
      this.showSpinner = false;
      this.roomsdata = res.data;
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
  casefiledata: any;
  getroomsdatas() {
    this.showSpinner = true;
    this.service.getroomtypedata().subscribe(res => {
      this.showSpinner = false;
      this.casefiledata = res.data;
    }, error => {
      this.showSpinner = false;
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

  dataget: any;
  editdata(data: any, openmodel) {
    this.dataget = data;
    this.updateform.patchValue({
      update_roomtype: this.dataget.bed_type,
      rooms_update: this.dataget.room_number,
      update_price: this.dataget.price,
      beds_update: this.dataget.bed_no,
      update_desc: this.dataget.description,
      update_floor_type: this.dataget.floor_type
    })
    this.modalService.open(openmodel, { size: 'xl', centered: true })
  }

  editaddroomtype() {
    this.showSpinner = true;
    this.submittedd = true;
    if (this.updateform.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        update_roomtype: this.updateform.value.update_roomtype,
        rooms_update: this.updateform.value.rooms_update,
        beds_update: this.updateform.value.beds_update,
        update_price: this.updateform.value.update_price,
        update_desc: this.updateform.value.update_desc,
        update_floor_type: this.updateform.value.update_floor_type,
        id: this.dataget.id,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }

      this.service.editrooms(data).subscribe(res => {
        alert('successfully updated');
        this.getroomtypedata();
        this.showSpinner = false;
        this.submittedd = false;
        this.addemployeedetailsform.reset();
        this.modalService.dismissAll();
      }, error => {
      });
    }
  }

  // delete(data) {
  //   if (confirm("Delete Room?")) {
  //     this.service.deleterooms(data).subscribe((res) => {
  //       if (res.status == 200) {
  //         alert("Deleted Successfully")
  //         this.getroomtypedata()
  //       } else {
  //         alert("Failed")
  //       }
  //     })
  //   }
  // }

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
        this.service.deleterooms(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.getroomtypedata()
          } else {
            alert("Failed")
          }
        })
      }
    });
  }


  modalDismiss() {
    this.modalService.dismissAll()
  }

  resets() {
    this.addemployeedetailsform.reset();
  }

  resetss() {
    this.updateform.reset();
  }



  ////add  new floor type code start 

  form: FormGroup;
  forFieldsform: FormGroup
  ngSelectControl = new FormControl();

  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewtype(openPopforNew)
    }
  }

  dis(addNew) {
    this.modalService.dismissAll(addNew)
  }
  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }
  subs: boolean = false
  submitCategory(): void {
    this.subs = true;
    const inputValue = this.addCategory.value.new_type.trim();
    if (inputValue === '') {
      this.addCategory.get('new_type').setErrors({ required: true });
    }
    if (this.addCategory.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue
    };
    this.subs = true;
    this.service.Categorytypefloor(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Floor Type Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.addCategory.reset();
          this.subs = false;
          // this.get();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Category Type Already exist!',
            timer: 1500
          })
          // this.get();
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Category Type',
          icon: 'error'
        });
      }
    );
  }




  /////add room type code starts
  roomdropdown() {
    this.service.getCategoryfloor().subscribe((res: any) => {
      this.roomdropdownreport = res.data;
    });
  }

}
