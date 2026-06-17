import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LabsServicesService } from '../labs-services.service';


@Component({
  selector: 'app-lab-stock-tracking',
  templateUrl: './lab-stock-tracking.component.html',
  styleUrls: ['./lab-stock-tracking.component.scss']
})
export class LabStockTrackingComponent implements OnInit {

  submitted: boolean;
  showSpinner: boolean;

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array

  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  @ViewChild('categoryPaginator', { read: MatPaginator }) categoryPaginator: MatPaginator;

  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'kit_name', 'totalquantity', 'sale_quantity', 'available_quantity', 'expirydate', 'view']
  selectColumns: string[] = ['select1', 'select2'];


  hideselect: boolean = false;
  isDownloading: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;

  clonedata: any[] = [];
  cust_color: string = 'blue';
  headerclass = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'dodgerblue',
    'color': 'white'
  };

  constructor(private formBuilder: FormBuilder, private service: LabsServicesService,
    private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.getAllstockdts();
  }

  data: any;
  getAllstockdts() {
    this.service.getKitsreportsdata().subscribe((res: any) => {      
      this.data = res.data;
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

  saleWiseTrackingData: any;

  geteachkitdata(centerDataModal, row) {
    var data2 = {
      kit_id: row.kit_id,
      kit_name: row.kit_name,
    };
    this.showSpinner = true
    this.service.geteachkitdata(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.saleWiseTrackingData = res.data
    });

    this.modalService.open(centerDataModal, { centered: true, size: "xl" });
  }

  availability_qnty: any;
  mrp_purchase: any;
  Best_sellers: any = [];

  getKitsRecords(kit_name, kit_id, forMedicineTempo) {
    var data = {
      'kit_id': kit_id,
      'kit_name': kit_name
    }
    this.showSpinner = true
    this.service.getFewKitsAnlysis(data).subscribe((res) => {
      this.showSpinner = false
      this.availability_qnty = res.data[0][0]
      this.mrp_purchase = res.data[1][0]
      this.Best_sellers = res.data[2]
    })
    this.modalService.open(forMedicineTempo, { centered: true, size: "m" });
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
      this.headerclass['background-color'] = 'white';
      this.reset = '';
    }
    this.clonedata = this.masterdata;
    this.dataSource = new MatTableDataSource(this.clonedata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = null;
    this.dataSource.sort = this.sort;
  }

  dismisBox() {
    this.modalService.dismissAll()
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

  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }


}
