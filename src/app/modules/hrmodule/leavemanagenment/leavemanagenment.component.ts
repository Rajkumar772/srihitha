// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PermissionService } from 'src/app/modules/permissions/services/permission.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HrmoduleserviceService } from '../hrmoduleservice.service';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { TableUtil } from 'src/app/tableUtil';

// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-leavemanagenment',
  templateUrl: './leavemanagenment.component.html',
  styleUrls: ['./leavemanagenment.component.scss']
})
export class LeavemanagenmentComponent implements OnInit {

  Registerform: FormGroup;
  formBuilder: any;
  submitted: boolean;

  item_image: any;
  filetypes: any;
  reviewimg: string;
  imagedata: { item_image: string; filetype: any; }[];
  review: boolean;
  showSpinner: boolean = false;
  //  displayedColumns: string[] = ['id', 'image'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;

  nextdisplayedColumns: string[] = ['i', 'usr_nm', 'number', 'fromdate', 'todate','leavetype','reason','noofdays', 'statusupdate', 'reject_reason', 'image', 'status'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5','select12', 'select6', 'select7', 'select8', 'select9'];
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

  dataSource!: MatTableDataSource<any>;
  searchKey: string = ''; user_idadmin: any
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private service: HrmoduleserviceService) {
    this.Registerform = this.fb.group({
      // category_name         : ['', [Validators.required]],
      fromdate: ['', [Validators.required]],
      todate: ['', [Validators.required]],
      reason: ['', [Validators.required]],
      category_image: ['', ],
      leavetype: ['', [Validators.required]],
      session: ['FULL', Validators.required],
      noofdays:['',[Validators.required]]
    });
    this.user_idadmin = localStorage.getItem('user_role')
  }
  ngOnInit(): void {
    this.getleavereportdata();
    this.user_idadmin = localStorage.getItem('user_role');
    this.Registerform.valueChanges.subscribe(() => {
    this.calculateDays();
  });
  }

 categoryubmit() {
  this.showSpinner = true;
  this.submitted = true;
  if (this.Registerform.invalid) {
    alert("Please fill all details");
    this.showSpinner = false;
    return;
  }
  const data: any = {
    fromdate: this.Registerform.value.fromdate,
    todate: this.Registerform.value.todate,
    leavetype: this.Registerform.value.leavetype,
    session: this.Registerform.value.session,
    noofdays: this.Registerform.value.noofdays,
    reason: this.Registerform.value.reason,
    user_id: localStorage.getItem('user_id'),
    usr_nm: localStorage.getItem('usr_nm'),
    number: localStorage.getItem('number'),
  };

  // ✅ image optional
  if (this.item_image) {
    data.item_image = this.item_image;
    data.filetypes = this.filetypes;
  } else {
    data.item_image = null;
    data.filetypes = null;
  }

  

  this.service.leaveapprovalpost(data).subscribe((res: any) => {
    this.showSpinner = false;

    if (res.status == 200) {
      alert('success');
      this.review = false;
      this.getleavereportdata();
      this.Registerform.reset();
      this.item_image = null;
      this.filetypes = null;
    } else {
      alert('failed');
    }
  }, err => {
    this.showSpinner = false;
    alert('failed');
  });
}




  // review: boolean = false;
  // reviewimg: string = '';        // for image preview
  reviewPdfUrl: string = '';     // for pdf preview (base64)
  // filetypes: string = '';
  // imagedata: any[] = [];
  // item_image: string = '';

