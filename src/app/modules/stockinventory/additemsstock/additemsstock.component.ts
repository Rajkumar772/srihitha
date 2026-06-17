import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';

import { merge } from 'jquery';
import { StockinventoryService } from '../stockinventory.service';

@Component({
  selector: 'app-additemsstock',
  templateUrl: './additemsstock.component.html',
  styleUrls: ['./additemsstock.component.scss']
})
export class AdditemsstockComponent implements OnInit {
 addemployeedetailsform: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  nextdisplayedColumns: string[] = ['i', 'typeofproduct', 'nameofequipment', 'companyname', 'model', 'purchase_date', 'purchase_rate', 'quantity', 'assetcode', 'suppliervendorname','suppliernumber', 'warrantydate', 'image', 'view'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select7', 'select8', 'select9', 'select10', 'select11', 'select12','select13'];
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
  addproductform: FormGroup; updateformrenewal: FormGroup;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: StockinventoryService, public dialog: MatDialog) { }

  user_id: any;
  usr_nm: any; adddepartment: FormGroup; updateformquantity: FormGroup;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.addemployeedetailsform = this.formBuilder.group({
      typeofproduct: ['', [Validators.required]],
      nameofequipment: ['', [Validators.required]],
      companyname: ['', [Validators.required]],
      model: ['', [Validators.required]],
      //  location: ['', [Validators.required]],
      //  department: ['', [Validators.required]],
      purchase_date: ['', [Validators.required]],
      purchase_rate: ['', [Validators.required]],
      category_image: [''],
      suppliervendorname: ['', [Validators.required]],
      assetcode: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      positiontype: ['', [Validators.required]],
      warrantydate: ['', [Validators.required]]

    });
    this.updateform = this.formBuilder.group({
      update_roomtype: ['', [Validators.required]]
    });
    this.adddepartment = this.formBuilder.group({
      new_type: ['', [Validators.required]]
    })
    this.updateformquantity = this.formBuilder.group({
      update_quantity: ['', [Validators.required]]
    });
    this.addproductform = this.formBuilder.group({
      new_product: ['', [Validators.required]]
    })
    this.updateformrenewal = this.formBuilder.group({
      update_date: ['', [Validators.required]]
    })
    this.getroomtypedata();
    this.getdepartmentdropdowndata()
    this.getproductdropdown(); this.getsuppliervendorname();
  }

  // openusercreation(openroomtype) {

  //   this.modalService.open(openroomtype, { size: 'xl', centered: true });
  // }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'Add-Asset Report'); // table id, file name
  }


  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;

    // Stop if form is invalid
    if (this.addemployeedetailsform.invalid) {
      this.showSpinner = false;
      alert('Please enter details');
      return;
    }
    const selectedSupplier = this.addemployeedetailsform.value.suppliervendorname;
    // Prepare payload
    const data: any = {
      typeofproduct: this.addemployeedetailsform.value.typeofproduct,
      nameofequipment: this.addemployeedetailsform.value.nameofequipment,
      companyname: this.addemployeedetailsform.value.companyname,
      model: this.addemployeedetailsform.value.model,
      purchase_date: this.addemployeedetailsform.value.purchase_date,
      purchase_rate: this.addemployeedetailsform.value.purchase_rate,
      // suppliervendorname: this.addemployeedetailsform.value.suppliervendorname,
      suppliervendorname: selectedSupplier?.name,
      suppliernumber: selectedSupplier?.number,
      quantity: this.addemployeedetailsform.value.quantity,
      assetcode: this.addemployeedetailsform.value.assetcode,
      positiontype: this.addemployeedetailsform.value.positiontype,
      warrantydate: this.addemployeedetailsform.value.warrantydate,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      item_image: null,
      filetypes: null
    };
    // Attach image if exists
    if (this.item_image) {
      data.item_image = this.item_image;
      data.filetypes = this.filetypes;
    }
   
    // API call
    this.service.add_assettypestoreinventory(data).subscribe(
      (res: any) => {
        this.showSpinner = false;
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
          this.item_image = null;
          this.filetypes = null;
          this.item_image = '';
          this.filetypes = '';
          this.getroomtypedata();
        } else {
          Swal.fire('Failed');
        }
      },
      (error) => {
        this.showSpinner = false;
        Swal.fire('Something went wrong');
       
      }
    );
  }


  get f() {
    return this.addemployeedetailsform.controls
  }

  showSpinner: boolean = false;
  casefiledata: any;


  getroomtypedata() {
    this.showSpinner = true;

    this.service.getassettypestoreinventory().subscribe(
      (res: any) => {
        this.showSpinner = false;

        const today = new Date();

        const filteredData = res.data
          .filter((item: any) => item.ind == 0)
          .map((item: any, index: number) => {

            let isExpiring = false;
            let isExpired = false;

            if (item.warrantydate) {
              const warrantyDate = new Date(item.warrantydate);

              const diffDays =
                (warrantyDate.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24);

              if (diffDays < 0) {
                isExpired = true;
              } else if (diffDays <= 30) {
                isExpiring = true;
              }
            }

            return {
              ...item,
              i: index + 1,
              isExpiring,
              isExpired
            };
          });

        this.masterdata = filteredData;
        this.clonedata = filteredData;
        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        this.showSpinner = false;
        
      }
    );
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
  modalDismiss(openmodel) {
    this.modalService.dismissAll(openmodel)
  }
  /////UPLOAD SUPPLIER DETAILS DOCUMENT
  reviewPdfUrl: string = '';
  item_image: any;
  filetypes: any;
  reviewimg: string;
  imagedata: { item_image: string; filetype: any; }[];
  review: boolean;
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

  //////add new equipment dynamic code starts
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
  departmentdropdown; any = [];
  designationdropdown: any = [];
  //////department code starts
  getdepartmentdropdowndata() {
    this.service.getequipmentdropdownstoreinventory().subscribe(res => {
      this.showSpinner = false;
      this.departmentdropdown = res.data;

    })
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
    this.service.equipmenttypeaddstoreinventory(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Equipment Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.adddepartment.reset();
          this.subs = false;
          this.getdepartmentdropdowndata();
          // this.get();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Equipment Name  Already exist!',
            timer: 1500
          })
          // this.get();
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Equipment Name',
          icon: 'error'
        });
      }
    );
  }



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



  /////code starts for equipment  quantityedit
  selectedRow: any;
  selectedQuantity: number;
  isSaving = false;
  openPopup(row: any, template: TemplateRef<any>) {
    this.selectedRow = row;
    this.selectedQuantity = row.quantity;

    this.dialog.open(template, {
      width: '300px',
      disableClose: true
    });
  }

  editdataquantity(data: any, openmodelquantity) {
    this.dataget = data;
    this.updateformquantity.patchValue({
      update_quantity: this.dataget.quantity
    })
    this.modalService.open(openmodelquantity, { size: 's', centered: true })
  }





  modalDismissquantity(openmodelquantity) {
    this.modalService.dismissAll(openmodelquantity)
  }



  ///new code start 
  //////add new equipment dynamic code starts
  // form: FormGroup;
  // forFieldsform: FormGroup
  // ngSelectControl = new FormControl();
  producttype(e: any, openPopforNew) {
    if (e == 'ADDPRODUCT') {
      this.ngSelectControl.setValue('');
      this.addnewtypeproduct(openPopforNew)
    }
  }
  dismissproduct(addNew) {
    this.modalService.dismissAll(addNew)
  }
  addnewtypeproduct(openPopforNew) {
    this.modalService.open(openPopforNew, { centered: true, size: "l" });
  }

  /////submit product
  submitProduct(): void {
    this.subs = true;
    const inputValue = this.addproductform.value.new_product.trim();
    if (inputValue === '') {
      this.addproductform.get('new_product').setErrors({ required: true });
    }
    if (this.addproductform.invalid) {
      alert('Please Add Details');
      return;
    }
    const data = {
      name: inputValue,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
    };
    this.subs = true;
    this.service.producttypeaddstoreinventory(data).subscribe(
      (res) => {
        if (res.status === 200) {
          Swal.fire({
            title: 'Done!',
            text: 'Product Added',
            icon: 'success'
          });
          this.modalService.dismissAll();
          this.addproductform.reset();
          this.subs = false;
          this.getdepartmentdropdowndata();
          this.getproductdropdown();
        }
        else if (res.status == 300) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Procedure Product Name  Already exist!',
            timer: 1500
          })
        }
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while adding Procedure Product Name',
          icon: 'error'
        });
      }
    );
  }
  getproduct: any = [];
  getproductdropdown() {
    this.service.getproductdropdownstoreinventory().subscribe(res => {
      this.showSpinner = false;
      this.getproduct = res.data;

    })
  }

  ////code starts for edit date renewal and expiry
  updaterenewal: any;
  editdate(data: any, openmodel) {
    this.updaterenewal = data;

    this.updateformrenewal.patchValue({
      update_date: this.updaterenewal.warrantydate
    })
    this.modalService.open(openmodel, { size: 's', centered: true })
  }

  editdatesubmit() {
    if (this.updateformrenewal.invalid) {
      alert("Please enter details");
    }
    else {
      var data = {
        update_date: this.updateformrenewal.value.update_date,
        id: this.updaterenewal.id,
        assetcode: this.updaterenewal.assetcode,
        companyname: this.updaterenewal.companyname,
        model: this.updaterenewal.model,
        nameofequipment: this.updaterenewal.nameofequipment,
        warrantydate: this.updaterenewal.warrantydate,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      }

      this.service.updaterenweldatestoreinventory(data).subscribe(res => {
        alert('successfully updated');
        this.getroomtypedata();
        this.showSpinner = false;
        this.addemployeedetailsform.reset();
        this.modalService.dismissAll();
      },
        error => {
          this.showSpinner = false;
        });
    }
  }
  equipmentData: any = [];
  record123(viewModal, row) {

    var data = {
      'id': row.id,
    }
    this.service.getrenewaldates(data).subscribe((res) => {
      this.equipmentData = res.data
    })
    this.modalService.open(viewModal, { centered: true, size: 'xl' })
  }
  supplierlist: any = []
  getsuppliervendorname() {
    this.service.getsuppliervendorname().subscribe(res => {
      this.showSpinner = false;
      this.supplierlist = res.data;
    })
  }

  /////purchase storeinventory
  
}
