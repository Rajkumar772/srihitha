import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InPatienrservicesService } from '../in-patienrservices.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/tableUtil';

@Component({
  selector: 'app-dischargesummary',
  templateUrl: './dischargesummary.component.html',
  styleUrls: ['./dischargesummary.component.scss']
})
export class DischargesummaryComponent implements OnInit {
  dischargesummary: FormGroup;
  updateform: FormGroup;
  submitted: boolean = false;
  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form
  edit: boolean = false;                   // Edit value for
  // nextdisplayedColumns: string[] = ['i', 'uh_id','name',''];
  nextdisplayedColumns: string[] = [
    'i',
    'print',
    'uh_id',
    'name',
    'admin_date',
    'discharge_date',
    'reason_for_admission',
    'significant_findings',
    'diagnosisofthepatient',
    'patientconditionatthetimeofdischarge',
    'procedures_done',
    'medications_given',
    'othertreatment_details',
    'followup_advice',
    'medicationsprescribed',
    'otherinstructions',
    'howtoseekmedicalhelp',
    'contactnumberhospital',
    'causeofdeath',
    'doctor_signature'
  
  ];
  selectColumns: string[] = ['selectSlno','select20', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6', 'select7', 'select8', 'select9', 'select10', 'select11', 'select12', 'select13', 'select14', 'select15', 'select16', 'select17','select18'];
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
  uh_id: any;


  ////image code starts
   item_image: any;
  filetypes: any;
  reviewimg: string;
  imagedata: { item_image: string; filetype: any; }[];
  review: boolean;
  constructor(private modalService: NgbModal, private router: Router,
    private formBuilder: FormBuilder, private service: InPatienrservicesService) {
    this.dischargesummary = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      admin_date: ['', [Validators.required]],
      discharge_date: ['', [Validators.required]],
      reason_for_admission: ['', [Validators.required]],
      significant_findings: ['', [Validators.required]],
      diagnosisofthepatient: ['', [Validators.required]],
      patientconditionatthetimeofdischarge: ['', [Validators.required]],
      procedures_done: ['', [Validators.required]],
      medications_given: ['', [Validators.required]],
      othertreatment_details: ['', [Validators.required]],
      followup_advice: ['', [Validators.required]],
      medicationsprescribed: ['', [Validators.required]],
      otherinstructions: ['', [Validators.required]],
      howtoseekmedicalhelp: ['', [Validators.required]],
      contactnumberhospital: ['', [Validators.required]],
      causeofdeath: ['', [Validators.required]],
      category_image: ['', ],
    })
  }

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");
    this.getroomtypedata();
    this.getpatients();
  }