  onImageChange(e: any) {
    this.review = false;
    this.reviewimg = '';
    this.reviewPdfUrl = '';
    if (e?.target?.files && e.target.files.length) {
      const file: File = e.target.files[0];
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isPdf = ext === 'pdf' || file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext);

      // ✅ allow only image or pdf
      if (!isImage && !isPdf) {
        alert('Only Image or PDF allowed!');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const fileBase64 = reader.result as string;

        // ✅ If PDF
        if (isPdf) {
          this.review = true;

          this.filetypes = 'pdf';
          this.reviewPdfUrl = fileBase64;  // use in iframe/object if you want

          const UploadFile = {
            item_image: fileBase64,
            filetype: 'pdf',
          };

          this.imagedata = [UploadFile];
          this.item_image = this.imagedata[0].item_image;
          this.filetypes = this.imagedata[0].filetype;
          return;
        }

        // ✅ If Image (keep your dimension check if needed)
        const img = new Image();
        img.src = fileBase64;

        img.onload = () => {
          // if (img.width === 2853 && img.height === 1275) {
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
          // } else {
          //   alert('Image must be exactly 2853 x 1275 pixels!');
          //   this.review = false;
          //   e.target.value = '';
          // }
        };
      };
    }
  }



  get valid() {
    return this.Registerform.controls;
  }

  casefiledata: any = [];
  getleavereportdata() {
    var data = {
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      user_role: localStorage.getItem('user_role'),
    }
    this.service.gethremployeeleaveapproval(data).subscribe(res => {
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


  //   }


  popupImgUrl: string = '';
  isImgPopupOpen: boolean = false;


  imagepopup(url: string) {
    if (!url) return;

    const cleanUrl = url.toLowerCase().split('?')[0];

    // ✅ If PDF -> open directly
    if (cleanUrl.endsWith('.pdf')) {
      window.open(url, '_blank');
      return;
    }

    // ✅ If Image -> open your existing modal
    this.popupImgUrl = url;
    this.isImgPopupOpen = true;
  }

  closeImgPopup() {
    this.isImgPopupOpen = false;
    this.popupImgUrl = '';
  }
  isPdf(url: string): boolean {
    if (!url) return false;
    return url.toLowerCase().split('?')[0].endsWith('.pdf');
  }

  get f() {
    return this.Registerform.controls
  }

  // statusList = [
  //   { label: 'Pending', value: 'NULL' },
  //   { label: 'Approved', value: 'APPROVED' },
  //   { label: 'Rejected', value: 'REJECTED' }
  // ];

  // getStatusClass(st: any) {
  //   const s = String(st ?? 'NULL').toUpperCase();
  //   return {
  //     'st-blue': (s === 'NULL' || s === 'PENDING'),
  //     'st-green': (s === 'APPROVED'),
  //     'st-red': (s === 'REJECTED')
  //   };
  // }

  statusList = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' }
];

// Returns CSS class for status
getStatusClass(status: string) {
  const s = (status || 'PENDING').toUpperCase();
  return {
    'st-orange': s === 'PENDING',
    'st-green': s === 'APPROVED',
    'st-red': s === 'REJECTED'
  };
}

// Optional: to show proper label in badge
getStatusLabel(status: string) {
  const found = this.statusList.find(x => x.value === status);
  return found ? found.label : 'Pending';
}



  // when api loads, convert null -> 'NULL' so dropdown selects correctly
  patchStatus(rows: any[]) {
    rows.forEach(r => r.status = r.status ? r.status.toString().toUpperCase() : 'NULL');
  }


 
  onStatusChange(row: any) {
  // Normalize status to uppercase, fallback to 'PENDING' instead of 'NULL'
  const st = (row.status ?? 'PENDING').toUpperCase();
  const prev = (row._prevStatus ?? 'PENDING').toUpperCase();

  // Display text for confirmation popup
  const displayStatus = (st === 'PENDING') ? 'Pending' : st.charAt(0) + st.slice(1).toLowerCase();

  // Handle status changes
  if (st === 'PENDING' || st === 'APPROVED') {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to set status to ${displayStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // Save actual status value (PENDING or APPROVED)
        row.status = st;
        this.updateStatus(row, null);
      } else {
        row.status = prev;
      }
    });
    return;
  }

  if (st === 'REJECTED') {
    Swal.fire({
      title: 'Reject Reason',
      input: 'text',
      inputPlaceholder: 'Enter reason',
      inputValidator: (value) => !value ? 'Reject reason is required' : undefined,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        row.status = 'REJECTED';
        this.updateStatus(row, result.value);
      } else {
        row.status = prev;
      }
    });
  }
}

  updateStatus(row: any, rejectReason: string | null) {
    const payload = {
      id: row.id,
      status: row.status,
      reject_reason: rejectReason,
      user_id: row.user_id
    };
   
    this.service.updateLeaveStatus(payload).subscribe((res) => {
      // Swal.fire('Updated Successfully', '', 'success');
      if (res.status == 200) {
        this.showSpinner = false;
        alert('success');
        this.review = false;
        this.getleavereportdata();
        this.Registerform.reset();
      } else {
        this.showSpinner = false;
        alert('failed');
      }
    });
  }
exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }


daysText: string = '0';
isMultiDayRange: boolean = false;
calculateDays() {
  const from = this.Registerform.get('fromdate')?.value;
  const to = this.Registerform.get('todate')?.value;
  const session = this.Registerform.get('session')?.value;

  if (!from || !to) {
    this.Registerform.patchValue({ noofdays: '' }, { emitEvent: false });
    return;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (toDate < fromDate) {
    this.Registerform.patchValue({ noofdays: '' }, { emitEvent: false });
    return;
  }

  const diffTime = toDate.getTime() - fromDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)) + 1;

  this.isMultiDayRange = diffDays > 1;

  let totalDays = 0;

  if (diffDays > 1) {
    this.Registerform.patchValue({ session: 'FULL' }, { emitEvent: false });
    totalDays = diffDays;
  } else {
    totalDays = session === 'FULL' ? 1 : 0.5;
  }

  this.Registerform.patchValue({ noofdays: totalDays }, { emitEvent: false });
}

}
