import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PharmaserviceService } from '../pharmaservice.service';
import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pharmacy-stock',
  templateUrl: './pharmacy-stock.component.html',
  styleUrls: ['./pharmacy-stock.component.scss']
})
export class PharmacyStockComponent implements OnInit {
  submitfromtotime: FormGroup
  submitted: boolean;
  showSpinner: boolean;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  dataSourceScnd: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  @ViewChild('categoryPaginator', { read: MatPaginator }) categoryPaginator: MatPaginator;

  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'batch_no', 'medicine_name', 'composition_name', 'totalquantity', 'sale_quantity', 'available_quantity', 'expirydate', 'view']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4'];

  nextdisplayedColumnsSecond: string[] = ['i', 'medicine_name', 'available_quantity']
  selectColumnsSecond: string[] = ['select1', 'select2', 'select3'];

  hideselect: boolean = false;
  isDownloading: boolean = false;
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

  constructor(private formBuilder: FormBuilder, private service: PharmaserviceService,
    private modalService: NgbModal, private router: Router) { }

  ngOnInit(): void {
    this.getAllstockdts();
    this.functionForOverall();
  }

  data: any;
  getAllstockdts() {
    this.service.getsalereportsdata().subscribe((res: any) => {
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

  saleWiseTrackingData: any;

  gotEachMedicineSaleData(centerDataModal, row) {
    var data2 = {
      medicine_id: row.medicine_id,
      medicine_name: row.medicine_name,
      batch_no: row.batch_no,
    };
    this.showSpinner = true
    this.service.gettEachMedicineSaleData(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.saleWiseTrackingData = res.data
    });

    this.modalService.open(centerDataModal, { centered: true, size: "xl" });
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }

  dismisBox() {
    this.modalService.dismissAll()
  }

  availability_qnty: any;
  mrp_purchase: any;
  Best_sellers: any = [];

  getMedicineRecords(medicine_name, medicine_id, forMedicineTempo) {
    var data = {
      'medicine_id': medicine_id,
      'medicine_name': medicine_name
    }
    this.showSpinner = true
    this.service.getFewMedicineAnlysis(data).subscribe((res) => {
      this.showSpinner = false
      this.availability_qnty = res.data[0][0]
      this.mrp_purchase = res.data[1][0]
      this.Best_sellers = res.data[2]
    })
    this.modalService.open(forMedicineTempo, { centered: true, size: "m" });
  }

  functionForfilter(e) {
    if (e == 1) {
      const expiringDrugs = this.getDrugsExpiringInNextThreeMonths(this.masterdata);
      this.dataSource = new MatTableDataSource(expiringDrugs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Showing Expiry Drugs List within 3 months",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (e == 2) {
      const noMovementDrugs = this.noMovementdrugsFunc(this.masterdata)
      this.dataSource = new MatTableDataSource(noMovementDrugs);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Showing No Movement Drugs List",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (e == 3) {
      const completelySoldout = this.completelySoldout(this.masterdata)
      this.dataSource = new MatTableDataSource(completelySoldout);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Showing Sold Out Drugs",
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      this.ngOnInit()
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Showing Complete Stock",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  noMovementdrugsFunc(drugs) {
    return drugs.filter(drug => {
      return drug.sale_quantity == 0;
    });
  }

  isExpired(expiryDate: string): boolean {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return expiry < currentDate; // Returns true if the expiry date is before today
  }

  isWithinThreeMonths(expiryDate: string): boolean {
    const currentDate = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);
    const expiry = new Date(expiryDate);
    return expiry >= currentDate && expiry <= threeMonthsFromNow;
  }

  getDrugsExpiringInNextThreeMonths(drugs) {
    const currentDate = new Date();
    const threeMonthsFromNow = new Date();
    // Set the date to 3 months ahead
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

    return drugs.filter(drug => {
      const expiryDate = new Date(drug.expirydate);
      return expiryDate >= currentDate && expiryDate <= threeMonthsFromNow;
    });
  }

  completelySoldout(drugs) {
    return drugs.filter(drug => {
      return drug.sale_quantity == drug.totalquantity;
    });
  }

  ///////////////////////////////////// Second Mat table 

  masterdataScnd: any;
  clonedataScnd: any;
  hideselectTwo: boolean = false;

  applyFilterTwo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceScnd.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggleTwo(index) {
    if (index) {
      this.hideselectTwo = !this.hideselectTwo;
    } else {
      this.hideselectTwo = false;
      this.headerclass['background-color'] = 'white';
      this.reset = '';
    }
    this.clonedataScnd = this.masterdataScnd;
    this.dataSourceScnd = new MatTableDataSource(this.clonedataScnd);
    this.dataSourceScnd.paginator = this.paginator;
    this.dataSourceScnd.sort = null;
    this.dataSourceScnd.sort = this.sort;
  }

  columnfilterdataTwo(object, index) {
    if (object == undefined) {
      this.clonedataScnd = this.masterdataScnd;
      this.reset = '';
    } else {
      if (index == 0) {
        this.clonedataScnd = this.clonedataScnd.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSourceScnd = new MatTableDataSource(this.clonedataScnd);
  }

  functionForOverall() {
    this.showSpinner = true
    this.service.getOverallStock().subscribe((res: any) => {
      this.showSpinner = false
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.masterdataScnd = res.data;
      this.clonedataScnd = this.masterdataScnd;
      this.dataSourceScnd = new MatTableDataSource(res.data);
      this.dataSourceScnd.paginator = this.categoryPaginator;
      this.dataSourceScnd.sort = this.sort;
    });
  }

  goToOverlPrint() {
    this.router.navigate(['pharOverallStock']);
  }

}
