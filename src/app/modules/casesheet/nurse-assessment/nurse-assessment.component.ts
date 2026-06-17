import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nurse-assessment',
  templateUrl: './nurse-assessment.component.html',
  styleUrls: ['./nurse-assessment.component.scss']
})
export class NurseAssessmentComponent implements OnInit {

  @Input() header: any = {};
  @Input() consultant: any = {};

  nurseAssessment: any = {};

  fallRiskRows: any[] = [];
  painAssessmentRows: any[] = [];
  nursingAssessmentRows: any[] = [];
  nursingCarePlans: any[] = [];
  nurseNotes: any[] = [];

  ngOnInit(): void {
    this.prepareNurseAssessment();
  }

  prepareNurseAssessment(): void {

    if (!this.consultant) {
      this.consultant = {};
    }

    /* MAIN OBJECT */

    if (!this.consultant.nurseAssessment) {

      this.consultant.nurseAssessment = {

        pt_reported_to_ward: '',
        assessment_start_time: '',
        ending_time: '',

        patient_name: '',
        ip_no: '',
        doa: '',

        age: '',
        gender: '',
        ward_no: '',
        language: '',

        weight: '',
        height: '',
        known_drug_allergies: '',

        presenting_complaint: '',
        past_history: '',
        surgery_planned: '',

        risk_factors: [],

        nutrition: '',

        hair: [],
        eyes: [],
        vision: [],
        nose: [],
        ear: [],
        hearing: [],
        oral_cavity: '',
        dentures: [],
        neck: [],
        skin: [],
        nervous_system: [],
        loc: [],
        musculoskeletal: '',

        coordination_balance: '',
        amputation: '',
        prosthesis: '',
        joints: [],

        respiratory_system: [],
        son: [],
        cough: [],
        oxygen_use: [],
        oxygen_rate: '',

        cardiovascular: [],
        chest_pain: '',
        history_cvd: '',
        congenital_heart_disease: '',
        edema: [],
        pulse: '',
        rhythm: '',

        gastrointestinal: [],
        palpable_masses: '',
        tenderness: '',
        appetite: '',
        urinary: [],
        indwelling_catheter: '',

        genital: '',
        breast: [],
        male: '',
        additional_information: '',

        nursing_staff_name: '',
        nursing_staff_signature: ''
      };
    }

    this.nurseAssessment = this.consultant.nurseAssessment;
    this.nurseAssessment.patient_name = this.nurseAssessment.patient_name || this.header.patient_name || '';
this.nurseAssessment.ip_no = this.nurseAssessment.ip_no || this.header.ip_no || '';
this.nurseAssessment.age = this.nurseAssessment.age || this.header.age || '';
this.nurseAssessment.gender = this.nurseAssessment.gender || this.header.sex || '';

    /* FALL RISK */

    this.consultant.fallRiskRows =
      Array.isArray(this.consultant.fallRiskRows) &&
      this.consultant.fallRiskRows.length
        ? this.consultant.fallRiskRows
        : [this.emptyFallRiskRow()];

    this.fallRiskRows = this.consultant.fallRiskRows;

    /* PAIN ASSESSMENT */

    this.consultant.painAssessmentRows =
      Array.isArray(this.consultant.painAssessmentRows) &&
      this.consultant.painAssessmentRows.length
        ? this.consultant.painAssessmentRows
        : [this.emptyPainAssessmentRow()];

    this.painAssessmentRows = this.consultant.painAssessmentRows;

    /* NURSING ASSESSMENT */

    this.consultant.nursingAssessmentRows =
      Array.isArray(this.consultant.nursingAssessmentRows) &&
      this.consultant.nursingAssessmentRows.length
        ? this.consultant.nursingAssessmentRows
        : [this.emptyNursingAssessmentRow()];

    this.nursingAssessmentRows = this.consultant.nursingAssessmentRows;

    /* NURSING CARE PLAN */

    this.consultant.nursingCarePlans =
      Array.isArray(this.consultant.nursingCarePlans) &&
      this.consultant.nursingCarePlans.length
        ? this.consultant.nursingCarePlans
        : [this.emptyNursingCarePlanRow()];

    this.nursingCarePlans = this.consultant.nursingCarePlans;

    /* NURSE NOTES */

    this.consultant.nurseNotes =
      Array.isArray(this.consultant.nurseNotes) &&
      this.consultant.nurseNotes.length
        ? this.consultant.nurseNotes
        : [this.emptyNurseNoteRow()];

    this.nurseNotes = this.consultant.nurseNotes;
  }

  /* FALL RISK */

  emptyFallRiskRow(): any {
    return {
      date: '',
      time: '',
      condition: '',
      score: '',
      nursing_staff: '',
      doctor_name: ''
    };
  }

  addFallRiskRow(): void {
    this.fallRiskRows.push(this.emptyFallRiskRow());
  }

  removeFallRiskRow(index: number): void {
    this.fallRiskRows.splice(index, 1);
  }

  /* PAIN ASSESSMENT */

  emptyPainAssessmentRow(): any {
    return {
      date_time: '',
      pain_score: '',
      character: '',
      location: '',
      duration: '',
      intervention: '',
      assessed_by: '',
      doctor_by: '',
      referral: ''
    };
  }

  addPainAssessmentRow(): void {
    this.painAssessmentRows.push(this.emptyPainAssessmentRow());
  }

  removePainAssessmentRow(index: number): void {
    this.painAssessmentRows.splice(index, 1);
  }

  /* NURSING ASSESSMENT */

  emptyNursingAssessmentRow(): any {
    return {
      patient_response: '',
      airway: '',
      abdomen: '',
      bowel_elimination: '',
      hygiene: '',
      patient_safety: '',
      diet: '',
      patient_counselling: '',
      procedures: '',
      remarks: '',
      handed_over_by: '',
      taken_by: '',
      sign_name: ''
    };
  }

  addNursingAssessmentRow(): void {
    this.nursingAssessmentRows.push(this.emptyNursingAssessmentRow());
  }

  removeNursingAssessmentRow(index: number): void {
    this.nursingAssessmentRows.splice(index, 1);
  }

  /* NURSING CARE PLAN */

  emptyNursingCarePlanRow(): any {
    return {
      date: '',
      time: '',
      shift: '',

      airway: false,
      infection: false,
      hygiene: false,
      fluid_balance: false,
      elimination: false,
      anxiety: false,
      pain: false,
      fall_risk: false,
      ambulation: false,
      nutrition: false,
      activity: false,
      skin_integrity: false,
      education: false,

      care_plan: '',
      care_given: '',
      outcome: '',

      special_notes: '',

      nurse_handover_name: '',
      nurse_handover_emp_no: '',
      nurse_handover_signature: '',

      nurse_taken_name: '',
      nurse_taken_emp_no: '',
      nurse_taken_signature: ''
    };
  }

  addNursingCarePlanRow(): void {
    this.nursingCarePlans.push(this.emptyNursingCarePlanRow());
  }

  removeNursingCarePlanRow(index: number): void {
    this.nursingCarePlans.splice(index, 1);
  }

  /* NURSE NOTES */

  emptyNurseNoteRow(): any {
    return {
      date_time: '',
      notes: '',
      signature_name: ''
    };
  }

  addNurseNoteRow(): void {
    this.nurseNotes.push(this.emptyNurseNoteRow());
  }

  removeNurseNoteRow(index: number): void {
    this.nurseNotes.splice(index, 1);
  }

  onNurseSignatureUpload(event: any): void {

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    this.consultant.nurseAssessment.nursing_staff_signature =
      reader.result;
  };

  reader.readAsDataURL(file);
}
}