import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { OpServicesService } from '../../op-patients/op-services.service';
@Component({
  selector: 'app-nabh-qi',
  templateUrl: './nabh-qi.component.html',
  styleUrls: ['./nabh-qi.component.scss']
})
export class NabhQiComponent {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  initialValues;
  nextdisplayedColumns: string[] = ['i', 'department', 'standard', 'indicator', 'definition', 'formula', 'unit', 'guide', 'usr_nm', 'view'];
  selectColumns: string[] = [];
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
  breadCrumbItems: Array<{}>;
  addnabhForm: FormGroup;
  addNew: FormGroup;
  addNewtime: FormGroup;
  submitte: boolean = false
  showSpinner: boolean = false
  ngOnInit(): void {
    this.get();
  }
  constructor(public formBuilder: FormBuilder, private myservice: OpServicesService, public modalService: NgbModal) {

    this.addnabhForm = this.formBuilder.group({
      department: ["", [Validators.required]],
      indicator: ["", [Validators.required]],
      standard: ["", [Validators.required]],
      formula: ["", [Validators.required]],
      unit: ["", Validators.required],
      definition: ["", [Validators.required]],
      guide: ["", [Validators.required]],
      user_id: [''],
      usr_nm: [''],
    });
    this.addNew = this.formBuilder.group({
      new_type: [""]
    });


    this.getNabh()
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  get valid() {
    return this.addnabhForm.controls
  }


  addnabh() {
   
    this.submitte = true;
    
    this.showSpinner = true
    if (this.addnabhForm.invalid) {
      this.showSpinner = false
      return;
    } else {
      this.addnabhForm.value.user_id = localStorage.getItem('user_id'),
        this.addnabhForm.value.usr_nm = localStorage.getItem('usr_nm'),
       

      this.myservice.Add_nabh(this.addnabhForm.value).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.showSpinner = false
          this.submitte = false;
          this.addnabhForm.reset();
          this.getNabh();
        } else {
          Swal.fire('Failed');
          this.showSpinner = false
        }
      })
    }
  }
  hideme: boolean[] = [];
  data: any = [];
  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }
  nabhData: any = [];
  getNabh() {
    this.myservice.getnabhdata().subscribe((res) => {
      this.nabhData = res.data;
      for (let i = 0; i < this.nabhData.length; i++) {
        this.hideme.push(true);
      }
      res.data.map((res, index) => { res.i = ++index; })
      this.masterdata = res.data;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  dismiss(editFormTempo) {
    this.modalService.dismissAll(editFormTempo)
  }
  department: any[];
  timings: any[];
  get() {
    this.myservice.getdepartment().subscribe((res: any) => {
      this.department = res.data;
    });

  }
  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.addnewtype(openPopforNew)
    }
  }

  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }
  dis() {
    this.modalService.dismissAll()
  }

  sub: boolean = false;
  subs: boolean = false;
  submitNew() {
    this.sub = true
    if (this.addNew.invalid) {
      alert("Please Add Type")
    }
    else {
      var data = {
        'name': this.addNew.value.new_type
      }
      this.myservice.addNewdepartment(data).subscribe((res) => {
        if (res.status == 200) {
          Swal.fire({
            title: "Good job!",
            text: "New Department Type Added",
            icon: "success"
          })
          this.modalService.dismissAll()
          this.addNew.reset()
          this.get()
        }
      })
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }
  rowData: any;
  viewDetails(row, viewTemplate) {
    this.rowData = [row]
    this.modalService.open(viewTemplate, { centered: true, size: "lg" });
  }

}

