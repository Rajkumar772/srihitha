import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';
import { DigilockerService } from '../digilocker.service';


@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.scss']
})
export class LockerComponent implements OnInit {
  hideselect: boolean = false;

  reset: any = '';
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;
  dataSource!: MatTableDataSource<any>;
  nextdisplayedColumns: string[] = ['i', 'documentname', 'documents'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2'];
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };
  updateform: FormGroup; submitted: boolean = false; showSpinner: boolean = false;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: DigilockerService) {
    this.updateform = this.formBuilder.group({
      upload_documents: ['', [Validators.required]],
      documentname: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getlockerreport();
    //   if (localStorage.getItem('auth') === '1') {
    //   this.isAuthorized = true;
    // }
    const auth = localStorage.getItem('auth');
    if (auth === '1') {
      this.isAuthorized = true;
    }
  }
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
    this.service.uploadoriginaldocumentsdigipost(data).subscribe({
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
          this.getlockerreport();
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
  get f() {
    return this.updateform.controls
  }
  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }
  isPdf(url: string): boolean {
    if (!url) return false;
    return url.toLowerCase().split('?')[0].endsWith('.pdf');
  }

  popupImage: string | null = null;

  imagepopup(url: string) {
    this.popupImage = url;
  }

  closeImagePopup() {
    this.popupImage = null;
  }

  casefiledata: any = [];
  getlockerreport() {
    var data = {
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      user_role: localStorage.getItem('user_role'),
    }
    this.service.getdigilockerreport(data).subscribe(res => {
    
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


  isAuthorized: boolean = false;
  enteredPassword: string = '';
  wrongPassword: boolean = false;


  
  checkPassword() {
    const fullNumber = localStorage.getItem('number') || '';
    const last4 = fullNumber.slice(-4);

    if (this.enteredPassword === last4) {
      this.isAuthorized = true;    
      this.wrongPassword = false;
      localStorage.setItem('auth', '1');  // Persist login
      // ✅ Do NOT show any popup here
    } else {
      this.wrongPassword = true;
    }
  }
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('auth');  // Clear login flag
        this.isAuthorized = false;
        
      }
    });
  }
}
