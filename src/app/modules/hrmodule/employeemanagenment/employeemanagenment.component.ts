// import { Component, OnInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HrmoduleserviceService } from '../hrmoduleservice.service';
import { TableUtil } from 'src/app/tableUtil';
@Component({
  selector: 'app-employeemanagenment',
  templateUrl: './employeemanagenment.component.html',
  styleUrls: ['./employeemanagenment.component.scss']
})
export class EmployeemanagenmentComponent implements OnInit {

  addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'status', 'department', 'designation',  'employeementthrough', 'empidmanual', 'title', 'full_name', 'email', 'phone', 'gender', 'address_1', 'emergency_name', 'emergency_phone', 'secondaryemergency_name', 'secondaryemergency_phone', 'qualification','date_of_joining', 'referaldetails', 'edit', 'view'];
  selectColumns: string[] = ['selectSlno','select11', 'select12','select1', 'select16', 'select17', 'select18', 'select2', 'select3', 'select4', 'select24', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10','select13', 'select19', 'select14', 'select15'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any; updateformempstatus: FormGroup;
  age: any; adddepartment: FormGroup; adddesignation: FormGroup;
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
    private formBuilder: FormBuilder, private service: HrmoduleserviceService) {
    this.addemployeedetailsform = this.formBuilder.group({
      full_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address_1: [
        '',
        [
          Validators.required,
          Validators.minLength(25),
          Validators.pattern('^[a-zA-Z0-9\\s,./#-]+$')
        ]
      ],
      emergency_name: ['', Validators.required],
      emergency_phone: ['', Validators.required],
      secondaryemergency_name: ['', Validators.required],
      secondaryemergency_phone: ['', Validators.required],
      department: ['', Validators.required],
      designation: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      qualification: ['', Validators.required],
      employeementthrough: ['', Validators.required],
      empidmanual: ['', Validators.required],
      title: ['', Validators.required],
      referaldetails: [''],
      gender: ['', Validators.required]
    });
    this.adddepartment = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })

    this.adddesignation = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
    this.updateform = this.formBuilder.group({
      upload_documents: ['', [Validators.required]],
      documentname: ['', [Validators.required]]
    });
    this.updateformempstatus = this.formBuilder.group({
      updateempstatus: ['', [Validators.required]],
      resigndate: ['', [Validators.required]]
    });
  }

  user_id: any;
  usr_nm: any;
  user_role: any;
  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.user_role = localStorage.getItem("user_role");
    //  this.addemployeedetailsform = this.formBuilder.group({
    //    name: ['', [Validators.required]],
    //     full_name: ['', Validators.required],
    //   employee_id: [this.generateEmployeeId(), Validators.required],
    //   email: ['', [Validators.required, Validators.email]],

    //   address_1: ['', Validators.required],
    //   address_2: ['', Validators.required],
    //   emergency_name: ['', Validators.required],
    //   emergency_phone: ['', Validators.required],

    //   department: ['', Validators.required],
    //   designation: ['', Validators.required],
    //   date_of_joining: ['', Validators.required],

    //   basic_salary: ['', Validators.required],
    //   allowances: ['', Validators.required],

    //   username: ['', Validators.required],
    //   password: ['', [Validators.required, Validators.minLength(6)]],
    //  });
    // this.updateform = this.formBuilder.group({
    //   update_roomtype: ['', [Validators.required]]
    // })
    this.getroomtypedata();
    this.getdepartmentdropdowndata();
    this.getdesignationdropdowndata();
  }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }
  numericOnly(event): boolean {
    let patt = /^([0-9,.,_,/-])$/;
    let result = patt.test(event.key);
    return result;
  }

  submitEmployee() {
    this.submitted = true;
    this.showSpinner = true;

    // ✅ STOP submission if form is invalid
    if (this.addemployeedetailsform.invalid) {
      alert("Please enter details");
      this.showSpinner = false;
      return; // 🔥 THIS LINE WAS MISSING
    }

    const phone = this.addemployeedetailsform.value.phone;
    const emergency_phone = this.addemployeedetailsform.value.emergency_phone;
    const secondaryemergency_phone = this.addemployeedetailsform.value.secondaryemergency_phone;

    // ✅ STOP submission if phone numbers are same
    if (
      phone === emergency_phone ||
      phone === secondaryemergency_phone ||
      emergency_phone === secondaryemergency_phone
    ) {
      alert(
        'Mobile Number, Emergency Contact Phone, and Secondary Emergency Contact Phone must be different'
      );
      this.showSpinner = false;
      return;
    }

    const data = {
      full_name: this.addemployeedetailsform.value.full_name,
      phone: this.addemployeedetailsform.value.phone,
      email: this.addemployeedetailsform.value.email,
      address_1: this.addemployeedetailsform.value.address_1,
      emergency_name: this.addemployeedetailsform.value.emergency_name,
      gender: this.addemployeedetailsform.value.gender,
      emergency_phone: this.addemployeedetailsform.value.emergency_phone,
      secondaryemergency_name: this.addemployeedetailsform.value.secondaryemergency_name,
      secondaryemergency_phone: this.addemployeedetailsform.value.secondaryemergency_phone,
      qualification: this.addemployeedetailsform.value.qualification,
      department: this.addemployeedetailsform.value.department,
      designation: this.addemployeedetailsform.value.designation,
      date_of_joining: this.addemployeedetailsform.value.date_of_joining,
      employeementthrough: this.addemployeedetailsform.value.employeementthrough,
      empidmanual: this.addemployeedetailsform.value.empidmanual,
      title: this.addemployeedetailsform.value.title,
      referaldetails: this.addemployeedetailsform.value.referaldetails,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm')
    };

    this.service.addhremployee(data).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Submitted',
          showConfirmButton: false,
          timer: 1500
        });

        this.submitted = false;
        this.addemployeedetailsform.reset();
        this.modalService.dismissAll();
        this.getroomtypedata();
      } else {
        Swal.fire('Failed');
      }

      this.showSpinner = false;
    });
  }

  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any = [];

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Active';
      case 1: return 'Terminate';
      case 2: return 'Resign';
      case 3: return 'Resignation in Process';
      case 4: return 'Termination in Process';
      default: return '';
    }
  }

  getroomtypedata() {
    this.showSpinner = true;

    this.service.gethremployee().subscribe(res => {
      this.showSpinner = false;

      this.casefiledata = res.data;

      res.data.map((item, index) => {
        item.i = index + 1;
      });

      this.masterdata = res.data;
      this.clonedata = this.masterdata;

      this.dataSource = new MatTableDataSource(res.data);

      // ✅ ADD FILTER PREDICATE HERE
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        const searchText = filter.trim().toLowerCase();

        const statusText = this.getStatusText(data.status).toLowerCase();

        return (
          statusText.includes(searchText) ||
          data.full_name?.toLowerCase().includes(searchText) ||
          data.email?.toLowerCase().includes(searchText) ||
          data.phone?.toLowerCase().includes(searchText) ||
          data.department?.toLowerCase().includes(searchText)
        );
      };

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }, error => {
      this.showSpinner = false;
    });
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
  editdata(data: any, openmodel) {
    this.dataget = data;


    this.updateform.patchValue({
      update_roomtype: this.dataget.roomtype
    })
    this.modalService.open(openmodel, { size: 's', centered: true })
  }

  editaddroomtype() {
    if (this.updateform.invalid) {
      alert("Please enter details");
    }
    else {
      var data = {
        update_roomtype: this.updateform.value.update_roomtype,
        id: this.dataget.id,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }
     
    }
  }



  ////dynamicaaly add dropdown options department

  form: FormGroup;
  forFieldsform: FormGroup
  ngSelectControl = new FormControl();
  changeType(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.ngSelectControl.setValue('');
      this.addnewtype(openPopforNew)
    }
  }
  dis(addNew) {
    this.modalService.dismissAll(addNew)
  }
  addnewtype(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }
  subs: boolean = false
  submitCategory(): void {
    this.subs = true;
    const inputValue = this.adddepartment.value.new_type.trim();
    if (inputValue === '') {
      this.adddepartment.get('new_type').setErrors({ required: true });
    }
    if (this.adddepartment.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue
    };
    this.subs = true;
    this.service.departmenttypeadd(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Department Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.adddepartment.reset();
          this.subs = false;
          // this.get();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Department Type Already exist!',
            timer: 1500
          })
          // this.get();
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Category Type',
          icon: 'error'
        });
      }
    );
  }

  ngSelectControls = new FormControl();
  changeTypedesignation(e: any, openPopforNew) {
    if (e == 'ADD') {
      this.ngSelectControls.setValue('');
      this.addnewtype(openPopforNew)
    }
  }
  designationdis(addNew) {
    this.modalService.dismissAll(addNew)
  }

  subsdesignation: boolean = false
  submitdesignationdropdown(): void {
    this.subsdesignation = true;
    const inputValue = this.adddesignation.value.new_type.trim();
    if (inputValue === '') {
      this.adddesignation.get('new_type').setErrors({ required: true });
    }
    if (this.adddesignation.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue
    };
    this.subsdesignation = true;
    this.service.submitdesignationdropdown(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Designation  Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.adddesignation.reset();
          this.subsdesignation = false;
          // this.get();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Designation Type Already exist!',
            timer: 1500
          })
          // this.get();
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Designation Type',
          icon: 'error'
        });
      }
    );
  }


  departmentdropdown; any = [];
  designationdropdown: any = [];
  //////department code starts
  getdepartmentdropdowndata() {
    this.service.getdepartmentdropdown().subscribe(res => {
      this.showSpinner = false;
      this.departmentdropdown = res.data;

    })
  }
  getdesignationdropdowndata() {
    this.service.getdesignationdropdown().subscribe(res => {
      this.showSpinner = false;
      this.designationdropdown = res.data;

    })
  }

  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }




  ////update employee status
  updateStatus(row: any) {

    const payload = {
      status: row.status,
      id: row.id,
    };

    this.service.updateEmployeeStatus(payload).subscribe({
      next: () => {
        alert('Status updated successfully');
      },
      error: () => {
        alert('Failed to update status');
      }
    });
  }



  //////upload original documents
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
    this.service.uploaddocumentspost(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        // if (res.status === 200) {
        //   alert('Success');
        //   this.review = false;
        //   this.reviewimg = '';
        //   this.reviewPdfUrl = '';
        //   this.item_image = null;
        //   this.filetypes = null;
        //  this.updateform.reset();
        // } else {
        //   alert('Failed');
        // }
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
          this.getroomtypedata();
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
    this.service.getdocumenetsreport(payload).subscribe((res: any) => {
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

  referalform: boolean = false;
  changeTypereferal(e: any) {
    if (e == 'Referal' || e == 'Internal Referral' || e == 'External Referral') {
      this.referalform = true;
    } else {
      this.referalform = false;
    }
  }


  empstatus: any = []
  /////////employee status resigned or terminated

  modalDismissemp(openmodelempstatus) {
    this.modalService.dismissAll(openmodelempstatus)
  }

  editdataempstatus(data: any, openmodelempstatus) {
    this.empstatus = data;
    this.updateformempstatus.patchValue({
      resigndate: this.empstatus.resigndate
    })
    this.modalService.open(openmodelempstatus, { size: 'xl', centered: true })
  }

  submitempstatus() {
    if (this.updateformempstatus.invalid) {
      Swal.fire('Error', 'Please enter all required details', 'error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this employment status?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          status: this.updateformempstatus.value.updateempstatus,
          resigndate: this.updateformempstatus.value.resigndate,
          id: this.empstatus.id,
          user_id: localStorage.getItem('user_id'),
          usr_nm: localStorage.getItem('usr_nm'),
        };
        this.showSpinner = true;
        this.service.updateEmployeeStatus(data).subscribe(
          (res: any) => {

            this.showSpinner = false;
            if (res.status === 200) {
              Swal.fire('Success', 'Employment status updated successfully', 'success').then(() => {
                this.modalService.dismissAll();
                this.getroomtypedata();
                this.updateformempstatus.reset();
              });
            } else {
              Swal.fire('Error', 'Failed to update status', 'error');
            }
          },
          (error) => {
            this.showSpinner = false;
            Swal.fire('Error', 'Something went wrong', 'error');
          }
        );
      }
    });
  }


}
