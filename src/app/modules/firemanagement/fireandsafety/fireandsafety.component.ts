import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';

import { FireserviceService } from '../fireservice.service';

@Component({
  selector: 'app-fireandsafety',
  templateUrl: './fireandsafety.component.html',
  styleUrls: ['./fireandsafety.component.scss']
})
export class FireandsafetyComponent implements OnInit {
  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'edit','view', 'typeofproduct', 'nameofequipment', 'companyname', 'model', 'location', 'department', 'purchase_rate', 'quantity', 'assetcode', 'suppliervendorname', 'i_ts'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select8', 'select9', 'select10', 'select11', 'select12'];
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
  adddepartment: FormGroup; addlocation: FormGroup;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: FireserviceService) {
    this.adddepartment = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
    this.addlocation = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]]
    })
    this.updateform = this.formBuilder.group({
      assigned_date: ['', [Validators.required]],
      typeofuse: ['', [Validators.required]],
      // floornumber: ['', [Validators.required]],
      remarks: ['', [Validators.required]]
    });
  }
  user_id: any;
  usr_nm: any;

 getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'NOT_USED': return 'badge-not-used';
    case 'REFILLING': return 'badge-refilling';
    case 'BROKEN': return 'badge-broken';
    case 'EXPIRED': return 'badge-expired';
    case 'DISPOSED': return 'badge-disposed';
    case 'IN_USE':
    default:
      return 'badge-in-use';
  }
}

getStatusIconClass(status: string): string {
  switch (status) {
    case 'NOT_USED': return 'icon-not-used';
    case 'REFILLING': return 'icon-refilling';
    case 'BROKEN': return 'icon-broken';
    case 'EXPIRED': return 'icon-expired';
    case 'DISPOSED': return 'icon-disposed';
    case 'IN_USE':
    default:
      return 'icon-in-use';
  }
}

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.addemployeedetailsform = this.formBuilder.group({
      typeofproduct: ['', [Validators.required]],
      nameofequipment: ['', [Validators.required]],
      companyname: ['', [Validators.required]],
      model: ['', [Validators.required]],
      location: ['', [Validators.required]],
      department: ['', [Validators.required]],
      suppliervendorname: ['', [Validators.required]],
      assetcode: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      purchase_rate: [''],
      available_qty: [''],
      positiontype: ['']

    });

    this.getroomtypedata();

  }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'room-types'); // table id, file name
  }



  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any;

  // getroomtypedata() {
  //   this.showSpinner = true;

  //   this.service.getassettype().subscribe(
  //     (res: any) => {
  //       this.showSpinner = false;
  //       // ✅ FILTER ONLY ind = 0
  //       const filteredData = res.data.filter((item: any) => item.ind == 1);

  //       filteredData.map((item: any, index: number) => {
  //         item.i = index + 1;
  //       });

  //       this.masterdata = filteredData;
  //       this.clonedata = filteredData;
  //       this.dataSource = new MatTableDataSource(filteredData);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     },
  //     error => {
  //       this.showSpinner = false;
  //     }
  //   );
  // }
  getroomtypedata() {
    this.showSpinner = true;
    this.service.getassettype().subscribe(
      (res: any) => {
        this.showSpinner = false;
        const filteredData = res.data.filter((item: any) =>
          item.ind == 1 && item.nameofequipment == 'Gas-Cylinder'
        );
        filteredData.forEach((item: any, index: number) => {
          item.i = index + 1;
        });
        this.masterdata = filteredData;
        this.clonedata = filteredData;
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.showSpinner = false;
      }
    );
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

  // dataget: any;
  // modalDismiss(openmodel) {
  //   this.modalService.dismissAll(openmodel)
  // }
  /////UPLOAD SUPPLIER DETAILS DOCUMENT



  modalDismissemployee(addNew) {
    this.modalService.dismissAll(addNew)
  }
  fullname: any; phone: any; ids: any;
  dataget: any;
  editdata(data: any, openmodel) {
    this.dataget = data;
    
    this.fullname = this.dataget.full_name;
    this.phone = this.dataget.phone;
   
    this.modalService.open(openmodel, { size: 'xl', centered: true })
  }

  editaddroomtype() {
    if (this.updateform.invalid) {
      alert("Please enter details");
    }
    else {
      var data = {
        assigned_date: this.updateform.value.assigned_date,
        typeofuse: this.updateform.value.typeofuse,
        remarks: this.updateform.value.remarks,
        id: this.dataget.id,
        assetcode: this.dataget.assetcode,
        companyname: this.dataget.companyname,
        model: this.dataget.model,
        nameofequipment: this.dataget.nameofequipment,
        warrantydate: this.dataget.warrantydate,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
      
      this.service.updatefireuse(data).subscribe(res => {
        if (res.status == 200) {
          alert('successfully updated');
          this.getroomtypedata();
          this.showSpinner = false;
          this.addemployeedetailsform.reset();
          this.modalService.dismissAll();
        }
      },
        error => {
          this.showSpinner = false;
        });
    }
  }

  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }
  equipmentData: any = [];
  record123(viewModal, row) {
    
    var data = {
      'id': row.id,
    }
    this.service.getfireandsafetyreports(data).subscribe((res) => {
      this.equipmentData = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'xl' })
  }

}