get f() {
    return this.dischargesummary.controls
  }

  clcick() {
    this.router.navigate(["/in-patients/add-roomtype"])
  }

  // exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'Discharge-Summary'); // table id, file name
  }


  submitroomtype() {
    this.submitted = true;
    this.showSpinner = true;
    if (this.dischargesummary.invalid) {
      alert("Please enter details");
      this.showSpinner = false;
      return;
    } else {
      var data = {
        uh_id: this.dischargesummary.value.uh_id,
        name: this.dischargesummary.value.name,
        admin_date: this.dischargesummary.value.admin_date,
        discharge_date: this.dischargesummary.value.discharge_date,
        reason_for_admission: this.dischargesummary.value.reason_for_admission,
        significant_findings: this.dischargesummary.value.significant_findings,
        diagnosisofthepatient: this.dischargesummary.value.diagnosisofthepatient,
        patientconditionatthetimeofdischarge: this.dischargesummary.value.patientconditionatthetimeofdischarge,
        procedures_done: this.dischargesummary.value.procedures_done,
        medications_given: this.dischargesummary.value.medications_given,
        othertreatment_details: this.dischargesummary.value.othertreatment_details,
        followup_advice: this.dischargesummary.value.followup_advice,
        medicationsprescribed: this.dischargesummary.value.medicationsprescribed,
        otherinstructions: this.dischargesummary.value.otherinstructions,
        howtoseekmedicalhelp: this.dischargesummary.value.howtoseekmedicalhelp,
        contactnumberhospital: this.dischargesummary.value.contactnumberhospital,
        causeofdeath: this.dischargesummary.value.causeofdeath,
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
         doctor_signature: this.item_image,  // base64 string
      signature_filetype: this.filetypes  // jpg/png/pdf
      }
      
      this.service.dischargesummarypost(data).subscribe((res: any) => {
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.submitted = false;
          this.item_image = '';
          this.filetypes ='';
          this.dischargesummary.reset();
          this.modalService.dismissAll();
          this.getroomtypedata();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }
 
  showSpinner: boolean = false;
  casefiledata: any;
  getroomtypedata() {
    this.service.getdischargesummaryreport().subscribe(res => {
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
  patients_data: any = [];
  getpatients() {
    this.service.getdischargesummary().subscribe((res: any) => {
      this.patients_data = res.data;
      
    })
  }
  uhid_data: any = []


  changepn(uh_id: any) {

    const data = { uh_id: uh_id };

    const result = this.patients_data.find(o => o.uh_id === uh_id);

    if (result) {
      this.dischargesummary.patchValue({
        age: result.age,
        phone_number: result.phone_number,
        gender: result.gender,
        occupation: result.occupation,
        aadhar: result.aadhar,
        name: result.name,
        complaint: result.complaint,
        doctorname: result.doctor_name,
        reason_for_admission: result.reasonforadmission,
        significant_findings: result.significantfindings,
        diagnosisofthepatient: result.diagnosisofthepatient,
        discharge_date: result.discharge_date,
        admin_date: result.admin_date,
        patientconditionatthetimeofdischarge: result.patientconditionatthetimeofdischarge
      });
    }

    this.service.getuhidwisedata(data).subscribe((res: any) => {

      this.uhid_data = res?.data || [];

      if (this.uhid_data.length > 0) {

        const medicines = this.uhid_data
          .map((item: any) => item.medicine_name)
          .join('\n');   // newline for textarea

        this.dischargesummary.patchValue({
          medications_given: medicines
        });
      } else {
        // ✅ CLEAR FIELD IF NO DATA
        this.dischargesummary.patchValue({
          medications_given: 'No Medicines Given'
        });
      }
    }, error => {
      // ✅ Also clear on API error
      this.dischargesummary.patchValue({
        medications_given: 'No Medicines Given'
      });
    });
  }

   
  reviewPdfUrl: string = '';
  /////upload signature 
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
 
 printResults(resultsLab: any) {
  const printData = {
   uh_id: resultsLab?.uh_id || '-',
  name: resultsLab?.name || '-',
  age: resultsLab?.age || '-',
  gender: resultsLab?.gender || '-',
  address: resultsLab?.address || '-',
  admin_date: resultsLab?.admin_date || '-',
  discharge_date: resultsLab?.discharge_date || '-',
  reason_for_admission: resultsLab?.reason_for_admission || '-',
  significant_findings: resultsLab?.significant_findings || '-',
  diagnosisofthepatient: resultsLab?.diagnosisofthepatient || '-',
  patientconditionatthetimeofdischarge:
    resultsLab?.patientconditionatthetimeofdischarge || '-',
  procedures_done: resultsLab?.procedures_done || '-',
  othertreatment_details: resultsLab?.othertreatment_details || '-',
  medications_given: resultsLab?.medications_given || '-',
  followup_advice: resultsLab?.followup_advice || '-',
  medicationsprescribed: resultsLab?.medicationsprescribed || '-',
  otherinstructions: resultsLab?.otherinstructions || '-',
  howtoseekmedicalhelp: resultsLab?.howtoseekmedicalhelp || '-',
  contactnumberhospital: resultsLab?.contactnumberhospital || '-',
  causeofdeath: resultsLab?.causeofdeath || '-',
  doctor_signature: resultsLab?.doctor_signature || '-',
  entry_name: resultsLab?.entry_name || '-'
  };
  this.modalService.dismissAll();
  // this.router.navigate(['/printdischarge'], {
  //   queryParams: { printData: JSON.stringify(printData) }
  // });
  this.router.navigate(['/printdischarge'], {
  state: { printData: printData }
});
}

////image popup code starts
selectedImage: string | null = null;
previewImage(image: string){
  this.selectedImage = image;
}
closePreview(){
  this.selectedImage = null;
}

}
