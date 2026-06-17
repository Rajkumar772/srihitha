import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { AssetserviceService } from '../assetservice.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for


  
  nextdisplayedColumns: string[] = ['i','status','typeofproduct', 'nameofequipment', 'companyname', 'model', 'location', 'department','assetcode','maintenance','priority','workcompleteddate'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select8', 'select9', 'select10', 'select11'];
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
    private formBuilder: FormBuilder, private service: AssetserviceService) { }

  user_id: any;
  usr_nm: any;

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
      assetcode: ['', [Validators.required]],
      maintenance: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      workcompleteddate: ['', [Validators.required]]

    });
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]]
    })
    this.getroomtypedata();
    this.getdepartmentdropdowndata();
    this.getproductdropdown();this.getlocdata();
    this.getdepartmentdropdowndataasset()
  }

  // openusercreation(openroomtype) {

  //   this.modalService.open(openroomtype, { size: 'xl', centered: true });
  // }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'Maintenance'); // table id, file name
  }

  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;

    // 🔒 HARD STOP
    if (!this.availableStock || this.availableStock <= 0) {
      this.showSpinner = false;

      Swal.fire({
        icon: 'error',
        title: 'Out of Stock',
        text: 'Cannot submit form because stock is not available.'
      });
      return;
    }

    if (this.addemployeedetailsform.invalid) {
      this.showSpinner = false;
      Swal.fire('Please enter all required details');
      return;
    }

    const data: any = {
      typeofproduct: this.addemployeedetailsform.value.typeofproduct,
      nameofequipment: this.addemployeedetailsform.value.nameofequipment,
      companyname: this.addemployeedetailsform.value.companyname,
      model: this.addemployeedetailsform.value.model,
      location: this.addemployeedetailsform.value.location,
      department: this.addemployeedetailsform.value.department,
      positiontype: this.addemployeedetailsform.value.positiontype,
      purchase_date: this.addemployeedetailsform.value.purchase_date,
      purchase_rate: this.addemployeedetailsform.value.purchase_rate,
      suppliervendorname: this.addemployeedetailsform.value.suppliervendorname,
      assetcode: this.addemployeedetailsform.value.assetcode,
      quantity: this.addemployeedetailsform.value.quantity,
      maintenance: this.addemployeedetailsform.value.maintenance,
      priority: this.addemployeedetailsform.value.priority,
      workcompleteddate: this.addemployeedetailsform.value.workcompleteddate,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm')
    };
    
    this.service.addmaintenancetypepostdata(data).subscribe(
      (res: any) => {
        this.showSpinner = false;

        if (res.status === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });

          this.availableStock = 0;
          this.submitted = false;
          this.addemployeedetailsform.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();
        } else {
          Swal.fire('Submission failed');
        }
      },
      () => {
        this.showSpinner = false;
        Swal.fire('Something went wrong');
      }
    );
  }


  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any;
  
  getroomtypedata() {
    this.showSpinner = true;
    this.service.getassettype().subscribe(
      (res: any) => {
        this.showSpinner = false;
        const filteredData = res.data.filter((item: any) => item.ind == 2);
        filteredData.map((item: any, index: number) => {
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

  dataget: any;
  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }
  /////UPLOAD SUPPLIER DETAILS DOCUMENT

  departmentdropdown; any = [];
  designationdropdown: any = [];
  //////department code starts
  getdepartmentdropdowndata() {
    this.service.getequipmentdropdown().subscribe(res => {
      this.showSpinner = false;
      this.departmentdropdown = res.data;
    })
  }

  companynamedata: any; getequipmentwisecompany: any = []
  selectequipment(event: any) {
    this.companynamedata = event;
    var data = {
      companyname: this.companynamedata
    }
    this.service.getequipmentwisecompany(data).subscribe(res => {
      this.showSpinner = false;
      this.getequipmentwisecompany = res.data;
    })
  }
  modelnamedata: any; getcompanywisemodel: any = []
  selectcompanynamewisemodel(event: any) {
    this.modelnamedata = event;
    var data = {
      equipmentname: this.companynamedata,
      companyname: this.modelnamedata
    }
    this.service.getcompanywisemodel(data).subscribe(res => {
      this.showSpinner = false;
      this.getcompanywisemodel = res.data;
      
      this.addemployeedetailsform.patchValue({
        suppliervendorname: res.data.suppliervendorname,
        assetcode: res.data.assetcode
      });
    })
  }
  modelname: any; modelpatch: any = []

  availableStock: any


  selectmodelname(event: any) {
    if (!event) return;
    const data = {
      modelname: event.model,
      assetcode: event.assetcode,
      companyname: event.companyname,
      equipmentname: this.addemployeedetailsform.value.nameofequipment
    };

    this.service.getmodelpatchdata(data).subscribe((res: any) => {
      const row = res?.data?.[0];
      const availableQty = Number(row?.available_qty || 0);

      // 🔑 store globally for submit validation
      this.availableStock = availableQty;

      // 🚨 NO STOCK
      if (availableQty <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Stock Available',
          text: 'Selected model is out of stock.'
        });

        // Optional UX cleanup
        this.addemployeedetailsform.patchValue({
          available_qty: 0,
          suppliervendorname: '',
          purchase_rate: '',
          assetcode: ''
        });

        return; // ❌ stop further patching
      }

      // ✅ Stock available → patch form
      this.addemployeedetailsform.patchValue({
        available_qty: availableQty,
        suppliervendorname: row?.suppliervendorname || '',
        purchase_rate: row?.purchase_rate || '',
        assetcode: row?.assetcode || '',
        positiontype: row?.positiontype || '',
      });
    });
  }

//////update maintenance status
 updateStatus(row: any) {
    const payload = {
      status: row.status,
      id: row.id,
    };
    this.service.updateEmployeeStatus(payload).subscribe({
      next: () => {
        alert('Status updated successfully');
      },
      error: () => {
        alert('Failed to update status');
      }
    });
  }
  getproduct:any=[];
getproductdropdown() {
    this.service.getproductdropdowndata().subscribe(res => {
      this.showSpinner = false;
      this.getproduct = res.data;

    })
  }

   locationdata:any=[]
      getlocdata() {
    this.service.getlocationdropdown().subscribe(res => {
      this.showSpinner = false;
      this.locationdata = res.data;
      
    })
  }
  departmentdropdownasset: any = [];
  // designationdropdown: any = [];
  //////department code starts
  getdepartmentdropdowndataasset() {
    this.service.getdepartmentdropdownasset().subscribe(res => {
      this.showSpinner = false;
      this.departmentdropdownasset = res.data;
     
    })
  }

}
