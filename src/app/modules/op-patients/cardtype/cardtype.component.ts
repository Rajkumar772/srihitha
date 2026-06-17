import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
@Component({
  selector: 'app-cardtype',
  templateUrl: './cardtype.component.html',
  styleUrls: ['./cardtype.component.scss']
})
export class CardtypeComponent implements OnInit {

  addemployeedetailsform: FormGroup;
   updateform: FormGroup;
   submitted: boolean = false;
   dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
   @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
   @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
   initialValues;                           // Intial values for form
   edit: boolean = false;                   // Edit value for
   nextdisplayedColumns: string[] = ['i', 'roomtype','edit'];
   selectColumns: string[] = ['selectSlno', 'select1'];
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
   constructor(private modalService: NgbModal, private router: Router,
     private formBuilder: FormBuilder, private service: InPatienrservicesService) { }
 
   user_id: any;
   usr_nm: any;
 
   ngOnInit(): void {
     this.user_id = localStorage.getItem("user_id");
     this.usr_nm = localStorage.getItem("usr_nm");
     this.addemployeedetailsform = this.formBuilder.group({
       name: ['', [Validators.required]],
      //  amount: ['', [Validators.required]],
     });
     this.updateform = this.formBuilder.group({
       update_roomtype: ['', [Validators.required]],
      //  amount: ['', [Validators.required]]
     })
     this.getroomtypedata();
   }
 
   // openusercreation(openroomtype) {
 
   //   this.modalService.open(openroomtype, { size: 'xl', centered: true });
   // }
 
   clcick() {
     this.router.navigate(["/in-patients/add-roomtype"])
   }
 
   submitroomtype() {
     this.submitted = true;
     this.showSpinner = true;
     if (this.addemployeedetailsform.invalid) {
       alert("Please enter details");
       this.showSpinner = false;
       return
     } else {
       var data = {
         room_type: this.addemployeedetailsform.value.name,
        //  amount: this.addemployeedetailsform.value.amount,
         user_id: localStorage.getItem('user_id'),
         usr_nm: localStorage.getItem('usr_nm'),
       }
       this.service.addcard_type(data).subscribe((res: any) => {
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
 
   showSpinner: boolean = false;
   casefiledata: any;
   getroomtypedata() {
     this.service.getcard_type().subscribe(res => {
       this.showSpinner = false;
       this.casefiledata = res.data;
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
       update_roomtype: this.dataget.roomtype,
        // amount: this.dataget.amount
     })
     this.modalService.open(openmodel, { size: 's', centered: true })
   }
 
   editaddroomtype() {
     if (this.updateform.invalid) {
       alert("Please enter details");
     }
     else {
       var data = {
         update_roomtype: this.updateform.value.update_roomtype,
        //  amount: this.updateform.value.amount,
         id: this.dataget.id,
         user_id: localStorage.getItem('user_id'),
         usr_nm: localStorage.getItem('usr_nm'),
       }
       this.service.updatecard_type(data).subscribe(res => {
         alert('successfully updated');
         this.getroomtypedata();
         this.showSpinner = false;
         this.addemployeedetailsform.reset();
         this.modalService.dismissAll();
       },
         error => {
           this.showSpinner = false;
         });
     }
   }
 
   modalDismiss(openmodel) {
     this.modalService.dismissAll(openmodel)
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
         this.service.deleteroomtype(data).subscribe((res) => {
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
}
