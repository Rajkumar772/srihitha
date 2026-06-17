import { Component, Inject, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiagnosticServicesService } from '../diagnostic-services.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-x-ray',
  templateUrl: './x-ray.component.html',
  styleUrls: ['./x-ray.component.scss']
})
export class XRayComponent implements OnInit {
  patientDetailsForm: FormGroup;
  labAssgnSearch: FormGroup;
  patientTestsForm: FormGroup;
  showSpinner: boolean = false;
  submitted: boolean = false;
  forDoctor: boolean = false
  paymentload: boolean = false;
  submitt: boolean = false;
  forOP: boolean = true
  diagnostic_doctor: any = []
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;
  private patientSelection = new Subject<any>();
  nextdisplayedColumns: string[] = ['i', 'uh_id', 'name', 'age', 'gender', 'image1', 'image2', 'image3', 'image4']
  selectColumns: string[] = ['select1', 'select2', 'select3', 'select4'];
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

  constructor(private service: DiagnosticServicesService, private formbuilder: FormBuilder, private cd: ChangeDetectorRef, private modalCtrl: NgbModal, @Inject(PLATFORM_ID) private platformId: Object) {
    this.patientDetailsForm = this.formbuilder.group({
      uh_id: [''],
      patient_type: ["OP"],
      // sur_name: [''],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      imageurl: ['']
    });
    this.labAssgnSearch = this.formbuilder.group({
      from_date: ['', [Validators.required]],
      to_date: ['', [Validators.required]],
    })




  }
  ngOnInit(): void {
    this.getxraydata();
    this.gotDataAllpatients();
    this.patientSelection.pipe(debounceTime(300)).subscribe((event) => {
      this.getOldOp(event);
    });
  }

  getOldOp(e: any) {
    this.gotAllpatients.map((res) => {
      if (res.uh_id == e) {
        this.patientDetailsForm.patchValue({
          // sur_name: res.sur_name,
          name: res.name,
          age: res.age,
          phone_number: res.phone_number,
          gender: res.gender
        });
        this.cd.markForCheck();
      }
    });
  }
  trackByUhId(index: number, item: any): string {
    return item.uh_id;
  }
  onUHIDChange(event: any) {
    this.patientSelection.next(event);
  }
  get validGrup() {
    return this.patientDetailsForm.controls;
  }
  get validMbr() {
    return this.patientTestsForm.controls;
  }
  paymentslot(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload = true
    } else if (as == 'CASH') {
      this.paymentload = false
    }
  }
  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  gotAllpatients: any;
  gotDataAllpatients() {
    this.service.getDataAllpatients().subscribe((res) => {
      this.gotAllpatients = res.data;

    });

  }

  imagesData: any = [];
  onImageChange(e) {

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length) {
      if (this.imagesData.length + selectedFiles.length > 4) {
        alert("You can upload a maximum of 4 images.");
        return;
      }
      for (let i = 0; i < selectedFiles.length; i++) {
        const imdata = selectedFiles[i];
        let reader = new FileReader();
        reader.readAsDataURL(imdata);
        reader.onload = () => {
          const imgFile = reader.result as string;
          const bfile_typeEmpl = selectedFiles[i].name.split('.');
          const imgtype = bfile_typeEmpl[bfile_typeEmpl.length - 1];
          this.imagesData.push({ reviewimg: imgFile, filetype: imgtype });
          this.imagesData.map((res, index) => {
            res.serlno = index + 1;
          });
        };
      }
    }
  }
  deleteImage(index: number) {
    this.imagesData.splice(index, 1);
    if (this.imagesData.length === 0) {
      this.patientDetailsForm.get('imageurl')?.reset();
    }

  }
  Addxrays() {
    this.submitted=true;
    if (this.patientDetailsForm.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    } else {
      var data = {
        uh_id: this.patientDetailsForm.value.uh_id,
        patient_type: this.patientDetailsForm.value.patient_type,
        // sur_name: this.patientDetailsForm.value.sur_name,
        name: this.patientDetailsForm.value.name,
        age: this.patientDetailsForm.value.age,
        gender: this.patientDetailsForm.value.gender,
        images: this.imagesData
      }
      this.showSpinner = true;
      this.service.xraysubmit(data).subscribe((res) => {
        this.showSpinner = false;
        if (res.status == 200) {
          Swal.fire({
            title: 'Submitted Successfully',
            position: 'top-end',
            icon: 'success',
            timer: 1500,
          });
          this.patientDetailsForm.reset();
          this.imagesData = [];
          this.imagesData = ''
          this.patientDetailsForm.get('imageurl')?.reset();
          this.submitted = false;
          this.getxraydata()
        }
        else {
          Swal.fire({
            title: 'Failed',
            position: 'top-end',
            icon: 'error',
            timer: 1500,
          })
        }
      })
    }

  }
  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
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
      this.headerclass['background-color'] = 'black';
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
  exportTable(i, organizer_name) {
    TableUtil.exportTableToExcel(i, organizer_name);
  }
  diagData: any
  getxraydata() {
    this.showSpinner = true;
    this.service.getxraydata().subscribe((res) => {

      this.showSpinner = false;
      res.data.map((res, index) => {
        res.i = ++index;
      })
      this.diagData = res.data
      this.masterdata = res.data;
      this.clonedata = this.masterdata;
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    })
  }
  @ViewChild("quickView", { static: false }) QuickView: TemplateRef<any>;
  public closeResult: string;
  public modalOpen: boolean = false;


  get validDate() {
    return this.labAssgnSearch.controls;
  }
  SearchDATE() {
    this.submitt = true
    if (this.labAssgnSearch.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {

      this.showSpinner = true
      this.service.getSearchxrayData(this.labAssgnSearch.value).subscribe((res) => {
        this.showSpinner = false;


        if (res.data.length == 0) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'NO DATA FOUND'
          })
        }
        res.data.map((res, index) => {
          res.i = ++index;
        })
        this.diagData = []
        this.diagData = res.data;
        this.masterdata = res.data;
        this.clonedata = this.masterdata;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })

    }

  }



  imageUrl: string = '';
  isVisible: boolean = false;

  openModal(image: string): void {
    this.imageUrl = image;
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
    this.imageUrl = '';
  }



}
