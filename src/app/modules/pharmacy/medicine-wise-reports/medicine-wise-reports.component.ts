import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PharmaserviceService } from '../pharmaservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-medicine-wise-reports',
  templateUrl: './medicine-wise-reports.component.html',
  styleUrls: ['./medicine-wise-reports.component.scss']
})
export class MedicineWiseReportsComponent implements OnInit {


  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  // edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'medicine_name', 'gst_per', 'sale_date', 'sale_bill_no',
    'patient_type', 'uh_id', 'patient_name', 'patient_number', 'payment_mode', 'sale_without_discount_total', 'sale_gst_amount',
    'sale_disc_percnt', 'sale_grandtotal', 'no_of_items', 'latest_sale']
  selectColumns: string[] = ['select1'];


  @ViewChild('categoryPaginator', { read: MatPaginator }) categoryPaginator: MatPaginator;


  dataSourceTwo: MatTableDataSource<any>;
  nextdisplayedColumnsSecnd: string[] = ['i', 'medicine_name', 'gst_per', 'purchase_bill_no', 'invoice_date', 'invoice_number',
    'supplier_name', 'supplier_gst', 'no_of_items', 'grandtotal', 'latest_purchase']
  selectColumnsSecnd: string[] = ['select1'];



  @ViewChild('categoryPaginatorTwo', { read: MatPaginator }) categoryPaginatorTwo: MatPaginator;

  dataSourceThree: MatTableDataSource<any>;
  nextdisplayedColumnsThree: string[] = ['i', 'sale_date', 'sale_bill_no', 'uh_id', 'patient_name', 'patient_number',
    'payment_mode', 'medicine_name', 'schedule_drugs', 'expirydate', 'eachcost', 'total_tabs']
  selectColumnsThree: string[] = ['select1'];




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

  allMedicinesData: any = [];

  FavouriteMedicine: any;



  constructor(private formBuilder: FormBuilder, private router: Router,
    private service: PharmaserviceService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.getmedicinename();

    this.service.getmedicinename().subscribe((res) => {
  

      this.allMedicinesData = res.data;

      this.filteredMedicine = this.allMedicinesData.filter(bill => {
        return bill.current_medicine == 'true';
      });

      this.FavouriteMedicine = this.filteredMedicine[0].medicine_name
      var data = {
        'medicine_id': this.filteredMedicine[0].id

      }
  

      this.changeMedicineName(data)


    });
  }



  setAnmedicinetoTrue(event) {
    this.showSpinner = true
    this.service.setMedicineAsCurrent(event).subscribe((res) => {
      this.showSpinner = false
      if (res.status == 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Medicine Fixed !",
          showConfirmButton: false,
          timer: 1500,
        });
        this.ngOnInit()
      }
      else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Sorry Try Again !",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })
  }



  data: any;
  medicine: any;


  filteredMedicine

  purchaseData: any

  scheduleOgnl: any;

  getmedicinename() {
    this.service.getSaleMedicineitemsonly().subscribe((res) => {
      this.data = res.data;
    });

    this.service.getPurchaseMedicineitemsonly().subscribe((res) => {
      this.purchaseData = res.data;
    });

    this.service.getScheduleProductsItems().subscribe((res) => {
      this.scheduleOgnl = res.data;
      this.categorizeMedicines();
    });
  }




  showSpinner: boolean = false

  changeMedicineName(e) {
    this.showSpinner = true
    this.service.getSelctMedcneNfetchPtntdata(e).subscribe((res) => {

      this.showSpinner = false
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
    })

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
      this.headerclass['background-color'] = 'blue';
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


  exportTable(id, name) {
    TableUtil.exportTableToExcel(id, name);
  }





  medicinearr: any = [];
  fullPatientSaleBillsdts: any = [];


  getLatestBill(row, popupTempoBilldts) {
    this.showSpinner = true
    var data = {
      salepersonid: row.sale_id
    }
    this.medicinearr = []
    this.service.getparticularsalesdetials(data).subscribe((res: any) => {
      this.showSpinner = false
      res.data.map((item => {
        if (item.medicine_id == row.medicine_id) {
          item.matched_medicine = true;
        }
        else {
          item.matched_medicine = false;
        }
      }))
      this.medicinearr = res.data
    });
    this.showSpinner = true

    this.fullPatientSaleBillsdts = []

    this.service.getApatientAllSalebillsdata(row).subscribe((res) => {
      this.showSpinner = false
      res.data.map((item => {
        if (item.id == row.sale_id
        ) {
          item.matched_bill = true;
        }
        else {
          item.matched_bill = false;
        }
      }))
      this.fullPatientSaleBillsdts = res.data
    })

    this.modalService.open(popupTempoBilldts, { centered: false, size: "xl" });
  }



  medicinearrForEach: any = [];


  getPatientEachsaledts(centerDataModal: any, row) {
    var data2 = {
      salepersonid: row.id,
    };
    this.showSpinner = true
    this.medicinearrForEach = []
    this.service.getparticularsalesdetials(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.medicinearrForEach = res.data;
    });

    this.modalService.open(centerDataModal, { centered: false, size: "xl" });
  }



  //////////////////// ///////////////////////////////////////////////////////////////purchase form 


  changeMedicinePurchasName(e) {
    this.showSpinner = true
    this.service.getPurchsMedcneNfetchPtntdata(e).subscribe((res) => {
      this.showSpinner = false
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.masterdataTwo = res.data;
      this.clonedataTwo = this.masterdataTwo;
      this.dataSourceTwo = new MatTableDataSource(res.data);
      this.dataSourceTwo.paginator = this.categoryPaginator;
      this.dataSourceTwo.sort = this.sort;
    })
  }
  clonedataTwo: any;
  masterdataTwo: any;


  //table code Start
  applyFilterTwo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTwo.filter = filterValue.trim().toLowerCase();
  }
  originalandtoggleTwo(index) {

    if (index) {
      this.hideselect = !this.hideselect;
    } else {
      this.hideselect = false;
      this.headerclass['background-color'] = 'blue';
      this.reset = '';
    }
    this.clonedataTwo = this.masterdataTwo;
    this.dataSourceTwo = new MatTableDataSource(this.clonedataTwo);
    this.dataSourceTwo.paginator = this.paginator;
    this.dataSourceTwo.sort = null;
    this.dataSourceTwo.sort = this.sort;
  }

  columnfilterdataTwo(object, index) {
    if (object == undefined) {
      this.clonedataTwo = this.masterdataTwo;
      this.reset = '';
    } else {
      if (index == 0) {
        this.clonedataTwo = this.clonedataTwo.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSourceTwo = new MatTableDataSource(this.clonedataTwo);
  }




  medicinearrPurchase: any = [];
  fullSupplrPurchasBillsdts: any = []


  getLastPurchaseDts(row, poputoPurchsdts) {
    this.showSpinner = true
    var data = {
      supplierid: row.id
    }
    this.medicinearrPurchase = []
    this.service.getAllitemsofPurchase(data).subscribe((res: any) => {
      this.showSpinner = false
      res.data.map((item => {
        if (item.medicine_id == row.medicine_id) {
          item.matched_medicine = true;
        }
        else {
          item.matched_medicine = false;
        }
      }))
      this.medicinearrPurchase = res.data
    });
    this.showSpinner = true
    this.fullSupplrPurchasBillsdts = []
    this.service.getAsupplrAllPurchsbillsdata(row).subscribe((res) => {
      this.showSpinner = false
      res.data.map((item => {
        if (item.id == row.id
        ) {
          item.matched_bill = true;
        }
        else {
          item.matched_bill = false;
        }
      }))
      this.fullSupplrPurchasBillsdts = res.data
    })
    this.modalService.open(poputoPurchsdts, { centered: false, size: "xl" });
  }

  medicinePrchsForEach: any = []

  getSuplrEachPrchsdts(centerPurchsModal: any, row) {
    var data2 = {
      supplierid: row.id,
    };
    this.showSpinner = true
    this.medicinePrchsForEach = []
    this.service.getAllitemsofPurchase(data2).subscribe((res: any) => {
      this.showSpinner = false
      this.medicinePrchsForEach = res.data;
    });

    this.modalService.open(centerPurchsModal, { centered: false, size: "xl" });
  }





  //////////////////// /////////////////////////////////////////////////////////////// Schedule  form 

  categorizedMedicines: any = [];

  categorizeMedicines() {

    const categoriesMap: Record<string, any[]> = {};

    this.scheduleOgnl.forEach(medicine => {
      const category = medicine.schedule_drugs.toUpperCase(); // Normalize to uppercase
      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }
      categoriesMap[category].push(medicine);
    });
    // Convert categoriesMap to a format suitable for ng-select
    this.categorizedMedicines = Object.keys(categoriesMap).map(category => ({
      category: category,
      medicines: categoriesMap[category]
    }));
  }



  SlectCatgy(e) {
    this.showSpinner = true
    this.service.searchScheduleSaleItems(e).subscribe((res: any) => {
      this.showSpinner = false
      var id = 0;
      res.data.map((res) => {
        res.i = id + 1;
        id++;
      });
      this.masterdataThree = res.data;
      this.clonedataThree = this.masterdataThree;
      this.dataSourceThree = new MatTableDataSource(res.data);
      this.dataSourceThree.paginator = this.categoryPaginatorTwo;
      this.dataSourceThree.sort = this.sort;
    });
  }



  clonedataThree: any;
  masterdataThree: any;


  //table code Start
  applyFilterThree(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceThree.filter = filterValue.trim().toLowerCase();
  }
  originalandtoggleThree(index) {

    if (index) {
      this.hideselect = !this.hideselect;
    } else {
      this.hideselect = false;
      this.headerclass['background-color'] = 'blue';
      this.reset = '';
    }
    this.clonedataThree = this.masterdataThree;
    this.dataSourceThree = new MatTableDataSource(this.clonedataThree);
    this.dataSourceThree.paginator = this.paginator;
    this.dataSourceThree.sort = null;
    this.dataSourceThree.sort = this.sort;
  }

  columnfilterdataThree(object, index) {
    if (object == undefined) {
      this.clonedataThree = this.masterdataThree;
      this.reset = '';
    } else {
      if (index == 0) {
        this.clonedataThree = this.clonedataThree.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.dataSourceThree = new MatTableDataSource(this.clonedataThree);
  }

  Printmedicinewise(dataSourceThree) {
    sessionStorage.setItem('medicine-wise-print', JSON.stringify(dataSourceThree.filteredData));
    this.router.navigate(['medicine-wise-print']);
  }

}











