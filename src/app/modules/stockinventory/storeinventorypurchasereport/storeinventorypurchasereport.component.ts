import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { StockinventoryService } from '../stockinventory.service';



@Component({
  selector: 'app-storeinventorypurchasereport',
  templateUrl: './storeinventorypurchasereport.component.html',
  styleUrls: ['./storeinventorypurchasereport.component.scss']
})
export class StoreinventorypurchasereportComponent implements OnInit {

  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'nameofequipment', 'total_equipment', 'given_equipment', 'available_quantity', 'view'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4'];
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
    private formBuilder: FormBuilder, private service: StockinventoryService) { }

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.addemployeedetailsform = this.formBuilder.group({
      nameofequipment: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]]
    })
    this.getroomtypedata();
    this.getmovablecount();
  }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'Asset-Stock Report'); // table id, file name
  }

  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any;
  getroomtypedata() {
    this.showSpinner = true;
    this.service.getequipmentreport().subscribe(res => {
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
  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }
  ///////view code starts for add equipment 
  equipmentData: any = [];
  record123(viewModal, row) {
    this.showSpinner = true;
    var data = {
      'equipment_name': row.nameofequipment,
    }
    this.service.getassethistory(data).subscribe((res) => {
      this.equipmentData = res.data;
      this.showSpinner = false;
    })
    this.modalService.open(viewModal, { centered: true, size: 'xl' })
  }
  todayscountdata: any = []
  getmovablecount() {
    this.service.movablecount().subscribe((res: any) => {
      this.todayscountdata = res.data;
    })
  }
  todayscountdataselected: any = [];
  selecteddata: any;
  getcradsdata(event) {
    this.selecteddata = event;
    var data = {
      typeofdata: event
    }
    this.service.gettypeofselecteddata(data).subscribe((res: any) => {
      this.todayscountdataselected = res.data;
    })
  }
  getCardGradient(index: number): string {
    const hue = (index * 47) % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 70%, 40%))`;
  }
}
