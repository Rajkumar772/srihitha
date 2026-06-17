import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmbulancetrackerService } from '../ambulancetracker.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';



@Component({
  selector: 'app-ambulance',
  templateUrl: './ambulance.component.html',
  styleUrls: ['./ambulance.component.scss']
})
export class AmbulanceComponent implements OnInit {
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;updateform: FormGroup;
  edit: boolean = false;                   // Edit value for
  // nextdisplayedColumns: string[] = ['i', 'roomtype', 'edit', 'delete'];
  nextdisplayedColumns: string[] = [
    'i',
    'vehicleregisternumber',
    'vehicletype',
    'vehiclemodel',
    'manufacturecompany',
    'yearofmanufacture',
    'fueltype',
    'edit',
    'view'

  ];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6'];
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
  submitted: boolean = false;
  ambulanceForm!: FormGroup;
  showSpinner: boolean = false;
  vehicleTypes: string[] = [
    'Basic Life Support (BLS)',
    'Advanced Life Support (ALS)',
    'Patient Transport',
    'ICU Ambulance'
  ];

  constructor(
    private fb: FormBuilder,
    private ambulanceSrv: AmbulancetrackerService,private modalService: NgbModal,
  ) { 
      this.updateform = this.fb.group({
      upload_documents: ['', [Validators.required]],
      documentname: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.ambulanceForm = this.fb.group({
      vehicleregisternumber: ['', Validators.required],
      vehicletype: ['', Validators.required],
      vehiclemodel: ['', Validators.required],
      manufacturecompany: ['', Validators.required],
      yearofmanufacture: ['', Validators.required],
      fueltype: ['', Validators.required],
    });
    this.getambulancedata();
  }
  save() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.ambulanceForm.invalid) {
      alert("Please enter details");
    } else {
      var data = {
        vehicleregisternumber: this.ambulanceForm.value.vehicleregisternumber,
        vehicletype: this.ambulanceForm.value.vehicletype,
        vehiclemodel: this.ambulanceForm.value.vehiclemodel,
        manufacturecompany: this.ambulanceForm.value.manufacturecompany,
        yearofmanufacture: this.ambulanceForm.value.yearofmanufacture,
        fueltype: this.ambulanceForm.value.fueltype,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
        user_role: localStorage.getItem('user_role'),
      }
      this.ambulanceSrv.vehicleregister(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.ambulanceForm.reset();
          this.showSpinner = false;
        } else {
          Swal.fire('Failed');
          this.showSpinner = false;
        }
      })
    }
  }
  get f() {
    return this.ambulanceForm.controls
  }
  casefiledata: any;
  getambulancedata() {
    this.ambulanceSrv.getAmbulancesregistervehicle().subscribe((res: any) => {
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


  /////image upload option 
  reviewPdfUrl: string = ''; item_image: any;
  filetypes: any;
  reviewimg: string; review: boolean;
  imagedata: { item_image: string; filetype: any; }[]; empid: any;
  onImageChange(e: any) {
    this.review = false;
    this.reviewimg = '';
    this.reviewPdfUrl = '';
    if (e?.target?.files && e.target.files.length) {
      const file: File = e.target.files[0];
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isPdf = ext === 'pdf' || file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext);
      if (!isImage && !isPdf) {
        alert('Only Image or PDF allowed!');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileBase64 = reader.result as string;
        if (isPdf) {
          this.review = true;
          this.filetypes = 'pdf';
          this.reviewPdfUrl = fileBase64;
          const UploadFile = {
            item_image: fileBase64,
            filetype: 'pdf',
          };
          this.imagedata = [UploadFile];
          this.item_image = this.imagedata[0].item_image;
          this.filetypes = this.imagedata[0].filetype;
          return;
        }
        const img = new Image();
        img.src = fileBase64;

        img.onload = () => {

          this.review = true;

          this.reviewimg = fileBase64;
          this.filetypes = ext;

          const UploadImage = {
            item_image: fileBase64,
            filetype: ext,
          };

          this.imagedata = [UploadImage];
          this.item_image = this.imagedata[0].item_image;
          this.filetypes = this.imagedata[0].filetype;

        };
      };
    }
  }
   dataget: any;
  uploaddocuments(data: any, openmodeluploaddocuments) {
    this.dataget = data;

    this.empid = this.dataget.id;
    this.updateform.patchValue({
      update_roomtype: this.dataget.roomtype
    })
    this.modalService.open(openmodeluploaddocuments, { size: 'xl', centered: true })
  }
  modalDismissemployee(addNew) {
    this.modalService.dismissAll(addNew)
  }
  submitfiles() {
    if (this.updateform.invalid) {
      alert('Please Fill Details');
      return;
    }
    this.submitted = true;
    this.showSpinner = true;
    const data: any = {
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      number: localStorage.getItem('number'),
      id: this.empid,
      documentname: this.updateform.value.documentname,
      item_image: this.item_image || null,
      filetypes: this.filetypes || null
    };
    this.ambulanceSrv.uploaddocumentvehicleregisterspost(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.updateform.reset();
          this.modalService.dismissAll();
          this.item_image = '';
          this.filetypes = '';
          this.reviewimg = '';
          this.reviewPdfUrl = '';
          this.getambulancedata();
        } else {
          Swal.fire('Failed');
        }
      },
      error: () => {
        this.showSpinner = false;
        alert('Failed');
      }
    });
  }



  //////view documents 
  getdocuments: any = [];

  imageDocuments: any[] = [];
  selectedImage: string = '';
  viewdocuments(data: any, openmodelviewdocuments: any) {
    this.empid = data.id;
    this.modalService.open(openmodelviewdocuments, {
      size: 'xl',
      centered: true
    });
    const payload = { id: this.empid };
    this.ambulanceSrv.getdocumenetsreport(payload).subscribe((res: any) => {
      const docs = res.data || [];
      // ✅ Filter only images
      this.imageDocuments = docs.filter((d: any) =>
        d.documents &&
        /\.(jpg|jpeg|png|webp|gif)$/i.test(d.documents)
      );
    });
  }
  openFullImage(imageUrl: string, fullImageModal: any) {
    this.selectedImage = imageUrl;
    this.modalService.open(fullImageModal, {
      size: 'xl',          // ✅ bigger than lg
      centered: true,
      windowClass: 'img-preview-modal', // ✅ custom width/height
      backdrop: 'static'
    });
  }
}
