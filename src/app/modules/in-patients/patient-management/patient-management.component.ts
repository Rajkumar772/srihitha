import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss']
})
export class PatientManagementComponent implements OnInit {


  byUHidPatientForm: FormGroup
  showSpinner: boolean = false

  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;                     // Mat Table Sorting selector
  initialValues;                           // Intial values for form

  nextdisplayedColumns: string[] = ['i', 'uh_id', 'ip_number', 'name', 'age', 'gender', 'phone_number', 'room_no', 'complaint',
    'date_of_admission', 'date_of_discharge_orders', 'date_of_discharge', 'bed_days', 'time_for_discharge', 'view', 'discharge_summary', 'final_bill'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select22', 'select2', 'select3', 'select4', 'select5',];
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

  inpatientform: FormGroup;
  InvestigationForm: FormGroup;
  medicalChecklistForm: FormGroup;
  systemicExaminationForm: FormGroup;
  initaldctrsForm: FormGroup;

  primaryConsltntForm: FormGroup;

  investigationsDoneForm: FormGroup
  pastIllnessForm: FormGroup;
  persnlhstryForm: FormGroup;
  generalexaminationForm: FormGroup;

  earexaminationForm: FormGroup;
  // NoseexaminationForm: FormGroup;
  // ThroatexaminationForm: FormGroup;
  bloodtestsForm: FormGroup;

  drugVitalsCheckForm: FormGroup;
  addingMultipleDrug: FormGroup;
  doctorProgressReportForm: FormGroup;

  currentDate: any;

  patientManagementSrch: FormGroup;


  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private service: InPatienrservicesService,
    private router: Router, private datePipe: DatePipe) {


    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');




    this.byUHidPatientForm = this.formBuilder.group({
      uh_id: ['',],
    })

    ////////////////////////////////////////////////////////////////////// PAGE 1 

    this.inpatientform = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      ip_number: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      bed_no: ['', [Validators.required]],
      room_no: ['', [Validators.required]],
      room_id: ['', [Validators.required]],
      reffered_doctor_by: ['', [Validators.required]],
      complaint: ['', [Validators.required]],
      diagnosis: [''],
      surgery_procedure: [''],
      ot_assistant: [''],
      doo: [''],
      doo_operations: [''],
      doa: ['', [Validators.required]],
      dod: [''],
      surgeon: [''],
      anaesthetist: [''],
      anaesthesia: [''],
      patient_brief: [''],
      record_id: []
    })

    this.InvestigationForm = this.formBuilder.group({
      blood_tests: [''],
      scanning: [''],
      x_ray: [''],
      pta: [''],
      ecg_echo: [''],
      MRI: [''],
      ultra_sound: [''],
      doppler_scan: [''],
      culture_sensitivity: [''],
      biopsy: ['']
    })

    //////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////  PAGE 2 

    this.initaldctrsForm = this.formBuilder.group({
      complaint_duration: ['',],
      h_o_present_illness: ['',],
      family_history: ['',],
      previous_surgeries: ['',],
      drug_history: ['',],
      record_id: []
    })


    this.pastIllnessForm = this.formBuilder.group({
      hypertension: ['NO'],
      allergies: ['NO'],
      diabetes: ['NO'],
      // deafness_family_history: ['NO'],
      consanguinity_family_history: ['NO'],
      apd_gastric: ['NO'],
      kochs_tb: ['NO'],
      asthma: ['NO'],
      thyroid_prob: ['NO'],
      vertigo: ['NO'],
      epilepsy: ['NO'],
      coronary_disease: ['NO'],
      cerebrovascular_accident: ['NO']
    })

    this.persnlhstryForm = this.formBuilder.group({
      cleaning_ears: ['NO'],
      oil_in_ears: ['NO'],
      smoking: ['NO'],
      alcohol: ['NO'],
      pan_or_tobacco_chewing: ['NO'],
      swimming: ['NO'],
      // snoring: ['NO'],
      menses: ['']
    })


    this.generalexaminationForm = this.formBuilder.group({
      built: [''],
      nourishment: [''],
      pallor: ['NO'],
      icterus: ['NO'],
      cyanosis: ['NO'],
      clubbing: ['NO'],
      pedal_oedama: ['NO'],
      lymphadenopathy: ['NO']
    })

    ////////////////////////////////////////////////////////////////////// PAGE 3

    this.systemicExaminationForm = this.formBuilder.group({
      respiratory_system: ['',],
      gastro_intestinal_system: ['',],
      cardio_vascular_system: ['',],
      central_nervous_system: ['',],
      skelton_system: [''],
      record_id: []
    })

    this.earexaminationForm = this.formBuilder.group({
      pinna: [''],
      // e_a_c: [''],
      // t_m: [''],
      // preauricular_region: [''],
      // postauricular_region: [''],
      // masthoid_tenderness: [''],
      // rinnes: [''],
      // webers: [''],
      // abc: [''],
    })


    // this.NoseexaminationForm = this.formBuilder.group({
    // dorsum: [''],
    // vestibute: [''],
    // a_r: [''],
    // p_r: ['']
    // })

    // this.ThroatexaminationForm = this.formBuilder.group({
    // lips: [''],
    // tongue: [''],
    // buccal_mucosa: [''],
    // teeth: [''],
    // gums: [''],
    // palate: [''],
    // anterior_pillars: [''],
    // tonsils: [''],
    // posterior_pillars: [''],
    // posterioir_pharyngeal_wall: [''],
    // idl: [''],

    // })

    ///////////////////////////////////////////////////////////////////////// PAGE 4 

    this.primaryConsltntForm = this.formBuilder.group({
      provisional_diagnsis: ['',],
      plan_of_care: ['',],
      expected_outcome: ['',],
      preventive_care: ['',],
      record_id: []
    })


    this.investigationsDoneForm = this.formBuilder.group({
      xray_adenoids: [''],
      xray_both_mastoids: [''],
      xray_pns: [''],
      xray_nasal_bones: [''],
      pta: [''],
      ia: [''],
      ct_pns: [''],
      ct_temporal_bones: [''],
      vo: [''],
      dne: [''],
      // vls: [''],
      // us_neck: [''],
      fnac: [''],
      ecg: [''],
      echo: [''],
    })


    this.bloodtestsForm = this.formBuilder.group({
      hb: ['',],
      bt: ['',],
      bl_group: ['',],
      tc: ['',],
      ct: ['',],
      hiv: ['',],
      dc: ['',],
      rbs: ['',],
      hcv: ['',],
      esr: ['',],
      blood_urea: ['',],
      hbs_ag: ['',],
      platelet_count: ['',],
      sr_creatinine: ['',],
      t3_t4_tsh: ['',],
      any_other_investigations: [''],
      nbm_from: [''],
      nbm_till: [''],
      plan_for: ['']
    })

    ////////////////////////////////////////////////////////////////////// PAGE 5


    this.drugVitalsCheckForm = this.formBuilder.group({
      date: [this.currentDate, [Validators.required]],
      bp: ['', [Validators.required]],
      pulus: ['', [Validators.required]],
      temperature: ['', [Validators.required]],
      respirorate: ['', [Validators.required]],
      spo2: ['', [Validators.required]],
      lungs: ['', [Validators.required]],
      heart_sounds: ['', [Validators.required]]
    })

    this.addingMultipleDrug = this.formBuilder.group({

      medicine_name: ['', [Validators.required]],
      doses: ['', [Validators.required]],
      route: ['', [Validators.required]],
      freq: ['', [Validators.required]],

    })

    this.doctorProgressReportForm = this.formBuilder.group({

      progress_point: ['', [Validators.required]],

    })


    ////////////////////////////////////////////////////////////////////// PAGE 6 


  }

  ngOnInit(): void {
    this.getPateintsDatafilter()
    this.mainGetcall()
    this.getmedicinesList()

  }


  submitt: boolean = false
  get validId() {
    return this.byUHidPatientForm.controls;
  }




  patients_data: any = [];
  getPateintsDatafilter() {
    this.showSpinner = true
    // this.service.getpatientsinRoomsFilter().subscribe((res: any) => {
    //   this.showSpinner = false
    //   this.patients_data = res.data;
    // })
  }


  selectuhidget(e) {
    var data = {
      uh_id: e[0],
      ip_number: e[1]
    }
    this.showSpinner = true
    // this.service.searchIPpatientgetdata(data).subscribe((res: any) => {
    //   this.showSpinner = false
    //   res.data.map((res, index) => { res.i = ++index; })
    //   this.masterdata = res.data;
    //   this.clonedata = this.masterdata;
    //   this.dataSource = new MatTableDataSource(res.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
  }

  gotoReports() {
    this.router.navigate(['/in-patients/reports'])
  }





  mainGetcall() {
    this.showSpinner = true
    // this.service.getinRoompatientCurrent().subscribe((res: any) => {
    //   this.showSpinner = false
    //   res.data.map((res, index) => { res.i = ++index; })
    //   this.masterdata = res.data;
    //   this.clonedata = this.masterdata;
    //   this.dataSource = new MatTableDataSource(res.data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // })
  }



  typesubmit: boolean = false
  get typePateint() {
    return this.inpatientform.controls;
  }

  submitVitals: boolean = false
  get typeVitals() {
    return this.drugVitalsCheckForm.controls;
  }




  medicine_data: any = []
  getmedicinesList() {
    this.service.getmedicinename().subscribe((res) => {
      this.medicine_data = res.data;
    });
  }


  /////////////////////////////////////////////////////////////


  numericOnly(event): boolean {

    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }



  GetBloodTestReports(data) {
    this.service.gettingLabTestDtsToPatntMngnt(data).subscribe((res) => {

      var AcheivedData = res.data
      // Define a mapping between the field names and the form control properties
      const fieldToFormControl = {
        'HEMOGLOBIN': 'hb',
        'Total RBC Count': 'tc',
        'M.C.V': 'dc',
        'BLOOD GROUPING': 'bl_group',
        'PLATELET COUNT': 'platelet_count',
        'BLEEDING TIME': 'bt',
        'RBS': 'rbs',
        'CLOTTING TIME': 'ct',
        'SERUM CREATININE': 'sr_creatinine',
        'BLOOD UREA': 'blood_urea',
        'RVD 1': 'hiv',
        'HCV': 'hcv',
        'HbsAg': 'hbs_ag'
      };
      // Initialize the form with empty values for all required fields
      const initialFormValues = Object.keys(fieldToFormControl).reduce((acc, field) => {
        const formControl = fieldToFormControl[field];
        acc[formControl] = '';  // Set initial values to empty strings
        return acc;
      }, {});
      // Patch the form with initial empty values (this ensures all required fields are set)
      this.bloodtestsForm.patchValue(initialFormValues);
      // Now loop through the `AcheivedData` to update the fields that exist in the response
      AcheivedData.forEach(element => {
        const formControl = fieldToFormControl[element.field];
        // Only patch the form if the field is in the `fieldToFormControl` mapping
        if (formControl) {
          this.bloodtestsForm.patchValue({
            [formControl]: element.value || ''  // If no value, set it to empty string
          });
        }
      });
    })
  }




  ///////////////////////////////////////////////////////////

  ipMainsheetTempo: any;

  // List of fields you need to check
  requiredFieldsToCheck = [
    'blood_blgroup', 'blood_bt', 'blood_ct', 'blood_dc', 'blood_hb', 'blood_hbsag', 'blood_hcv',
    'blood_hiv', 'blood_platelet_count',
    'blood_rbs', 'blood_sr_creatinine', 'blood_tc', 'blood_urea'
  ];

  // Function to check if any of the relevant fields in `AcheivedData` are non-null or non-empty
  checkForValidBloodTestData(acheivedData) {
    // Loop through each item in the `AcheivedData`
    return acheivedData.map(item => {
      // Check if any of the required fields are non-null, non-undefined, and non-empty
      return this.requiredFieldsToCheck.some(field => {
        return item[field] !== null && item[field] !== undefined && item[field] !== '';
      });
    });
  }

  openIpSheet(inpatientsheetmodal, row) {
    this.inpatientform.reset()
    this.InvestigationForm.reset()
    this.initaldctrsForm.reset()
    this.pastIllnessForm.reset()
    this.persnlhstryForm.reset()
    this.generalexaminationForm.reset()
    this.systemicExaminationForm.reset()
    this.earexaminationForm.reset()
    // this.NoseexaminationForm.reset()
    // this.ThroatexaminationForm.reset()
    this.primaryConsltntForm.reset()
    this.investigationsDoneForm.reset()
    this.bloodtestsForm.reset()
    this.showSpinner = true
    // this.service.arequestforIpCasesheetexists(row).subscribe((res) => {

    //   this.showSpinner = false
    //   if (res.data.length == 0) {
    //     Swal.fire({
    //       position: 'top-end',
    //       icon: 'error',
    //       title: 'IP Patient Details Not Found',
    //       showConfirmButton: false,
    //     });
    //   }
    //   else if (res.data.length != 0) {
    //     this.inpatientform.patchValue({
    //       uh_id: res.data[0][0].uh_id,
    //       name: res.data[0][0].name,
    //       age: res.data[0][0].age,
    //       gender: res.data[0][0].gender,
    //       phone_number: res.data[0][0].phone_number,
    //       address: res.data[0][0].address,
    //       ip_number: res.data[0][0].ip_number,
    //       occupation: res.data[0][0].occupation,
    //       room_no: res.data[0][0].room_no,
    //       reffered_doctor_by: res.data[0][0].referred_by,
    //       doa: res.data[0][0].date_of_admission,
    //       room_id: res.data[0][0].room_id,
    //       bed_no: res.data[0][0].bed_no,
    //       complaint: res.data[0][0].complaint,
    //       record_id: res.data[0][0].id,

    //       diagnosis: res.data[0][0].diagnosis,
    //       surgery_procedure: res.data[0][0].surgery_procedure,
    //       ot_assistant: res.data[0][0].ot_assistant,
    //       doo_operations: res.data[0][0].doo_operations,
    //       doo: res.data[0][0].date_of_discharge_orders,
    //       dod: res.data[0][0].date_of_discharge,
    //       surgeon: res.data[0][0].surgeon,
    //       anaesthetist: res.data[0][0].anaesthetist,
    //       anaesthesia: res.data[0][0].anaesthesia,
    //       patient_brief: res.data[0][0].patient_brief,
    //     })
    //     this.InvestigationForm.patchValue({
    //       blood_tests: res.data[0][0].investigations_blood_tests,
    //       scanning: res.data[0][0].investigations_scanning,
    //       x_ray: res.data[0][0].investigations_x_ray,
    //       pta: res.data[0][0].investigations_pta,
    //       ecg_echo: res.data[0][0].investigations_ecg_echo,
    //       MRI: res.data[0][0].investigations_MRI,
    //       ultra_sound: res.data[0][0].investigations_ultra_sound,
    //       doppler_scan: res.data[0][0].investigations_doppler_scan,
    //       culture_sensitivity: res.data[0][0].investigations_culture_sensitivity,
    //       biopsy: res.data[0][0].investigations_biopsy
    //     })
    //     this.initaldctrsForm.patchValue({
    //       complaint_duration: res.data[1][0].complaint_duration,
    //       h_o_present_illness: res.data[1][0].h_o_present_illness,
    //       family_history: res.data[1][0].family_history,
    //       previous_surgeries: res.data[1][0].previous_surgeries,
    //       drug_history: res.data[1][0].drug_history,
    //       record_id: res.data[1][0].id
    //     })
    //     this.pastIllnessForm.patchValue({
    //       hypertension: res.data[1][0].past_hypertension,
    //       allergies: res.data[1][0].past_allergies,
    //       diabetes: res.data[1][0].past_diabetes,
    //       // deafness_family_history: res.data[1][0].past_deafness,
    //       consanguinity_family_history: res.data[1][0].past_consanguinity,
    //       apd_gastric: res.data[1][0].past_apd,
    //       kochs_tb: res.data[1][0].past_tb,
    //       asthma: res.data[1][0].past_tb,
    //       thyroid_prob: res.data[1][0].past_thyroid,
    //       vertigo: res.data[1][0].past_vertigo,
    //       epilepsy: res.data[1][0].past_epilepsy,
    //       coronary_disease: res.data[1][0].past_coronary_disease,
    //       cerebrovascular_accident: res.data[1][0].past_cerebrovascular_accident
    //     })
    //     this.persnlhstryForm.patchValue({
    //       cleaning_ears: res.data[1][0].personal_clean_ears,
    //       oil_in_ears: res.data[1][0].personal_oil_ears,
    //       smoking: res.data[1][0].personal_smoking,
    //       alcohol: res.data[1][0].personal_alcohol,
    //       pan_or_tobacco_chewing: res.data[1][0].personal_pan_tobacco,
    //       swimming: res.data[1][0].personal_swimming,
    //       // snoring: res.data[1][0].personal_snoring,
    //       menses: res.data[1][0].personal_menses
    //     })
    //     this.generalexaminationForm.patchValue({
    //       built: res.data[1][0].general_built,
    //       nourishment: res.data[1][0].general_nourishment,
    //       pallor: res.data[1][0].general_pallor,
    //       icterus: res.data[1][0].general_icterus,
    //       cyanosis: res.data[1][0].personal_smoking,
    //       clubbing: res.data[1][0].general_icterus,
    //       pedal_oedama: res.data[1][0].general_oedamma,
    //       lymphadenopathy: res.data[1][0].general_lymphadenopathy
    //     })
    //     this.systemicExaminationForm.patchValue({
    //       respiratory_system: res.data[2][0].respiratory_system,
    //       gastro_intestinal_system: res.data[2][0].gastro_intestinal_system,
    //       cardio_vascular_system: res.data[2][0].cardio_vascular_system,
    //       central_nervous_system: res.data[2][0].central_nervous_system,
    //       skelton_system: res.data[2][0].skelton_system,
    //       record_id: res.data[2][0].id
    //     })
    //     this.earexaminationForm.patchValue({
    //       pinna: res.data[2][0].ear_pinna,
    //       // e_a_c: res.data[2][0].ear_eac,
    //       // t_m: res.data[2][0].ear_tm,
    //       // preauricular_region: res.data[2][0].ear_preauricular_region,
    //       // postauricular_region: res.data[2][0].ear_postauricular_region,
    //       // masthoid_tenderness: res.data[2][0].ear_mastoid,
    //       // rinnes: res.data[2][0].ear_rinnes,
    //       // webers: res.data[2][0].ear_webers,
    //       // abc: res.data[2][0].ear_abc,
    //     })
    //     // this.NoseexaminationForm.patchValue({
    //     // dorsum: res.data[2][0].nose_dorsum,
    //     // vestibute: res.data[2][0].nose_vestibute,
    //     // a_r: res.data[2][0].nose_pr,
    //     // p_r: res.data[2][0].nose_pr
    //     // })
    //     // this.ThroatexaminationForm.patchValue({
    //     // lips: res.data[2][0].throat_lips,
    //     // tongue: res.data[2][0].throat_tongue,
    //     // buccal_mucosa: res.data[2][0].throat_buccal,
    //     // teeth: res.data[2][0].throat_teeth,
    //     // gums: res.data[2][0].throat_gums,
    //     // palate: res.data[2][0].throat_palate,
    //     // anterior_pillars: res.data[2][0].throat_anterior,
    //     // tonsils: res.data[2][0].throat_tonils,
    //     // posterior_pillars: res.data[2][0].throat_pillars,
    //     // posterioir_pharyngeal_wall: res.data[2][0].throat_wall,
    //     // idl: res.data[2][0].throat_idl,

    //     // })
    //     this.primaryConsltntForm.patchValue({
    //       provisional_diagnsis: res.data[3][0].provisional_diagnsis,
    //       plan_of_care: res.data[3][0].plan_of_care,
    //       expected_outcome: res.data[3][0].expected_outcome,
    //       preventive_care: res.data[3][0].expected_outcome,
    //       record_id: res.data[3][0].id
    //     })
    //     this.investigationsDoneForm.patchValue({
    //       xray_adenoids: res.data[3][0].xray_adenoids,
    //       xray_both_mastoids: res.data[3][0].xray_mastoids,
    //       xray_pns: res.data[3][0].xray_pns,
    //       xray_nasal_bones: res.data[3][0].xray_nasal,
    //       pta: res.data[3][0].xray_pta,
    //       ia: res.data[3][0].xray_ia,
    //       ct_pns: res.data[3][0].xray_ia,
    //       ct_temporal_bones: res.data[3][0].xray_ct_temporal,
    //       vo: res.data[3][0].xray_vo,
    //       dne: res.data[3][0].xray_dne,
    //       // vls: res.data[3][0].xray_vls,
    //       // us_neck: res.data[3][0].xray_vls,
    //       fnac: res.data[3][0].xray_vls,
    //       ecg: res.data[3][0].xray_ecg,
    //       echo: res.data[3][0].xray_echo,
    //     })
    //     // Extract the blood test data from the response
    //     const AcheivedData = res.data[3];  // Assuming blood tests data is at index 3
    //     // Check if any of the relevant fields have valid data
    //     const hasValidData = this.checkForValidBloodTestData(AcheivedData);
    //     if (hasValidData[0]) {
    //       this.bloodtestsForm = this.formBuilder.group({
    //         hb: res.data[3][0].blood_hb,
    //         bt: res.data[3][0].blood_bt,
    //         bl_group: res.data[3][0].blood_blgroup,
    //         tc: res.data[3][0].blood_tc,
    //         ct: res.data[3][0].blood_ct,
    //         hiv: res.data[3][0].blood_hiv,
    //         dc: res.data[3][0].blood_dc,
    //         rbs: res.data[3][0].blood_rbs,
    //         hcv: res.data[3][0].blood_hcv,
    //         esr: res.data[3][0].blood_esr,
    //         blood_urea: res.data[3][0].blood_urea,
    //         hbs_ag: res.data[3][0].blood_hbsag,
    //         platelet_count: res.data[3][0].blood_platelet_count,
    //         sr_creatinine: res.data[3][0].blood_sr_creatinine,
    //         t3_t4_tsh: res.data[3][0].blood_tsh,
    //         any_other_investigations: res.data[3][0].blood_any_investigations,
    //         nbm_from: res.data[3][0].blood_nbm_from,
    //         nbm_till: res.data[3][0].blood_nbm_till,
    //         plan_for: res.data[3][0].blood_plan
    //       })
    //     } else {
    //       this.GetBloodTestReports(row);
    //     }
    //     this.getcallforIpatientDayVitals(this.inpatientform.value)
    //     this.gotdatapgsPointsDoctor(this.inpatientform.value)
    //     this.ipMainsheetTempo = this.modalService.open(inpatientsheetmodal, { size: "xl", centered: true });
    //   }
    // })

  }


  //////////////////////////////////////////////////// templates modal



  pastillnestempo: any;
  openModalPastillness(a: any) {
    this.pastillnestempo = this.modalService.open(a, {
      size: "md",
      centered: false,
    });
  }

  pesonalHstrytempo: any;
  openModalPersonltem(a: any) {
    this.pesonalHstrytempo = this.modalService.open(a, {
      size: "md",
      centered: false,
    });
  }


  generalExamtempo: any;
  openModalgeneralExam(a: any) {
    this.generalExamtempo = this.modalService.open(a, {
      size: "md",
      centered: false,
    });
  }


  //////////////////////////////////////////////////// templates modal end









  closeSmallboxes(modal: any) {
    modal.dismiss();
  }

  clear(formName) {
    formName.reset();
  }

  SubmitTotalIPsheet(inpatientsheetmodal) {
    if (this.inpatientform.invalid) {
      Swal.fire("alert error")
    }
    else {
      var data = {
        ip_patient_form: this.inpatientform.value,
        InvestigationForm: this.InvestigationForm.value,
        initaldctrsForm: this.initaldctrsForm.value,
        pastIllnessForm: this.pastIllnessForm.value,
        persnlhstryForm: this.persnlhstryForm.value,
        generalexaminationForm: this.generalexaminationForm.value,
        systemicExaminationForm: this.systemicExaminationForm.value,
        earexaminationForm: this.earexaminationForm.value,
        // NoseexaminationForm: this.NoseexaminationForm.value,
        // ThroatexaminationForm: this.ThroatexaminationForm.value,
        primaryConsltntForm: this.primaryConsltntForm.value,
        investigationsDoneForm: this.investigationsDoneForm.value,
        bloodtestsForm: this.bloodtestsForm.value
      }
      // this.service.submitIPmainCaseSheet(data).subscribe((res) => {
      //   if (res.status == 200) {
      //     Swal.fire({
      //       position: 'top-end',
      //       icon: 'success',
      //       title: 'Submitted SuccessFully',
      //       showConfirmButton: false,
      //       timer: 1000
      //     });
      //     setTimeout(() => {
      //       this.closeSmallboxes(this.ipMainsheetTempo)
      //       this.openIpSheet(inpatientsheetmodal, this.inpatientform.value)
      //     }, 1000);
      //     window.location.reload()
      //   }
      //   else {
      //     Swal.fire({
      //       position: 'top-end',
      //       icon: 'error',
      //       title: 'Something Caused Error',
      //       showConfirmButton: false,
      //     });

      //   }
      // })
    }

  }


  //////////////////////// Doctor Progress Points code *****************************************


  doctorProgressArray: any = []
  addapoint() {
    if (this.doctorProgressReportForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please Fill Point',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      this.doctorProgressArray.push({
        "progress_point": this.doctorProgressReportForm.value.progress_point
      })
      this.doctorProgressReportForm.reset()
    }

  }

  removePoint(i) {
    this.doctorProgressArray.splice(i, 1)
  }

  AddDoctorProgrespoints() {

    if (this.doctorProgressArray.length == 0) {
      Swal.fire({
        title: 'Add Points',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      var data = {
        'progressPoints': this.doctorProgressArray,
        'ip_details': this.inpatientform.value,
      }
      this.showSpinner = true
      // this.service.postPatientDoctorPoints(data).subscribe((res) => {
      //   this.showSpinner = false
      //   if (res.status == 200) {
      //     Swal.fire({
      //       title: 'Submitted Successfully',
      //       position: 'top-end',
      //       icon: 'success',
      //       timer: 1500,
      //     })
      //     this.doctorProgressReportForm.reset()
      //     this.doctorProgressArray = []
      //     this.gotdatapgsPointsDoctor(this.inpatientform.value)
      //   }
      //   else {
      //     Swal.fire({
      //       title: 'Failed',
      //       position: 'top-end',
      //       icon: 'error',
      //       timer: 1500,
      //     })
      //   }
      // })
    }

  }

  pointsofPatientsDctr: any = []
  gotdatapgsPointsDoctor(data) {
    this.pointsofPatientsDctr = []
    this.showSpinner = true
    // this.service.getdatapgsPointsDoctor(data).subscribe((res) => {
    //   this.showSpinner = false
    //   this.pointsofPatientsDctr = res.data
    // })
  }


  //////////////////////// Doctor Progress Points code END *****************************************

  //////////////////////// medicine code *****************************************

  drugandDietArray: any = [];
  addoneDrugdiet() {
    if (this.addingMultipleDrug.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please Give Details',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      var medicineName = this.addingMultipleDrug.value.medicine_name
      var findMedicine = this.drugandDietArray.find((i => i.medicine_name == medicineName))

      if (!findMedicine) {
        this.drugandDietArray.push({
          "medicine_name": this.addingMultipleDrug.value.medicine_name,
          "doses": this.addingMultipleDrug.value.doses,
          "route": this.addingMultipleDrug.value.route,
          "freq": this.addingMultipleDrug.value.freq,
        })
        this.addingMultipleDrug.reset()
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'question',
          title: `Item ${medicineName} already exists.`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }
  remove(i) {
    this.drugandDietArray.splice(i, 1)
  }

  submitDayWiseMedicinesSchdl() {
    this.submitVitals = true
    if (this.drugVitalsCheckForm.invalid) {
      Swal.fire({
        title: 'please fill details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else if (this.drugandDietArray.length == 0) {
      Swal.fire({
        title: 'Add Test Details',
        position: 'top-end',
        text: 'Fill Values',
        icon: 'question',
        timer: 1500,
      })
    }
    else {
      var data = {
        'ip_details': this.inpatientform.value,
        'dayWiseVitals': this.drugVitalsCheckForm.value,
        'completeMedicinesData': this.drugandDietArray
      }
      this.showSpinner = true
      // this.service.postEveryDayVitalsNmedicines(data).subscribe((res) => {
      //   this.showSpinner = false
      //   if (res.status == 200) {
      //     Swal.fire({
      //       title: 'Submitted Successfully',
      //       position: 'top-end',
      //       icon: 'success',
      //       timer: 1500,
      //     })
      //     this.drugVitalsCheckForm.reset()
      //     this.drugandDietArray = []
      //     this.submitVitals = false
      //     this.getcallforIpatientDayVitals(this.inpatientform.value)
      //   }
      //   else {
      //     Swal.fire({
      //       title: 'Failed',
      //       position: 'top-end',
      //       icon: 'error',
      //       timer: 1500,
      //     })
      //   }
      // })
    }

  }


  particularPatientVitalRecord: any = []
  getcallforIpatientDayVitals(data) {
    this.particularPatientVitalRecord = []
    this.showSpinner = true
    // this.service.getMedicalRecordVitalsNmedicines(data).subscribe((res) => {
    //   this.showSpinner = false
    //   this.particularPatientVitalRecord = res.data
    // })
  }


  particularMedicinesforVitals: any = [];
  medicineslistTempo: any;
  viewNseeMedicines(showDaywiseMedicines, row) {
    this.showSpinner = true
    this.particularMedicinesforVitals = []

    // this.service.getMedicinesforparticularVitals(row).subscribe((res) => {
    //   this.showSpinner = false
    //   this.particularMedicinesforVitals = res.data
    // })
    this.medicineslistTempo = this.modalService.open(showDaywiseMedicines, { size: 'lg', centered: true })


  }

  //////////////////////// medicine code  end *****************************************
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

  exportTable(i, k) {
    TableUtil.exportTableToExcel(i, k);
  }

  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }
  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }






  ////////////////////////// discharge Print 



  dischargePrint(row) {
    this.router.navigate(['discharge-summary'])
    sessionStorage.setItem('summary_data', JSON.stringify(row))
  }


  finalbillprint(row) {
    if (row.payment_types == 'CASHLESS' && row.med_claim == 'Yes') {
      this.router.navigate(['finalInsurancebill-print'])
    }
    else {
      this.router.navigate(['finalbill-print'])
    }
    sessionStorage.setItem('finalbillprint', JSON.stringify(row))
  }




}
