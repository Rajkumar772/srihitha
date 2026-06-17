import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  @ViewChild('exporter', { static: false }) exporter: MatTableExporterDirective;

  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  submittedd: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'name', 'edit', 'delete'];
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
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private service: InPatienrservicesService, public router: Router) { }

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.addemployeedetailsform = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.updateform = this.formBuilder.group({
      update_roomtype: ['']
    })

    this.getInsurance();
  }

  clcick() {
    this.router.navigate(['/in-patients/rooms'])
  }

  openusercreation(openroomtype) {
    this.modalService.open(openroomtype, { size: 'xl', centered: true });
  }

  submitroomtype() {
    this.submitted = true;
    if (this.addemployeedetailsform.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        name: this.addemployeedetailsform.value.name,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      this.service.Add_insurance(data).subscribe((res: any) => {
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
          this.getInsurance();

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
  casefiledata: any;
  getInsurance() {
    this.showSpinner = true;
    this.service.getInsurance().subscribe(res => {
  
  
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
      update_roomtype: this.dataget.name,
    })
    this.modalService.open(openmodel, { size: 's', centered: true })
  }
  editaddroomtype() {
    this.submittedd = true;
    if (this.updateform.invalid) {
      alert("Please enter details");
    } else {
      this.showSpinner = true;
      var data = {
        update_roomtype: this.updateform.value.update_roomtype,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        id: this.dataget.id
      }
      this.service.editinsurance(data).subscribe(res => {
        alert('successfully updated');
        this.getInsurance();
        this.showSpinner = false;
        this.addemployeedetailsform.reset();
        this.modalService.dismissAll();
        this.submittedd = false;
      },
        error => {
          this.showSpinner = false;
        });
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
        this.service.deleteinsurance(data).subscribe((res) => {
          if (res.status == 200) {
            Swal.fire({
              title: "Deleted!",
              icon: "success",
              // position:'top-end',
              showConfirmButton: false,
              timer: 1000
            });
            this.getInsurance()
          } else {
            alert("Failed")
          }
        })
      }
    });
  }
exportExcel() {
  const oldColumns = [...this.nextdisplayedColumns];

  this.nextdisplayedColumns = ['i', 'name'];

  setTimeout(() => {
    this.exporter.exportTable('xlsx', {
      fileName: 'insurance-list',
      sheet: 'sheet_name',
      Props: { Author: 'Talha' }
    });

    this.nextdisplayedColumns = oldColumns;
  }, 0);
}



}
