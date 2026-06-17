import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/modules/permissions/services/permission.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { data } from 'jquery';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
 Registerform!: FormGroup;
  submitted = false;

  item_image: any;
  filetypes: any;
  reviewimg = '';
  imagedata: { item_image: string; filetype: any }[] = [];
  review = false;

  showSpinner = false;

  displayedColumns: string[] = ['id','fromdate','todate','image','license'];
  dataSource = new MatTableDataSource<any>([]);
  searchKey = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private permissionServ: InPatienrservicesService) {
    this.Registerform = this.fb.group({
      category_image: ['', [Validators.required]],
      fromdate:['', [Validators.required]],
      todate:['', [Validators.required]],
      license:['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.gettracking();
  }

  ngAfterViewInit(): void {
    // attach paginator safely after view init
    this.dataSource.paginator = this.paginator;
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  clearFilter() {
    this.searchKey = '';
    this.applyFilter();
  }


  trackingsub() {
    this.showSpinner = true;
    this.submitted = true;

    if (this.Registerform.invalid) {
      this.showSpinner = false;
      return;
    }

    const data = {
      form: this.Registerform.value,
      item_image: this.item_image,
      filetypes: this.filetypes,
      fromdate:this.Registerform.value.fromdate,
      todate:this.Registerform.value.todate,
      license:this.Registerform.value.license
    };
   
    this.permissionServ.postlicense(data).subscribe((res: any) => {
      this.showSpinner = false;
      if (res?.status === 200) {
        alert('success');
        this.review = false;
        this.gettracking();
        this.Registerform.reset();
        this.submitted = false;
      } else {
        alert('failed');
      }
    }, () => {
      this.showSpinner = false;
      alert('failed');
    });
  }

  // onImageChange(e: any) {
  //   this.review = false;

  //   if (e.target.files && e.target.files.length) {
  //     const file: File = e.target.files[0];
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const imgFile = reader.result as string;

  //       const img = new Image();
  //       img.src = imgFile;

  //       img.onload = () => {
  //         // if (img.width === 2853 && img.height === 1275) {
  //           this.review = true;

  //           const parts = file.name.split('.');
  //           const imgtype = parts[parts.length - 1];

  //           this.reviewimg = imgFile;
  //           this.filetypes = imgtype;
  //           const UploadImage = { item_image: imgFile, filetype: imgtype };
  //           this.imagedata = [UploadImage];
  //           this.item_image = this.imagedata[0].item_image;
  //           this.filetypes = this.imagedata[0].filetype;
  //         // } else {
  //         //   alert('Image must be exactly 2853 x 1275 pixels!');
  //         //   this.review = false;
  //         //   e.target.value = '';
  //         // }
  //       };
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }



  onImageChange(e: any) {
  this.review = false;

  if (e.target.files && e.target.files.length) {
    const file: File = e.target.files[0];
    const reader = new FileReader();
    const parts = file.name.split('.');
    const filetype = parts[parts.length - 1].toLowerCase();

    reader.onload = () => {
      const fileData = reader.result as string;

      // Check if it's an image
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.src = fileData;

        img.onload = () => {
          // Optional: check image dimensions if needed
          // if (img.width === 2853 && img.height === 1275) { ... }

          this.review = true;
          this.reviewimg = fileData;
          this.filetypes = filetype;

          const UploadFile = { item_image: fileData, filetype };
          this.imagedata = [UploadFile];

          this.item_image = this.imagedata[0].item_image;
          this.filetypes = this.imagedata[0].filetype;
        };
      }
      // If it's a PDF
      else if (file.type === 'application/pdf') {
        this.review = true;
        this.reviewimg = ''; // PDFs don't preview as image, could show filename instead
        this.filetypes = filetype;

        const UploadFile = { item_image: fileData, filetype };
        this.imagedata = [UploadFile];

        this.item_image = this.imagedata[0].item_image;
        this.filetypes = this.imagedata[0].filetype;
      } else {
        alert('Invalid file type. Only images or PDFs allowed.');
        e.target.value = '';
      }
    };

    reader.readAsDataURL(file);
  }
}


  get valid() {
    return this.Registerform.controls;
  }


  gettracking() {
  this.permissionServ.getlicensetracking().subscribe((res: any) => {
    
    if (res?.status === 200 && Array.isArray(res.data)) {
      // Add filetype dynamically based on file extension from image URL
      const processedData = res.data.map((item: any) => {
        const urlParts = item.image.split('.');
        const ext = urlParts[urlParts.length - 1].toLowerCase();
        return { ...item, filetype: ext };
      });

      this.dataSource.data = processedData;

      // Assign paginator if available
      if (this.paginator) this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource.data = [];
    }
  });
}

  typesubmit: boolean = false
  get type() {
    return this.Registerform.controls;
  }
  exportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'License Tracking');
    XLSX.writeFile(wb, 'Licensetracking_Report.xlsx');
  }

  exportPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['ID', 'From Date', 'To Date','License']],
      body: this.dataSource.filteredData.map(item => [
        item.id, item.fromdate, item.todate,item.license
      ]),
    });
    doc.save('Licensetracking_Report.pdf');
  }


}
