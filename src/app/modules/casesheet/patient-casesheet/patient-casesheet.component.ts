import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-patient-casesheet',
  templateUrl: './patient-casesheet.component.html',
  styleUrls: ['./patient-casesheet.component.scss']
})
export class PatientCasesheetComponent implements OnInit, OnChanges {

  @Input() header: any = {};
  @Input() consultant: any = {};

  ngOnInit(): void {
    this.prepareDefaultConsultant();
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['consultant']) {
    this.prepareDefaultConsultant();
  }
}
  prepareDefaultConsultant(): void {
    if (!this.consultant) {
      this.consultant = {};
    }

    if (!this.consultant.planPrimaryConsultant) {
      this.consultant.planPrimaryConsultant = {
        diagnosis: '',
        plan_of_care: '',
        expected_outcome: '',
        preventive_aspects: '',
        signature_name: '',
        date: '',
        time: '',
        signature: '',
      };
    }

    this.consultant.changeOfPlan = Array.isArray(this.consultant.changeOfPlan)
      ? this.consultant.changeOfPlan.filter((x: any) =>
        x.date_time || x.details || x.patient_signature || x.doctor_signature
      )
      : [];

    if (this.consultant.changeOfPlan.length === 0) {
      this.consultant.changeOfPlan = [this.emptyChangeOfPlan()];
    }

    this.consultant.progressNotes = Array.isArray(this.consultant.progressNotes)
      ? this.consultant.progressNotes.filter((x: any) =>
        x.date_time || x.instructions || x.handing_doctor || x.taking_doctor
      )
      : [];

    if (this.consultant.progressNotes.length === 0) {
      this.consultant.progressNotes = [this.emptyProgressNote()];
    }

  const defaultCannula = {
  insertion_date_time: '',
  location: '',
  iv_fluids: false,
  iv_antibiotics: false,
  blood_transfusion: false,
  chemotherapy: false,
  surgery: false,
  others: '',
  patient_identity_confirmed: false,
  verbal_consent: false,
  local_anesthesia: false,
  gauge: '',
  washed_hands: false,
  skin_preparation: false,
  routine: false,
  difficult: false,
  attempts: '',
  sterile_dressing: false,
  saline_flush: false,
  cannula_timed: false,
  removal_routine: false,
  removal_no_longer_required: false,
  removal_phlebitis: false,
  removal_infiltration: false,
  removal_extravasation: false,
  removal_pulled_out: false,
  removal_others: false,
  remarks: '',
  nursing_staff_signature: '',
  nursing_staff_signature_preview: '',
  nursing_staff_signature_file: null,
  removal_date_time: '',
  nursing_staff_name: '',
  doctor_name: '',
  doctor_signature: '',
  cannula_doctor_signature: '',
  cannula_doctor_signature_preview: '',
  cannula_doctor_signature_file: null,
};

this.consultant.cannula = {
  ...defaultCannula,
  ...(this.consultant.cannula || {})
};

    this.consultant.sosMedications = Array.isArray(this.consultant.sosMedications)
      ? this.consultant.sosMedications
      : [];

    if (this.consultant.sosMedications.length === 0) {
      this.consultant.sosMedications = [this.emptySosMedication()];
    }

    if (!this.consultant.verbalOrders) {
      this.consultant.verbalOrders = {
        allergy_yes: false,
        allergy_no: false,
        allergy_details: ''
      };
    }

    this.consultant.dailyWeights = Array.isArray(this.consultant.dailyWeights)
      ? this.consultant.dailyWeights
      : Array.from({ length: 6 }, () => this.emptyDailyWeight());

    this.consultant.verbalOrderRows = Array.isArray(this.consultant.verbalOrderRows)
      ? this.consultant.verbalOrderRows
      : [];

    if (this.consultant.verbalOrderRows.length === 0) {
      this.consultant.verbalOrderRows = [this.emptyVerbalOrderRow()];
    }
  }

  emptyChangeOfPlan(): any {
    return {
      date_time: '',
      details: '',
      patient_signature: '',
      doctor_signature: ''
    };
  }

  addChangeOfPlanRow(): void {
    this.consultant.changeOfPlan.push(this.emptyChangeOfPlan());
  }

  removeChangeOfPlanRow(index: number): void {
    this.consultant.changeOfPlan.splice(index, 1);

    if (this.consultant.changeOfPlan.length === 0) {
      this.consultant.changeOfPlan.push(this.emptyChangeOfPlan());
    }
  }

  emptyProgressNote(): any {
    return {
      date_time: '',
      instructions: '',
      handing_doctor: '',
      taking_doctor: ''
    };
  }

  addProgressNoteRow(): void {
    this.consultant.progressNotes.push(this.emptyProgressNote());
  }

  removeProgressNoteRow(index: number): void {
    this.consultant.progressNotes.splice(index, 1);

    if (this.consultant.progressNotes.length === 0) {
      this.consultant.progressNotes.push(this.emptyProgressNote());
    }
  }

  onSignatureUpload(event: any, row: any, key: string): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload image only');
      event.target.value = '';
      return;
    }

    row[key] = '';
    row[key + '_file'] = file;

    const reader = new FileReader();

reader.onload = () => {
  row[key + '_preview'] = reader.result;

  if (key === 'cannula_doctor_signature') {
   
  }
};

    reader.readAsDataURL(file);
  }
  clearSignature(row: any, key: string): void {
    row[key] = '';
    row[key + '_file'] = null;
    row[key + '_preview'] = '';
  }

emptySosMedication(): any {
  return {
    prescribed_date_time: '',
    medicine: '',
    dose: '',
    route: '',

    prescriber_name: '',
    prescriber_sign: '',
    prescriber_sign_file: null,
    prescriber_sign_preview: '',

    administration_time: '',

    given_name: '',
    given_sign: '',
    given_sign_file: null,
    given_sign_preview: '',

    check_name: '',
    check_sign: '',
    check_sign_file: null,
    check_sign_preview: ''
  };
}

  addSosMedicationRow(): void {
    this.consultant.sosMedications.push(this.emptySosMedication());
  }

  removeSosMedicationRow(index: number): void {
    this.consultant.sosMedications.splice(index, 1);

    if (this.consultant.sosMedications.length === 0) {
      this.consultant.sosMedications.push(this.emptySosMedication());
    }
  }

  emptyDailyWeight(): any {
    return {
      date: '',
      weight: ''
    };
  }

  emptyVerbalOrderRow(): any {
    return {
      prescribed_date_time: '',
      medicine: '',
      dose: '',
      route: '',
      prescriber_sign: '',
      administration_time: '',
      given: '',
      check: ''
    };
  }

  addVerbalOrderRow(): void {
    this.consultant.verbalOrderRows.push(this.emptyVerbalOrderRow());
  }

  removeVerbalOrderRow(index: number): void {
    this.consultant.verbalOrderRows.splice(index, 1);

    if (this.consultant.verbalOrderRows.length === 0) {
      this.consultant.verbalOrderRows.push(this.emptyVerbalOrderRow());
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}