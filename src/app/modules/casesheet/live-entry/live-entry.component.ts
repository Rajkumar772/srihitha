import { Component, OnInit } from '@angular/core';
import { CasessheetService } from '../casessheet.service';

interface CaseRow {
  label: string;
  yes: boolean;
  no: boolean;
  nursing_yes?: boolean;
  nursing_no?: boolean;
  mrd_yes?: boolean;
  mrd_no?: boolean;
}interface DoctorSignature { name: string; emp_id: string; registration_no: string; signature: string; }
interface MovementRow { shifted_from: string; shifted_to: string; date_time: string; remarks: string; handed_by: string; received_by: string; }
interface MedicationRow { medicine_id: any; medicine_name: string; dose: string; route: string; frequency: string; status: string; remarks: string; nurse_name: string; }

@Component({
  selector: 'app-live-entry',
  templateUrl: './live-entry.component.html',
  styleUrls: ['./live-entry.component.scss']
})
export class LiveEntryComponent implements OnInit {
  constructor(private service: CasessheetService) { }

  ipPatients: any[] = [];
  medicineList: any[] = [];
  casesheetHistory: any[] = [];
  selected_uhid = '';
  activeStep = 1;
  activeSurgicalPage = '';
  saving = false;
  savedPatientImages: any[] = [];
  savedDocuments: any[] = [];
  savedScans: any[] = [];

  patient: any = {};
  header = { patient_name: '', umr_no: '', sex: '', age: '', ip_no: '', ward: '', bed_no: '' };

  checklist: CaseRow[] = [
    'Medical Record Check List', 'Admission Record', 'OPD Prescription', 'Doctors Signature Verification Form', 'Patient Movement Information', 'General Consent', 'Doctor Initial Assessment', 'Plan of Primary Consultant', 'Change of Plan', 'Progress Notes', 'Peripheral Cannula Assessment Sheet', 'SOS & Stat Medication', 'Verbal Orders', 'Medication Chart', 'Nurses Initial Assessment', 'Nursing Assessment Chart', 'Nursing Care Plan', 'Nurse Notes', 'Nutrition Risk Screening Form', 'Nutrition Risk Assessment', 'Dietary Notes', 'Patient and Family Education', 'TPR Chart', 'Intake and Output Chart', 'Inpatient Investigation Chart', 'Investigation Result Chart', 'Critical Result Reporting Form', 'Nurse Handoff Communication', 'Risk Assessment for Pressure Ulcers', 'Activity Chart', 'Discharge Summary', 'Discharge Checklist', 'Handing Over of Reports'
  ].map(label => ({
    label,
    yes: false,
    no: false,
    nursing_yes: false,
    nursing_no: false,
    mrd_yes: false,
    mrd_no: false
  }));
  surgicalChecklist: CaseRow[] = [
    'Pre-Anaesthetic Assessment', 'Consent for Anaesthesia', 'Informed Consent for Surgical Procedures', 'Pre-Operative Checklist', 'Immediate Pre-Op-Re-Evaluation', 'Surgical Safety Checklist', 'Anaesthesia Record', 'Operation Record', 'Post Operative Orders', 'Post Operative Monitoring Notes'
  ].map(label => ({
    label,
    yes: false,
    no: false,
    nursing_yes: false,
    nursing_no: false,
    mrd_yes: false,
    mrd_no: false
  }));

  doctorSignatures: DoctorSignature[] = Array.from({ length: 1 }, () => ({ name: '', emp_id: '', registration_no: '', signature: '' }));
  movements: MovementRow[] = Array.from({ length: 1 }, () => ({ shifted_from: '', shifted_to: '', date_time: '', remarks: '', handed_by: '', received_by: '' }));


  checklistSignatures: any = {
    staff_nurse_signature: '',
    mrd_executive_signature: '',
    staff_nurse_signature_preview: '',
    mrd_executive_signature_preview: ''
  };

  consent = {

    patient_name: '',
    patient_age: '',
    patient_gender: '',
    patient_relation_name: '',

    representative_name: '',
    representative_age: '',
    representative_gender: '',

    relation_to_patient: '',
    phone_no: '',
    address: '',

    explained_by: '',
    date: '',
    place: '',

    telugu_notes: '',

    // =========================
    // ADD THESE NEW FIELDS
    // =========================

    telugu_patient_name: '',
    telugu_age: '',
    telugu_gender: '',

    telugu_relation_name: '',
    telugu_consent_given_by: '',

    telugu_phone: '',

    telugu_surgery_consent: false,
    telugu_medicine_consent: false,
    telugu_blood_consent: false,
    telugu_photo_consent: false,

    telugu_place: '',
    telugu_date: '',

    telugu_patient_signature: '',
    telugu_doctor_signature: '',

    representative_relation_name: '',
    consenter: '',
    signature: '',
    patient_or_representative_signature: '',


    telugu_consent_age: '',
    telugu_consent_gender: '',
    telugu_explained_by: '',
    telugu_patient_relation: '',
  };

  assessment = {
    admission_no: '',
    ward: '',
    bed_no: '',
    admission_date: '',
    admission_time: '',
    presenting_complaints: '',
    present_illness: '',
    past_history: '',
    pre_admission_treatment: '',

    bronchial_asthma: '',
    diabetes: '',
    tb: '',
    cardiac_illness: '',
    thyroid_disorder: '',
    hypertension: '',
    epilepsy: '',
    other_comorbid: '',

    consciousness: '',
    pulse: '',
    bp: '',
    rr: '',
    weight: '',
    spo2: '',
    temperature: '',
    bmi: '',
    lymphadenopathy: '',
    pallor: '',
    cyanosis: '',
    icterus: '',
    clubbing: '',
    pedal_oedema: '',
    jvp: '',

    family_history: '',
    personal_history: '',
    drug_allergies: '',

    pain_has: 'No',
    pain_site: '',
    pain_score: 0,

    has_pain: '',
    pain_assessment: '',
    pain_frequency: '',
    pain_referral: '',
    pain_duration: '',
    pain_intensity_note: '',

    chest: '',
    cvs: '',
    pa: '',
    cns: '',
    expand_system: '',
    other_systems: '',

    plan_goal: '',
    investigations: '',
    medications_advised: '',
    diet_advised: '',
    procedures_planned: '',

    respiratory_therapy: '',
    physiotherapy: '',
    special_care: '',
    special_other: '',
    counselling: '',

    doctor_name: '',
    doctor_signature: '',
    doctor_date: '',
    doctor_time: '',

    consultant_name: '',
    consultant_signature: '',
    consultant_date: '',
    consultant_time: '',

    date: new Date().toISOString().substring(0, 10),
    time: ''
  };

  medications: MedicationRow[] = [];
  nurse_note = '';
  nurse_name = '';

  steps = [
    { id: 1, title: 'Checklist', icon: 'bx-list-check' },
    { id: 2, title: 'Doctors & Movement', icon: 'bx-transfer' },
    { id: 3, title: 'Consent', icon: 'bx-file' },
    { id: 4, title: 'Initial Assessment', icon: 'bx-plus-medical' },
    { id: 5, title: 'Medication & Notes', icon: 'bx-capsule' },
    { id: 6, title: 'Plan of Primary Consultant', icon: 'bx-copy-alt' },
    { id: 7, title: 'Medication Chart', icon: 'bx-table' },

    // Next future tabs
    { id: 8, title: 'Nurses Initial Assessment', icon: 'bx-user' },
    { id: 9, title: 'Risk & Pain Assessment', icon: 'bx-shield-quarter' },
    { id: 10, title: 'Nursing Care', icon: 'bx-plus-circle' },
    { id: 11, title: 'Nutrition & Dietary', icon: 'bx-bowl-hot' },
    { id: 12, title: 'Charts & Investigation', icon: 'bx-line-chart' },
    { id: 13, title: 'Nursing Communication', icon: 'bx-transfer' },
    { id: 14, title: 'Risk Assessment', icon: 'bx-shield-quarter' },
    { id: 15, title: 'Discharge', icon: 'bx-file' },
    // { id: 16, title: 'Surgical Booklet', icon: 'bx-plus-medical' },
    // { id: 17, title: 'Review & Save', icon: 'bx-check-shield' }
  ];

  ngOnInit(): void {
    this.getIPPatients();
    this.getMedicines();

    if (!this.medications.length) {
      this.addMedicationRow();
    }
  }
  getIPPatients(): void {
    this.service.getIPPatients().subscribe({
      next: (res: any) => {
        this.ipPatients = res?.data || [];

        this.todayAdmissions = this.ipPatients.filter((p: any) => {
          const d = p.admin_date || p.date || p.i_ts;
          if (!d) return false;

          const today = new Date().toISOString().slice(0, 10);
          return String(d).slice(0, 10) === today;
        });
      },
      error: err => console.error('Patient API error', err)
    });
  }
  getMedicines(): void {
    this.service.getMedicineNames().subscribe({
      next: (res: any) => {
        this.medicineList = (res?.data || []).map((m: any) => ({
          ...m,
          medicine_id: m.medicine_id || m.id || m.item_id,
          medicine_name: m.medicine_name || m.name || ''
        }));


      },
      error: err => console.error('Medicine name API error', err)
    });
  }
  customSearchFn(term: string, item: any): boolean {
    const t = (term || '').toLowerCase();
    return (item.name || '').toLowerCase().includes(t) || (item.ip_number || '').toLowerCase().includes(t) || (item.uh_id || '').toLowerCase().includes(t);
  }

  searchPatient(): void {
    const p = this.ipPatients.find((x: any) => x.ip_number === this.selected_uhid || x.uh_id === this.selected_uhid);
    if (!p) { alert('Please select patient'); return; }
    this.patient = p;
    this.header = {
      patient_name: p.name || '', umr_no: p.uh_id || '', sex: p.gender || p.sex || '', age: p.age || '', ip_no: p.ip_number || '', ward: p.room_number || '', bed_no: p.bed_no || ''
    };
    this.consent.patient_name = this.header.patient_name;
    this.consent.patient_age = this.header.age;
    this.consent.patient_gender = this.header.sex;
    this.assessment.admission_no = this.header.ip_no;
    this.assessment.ward = this.header.ward;
    this.assessment.bed_no = this.header.bed_no;
    this.loadHistory(this.header.umr_no);
    setTimeout(() => {
      this.autoUpdateChecklist();
    }, 500);
  }

  parseJson(value: any): any {
    try {
      if (!value) return null;
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  }

  loadHistory(uhId: string): void {
    if (!uhId) return;

    this.service.getPatientCasesheets(uhId, this.header.ip_no).subscribe({
      next: (res: any) => {


        let sheet = res?.data;

        if (Array.isArray(sheet)) {
          sheet = sheet[0];
        }

        if (!sheet || !sheet.id) {

          return;
        }

        this.casesheetHistory = [sheet];
        this.nurse_name = sheet.nurse_name || '';
        this.nurse_note = sheet.nurse_note || '';

        this.header = {
          ...this.header,
          ...(this.parseJson(sheet.patient_header) || {})
        };

        const sectionMap: any = {};

        (sheet.sections || []).forEach((s: any) => {
          sectionMap[s.section_key] = this.parseJson(s.section_data);
        });



        this.checklist = this.normalizeChecklist(sectionMap['checklist'], this.checklist);
        this.checklistData = sectionMap['checklist_data'] || this.checklistData;
        this.surgicalChecklist = this.normalizeChecklist(sectionMap['surgical_checklist'], this.surgicalChecklist);
        this.consentRows = sectionMap['consent_rows'] && sectionMap['consent_rows'].length
          ? sectionMap['consent_rows']
          : [this.emptyConsentRow()];

        this.checklistSignatures = sectionMap['checklist_signatures'] || this.checklistSignatures;

        this.doctorSignatures = sectionMap['doctor_signatures'] && sectionMap['doctor_signatures'].length
          ? sectionMap['doctor_signatures']
          : this.doctorSignatures;

        this.movements = sectionMap['patient_movements'] && sectionMap['patient_movements'].length
          ? sectionMap['patient_movements']
          : this.movements;

        this.consent = {
          ...this.consent,
          ...(sectionMap['general_consent'] || {}),
          ...(sectionMap['telugu_consent'] || {})
        };

        this.assessment = {
          ...this.assessment,
          ...(sectionMap['initial_assessment'] || {})
        };

        this.medications = sectionMap['medications'] || this.medications;

        this.consultant = {
          ...this.consultant,
          ...(sectionMap['consultant'] || {})
        };

        this.bindSavedSignatures(sheet.signatures || []);
        this.bindSavedFiles(sheet.files || []);
        this.autoUpdateChecklist();

      },
      error: err => {
        console.error('GET CASE SHEET ERROR:', err);
      }
    });
  }
  setStep(stepId: number): void {
    this.autoUpdateChecklist();

    this.activeStep = stepId;

    setTimeout(() => {
      const el = document.querySelector('.pdf-form-card');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }
  nextStep(): void {
    if (this.activeStep < this.steps.length) {
      this.setStep(this.activeStep + 1);
    }
  }

  prevStep(): void {
    if (this.activeStep > 1) {
      this.setStep(this.activeStep - 1);
    }
  }
  markYesNo(row: CaseRow, value: 'yes' | 'no'): void { row.yes = value === 'yes'; row.no = value === 'no'; }
  addDoctorRow(): void { this.doctorSignatures.push({ name: '', emp_id: '', registration_no: '', signature: '' }); }
  addMovementRow(): void { this.movements.push({ shifted_from: '', shifted_to: '', date_time: '', remarks: '', handed_by: '', received_by: '' }); }
  addMedicationRow(): void { this.medications.push({ medicine_id: '', medicine_name: '', dose: '', route: '', frequency: '', status: 'GIVEN', remarks: '', nurse_name: '' }); }
  removeMedicationRow(i: number): void { this.medications.splice(i, 1); }

  onMedicineChange(event: any, row: any): void {

    const selectedMedicine = this.medicineList.find(
      (x: any) => x.medicine_id == row.medicine_id
    );

    if (selectedMedicine) {
      row.medicine_name = selectedMedicine.medicine_name;
    }


  }
  printCaseSheet(): void {
    setTimeout(() => window.print(), 100);
  }
  onSignatureUpload(event: any, target: any, key: string): void {
    const file = event.target.files?.[0];



    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload image only');
      event.target.value = '';
      return;
    }

    target[key] = '';
    target[key + '_file'] = file;

    const reader = new FileReader();

    reader.onload = () => {
      target[key + '_preview'] = reader.result;

    };

    reader.readAsDataURL(file);
  }


  clearSignature(target: any, key: string): void {
    target[key] = '';
    target[key + '_file'] = null;
    target[key + '_preview'] = '';
  }
  getPayload() {
    return {
      header: this.header,

      uh_id: this.header.umr_no,
      uhid: this.header.umr_no,
      ip_no: this.header.ip_no,
      patient_name: this.header.patient_name,

      checklist: this.checklist,
      checklistData: this.checklistData,
      surgicalChecklist: this.surgicalChecklist,
      consentRows: this.consentRows,
      checklistSignatures: this.checklistSignatures,

      doctorSignatures: this.doctorSignatures,
      movements: this.movements,
      consent: this.consent,

      telugu_consent: {
        patient_name: this.consent.telugu_patient_name,
        age: this.consent.telugu_age,
        gender: this.consent.telugu_gender,
        relation_name: this.consent.telugu_relation_name,
        consent_given_by: this.consent.telugu_consent_given_by,
        phone: this.consent.telugu_phone,
        place: this.consent.telugu_place,
        date: this.consent.telugu_date,
        patient_signature: this.consent.telugu_patient_signature,
        doctor_signature: this.consent.telugu_doctor_signature
      },

      assessment: this.assessment,
      medications: this.medications,

      consultant: this.consultant,

      nurse_note: this.nurse_note,
      nurse_name: this.nurse_name
    };
  }
  saveCompleteCaseSheet(): void {
    if (!this.header.umr_no || !this.header.ip_no) {
      alert('Load patient before saving');
      return;
    }

    const formData = new FormData();
    const uploadMeta: any[] = [];


    const payload = this.appendAllFiles(this.getPayload(), formData, uploadMeta);
    payload.upload_file_meta = uploadMeta;
    formData.append('payload', JSON.stringify(payload));
    this.selectedPatientImages.forEach(file => formData.append('patient_images', file));
    this.selectedDocuments.forEach(file => formData.append('documents', file));
    this.selectedScans.forEach(file => formData.append('scans', file));

    this.saving = true;

    this.service.saveCaseSheet(formData).subscribe({
      next: (res: any) => {
        this.saving = false;
        if (res.status === 200) {
          alert('Case Sheet Saved Successfully');
          this.loadHistory(this.header.umr_no);
        } else {
          alert(res?.errorMessage || 'Case Sheet Not Saved');
        }
      },
      error: err => {
        this.saving = false;
        console.error(err);
        alert('Server error while saving');
      }
    });
  }

  appendAllFiles(obj: any, formData: FormData, meta: any[] = [], path = ''): any {
    if (Array.isArray(obj)) {
      return obj.map((item, index) =>
        this.appendAllFiles(item, formData, meta, `${path}[${index}]`)
      );
    }

    if (obj && typeof obj === 'object') {
      if (obj instanceof File) return '';

      const cleanObj: any = {};

      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;


        if (value instanceof File) {
          let fieldName = key.endsWith('_file')
            ? key.replace('_file', '')
            : key;
          if (currentPath.includes('doctorSignatures')) {
            fieldName = 'doctor_signature';
          }

          // Telugu Consent
          if (currentPath.includes('telugu_patient_signature')) {
            fieldName = 'telugu_patient_signature';
          }

          if (currentPath.includes('telugu_doctor_signature')) {
            fieldName = 'telugu_doctor_signature';
          }

          // General Consent
          if (currentPath.includes('patient_or_representative_signature')) {
            fieldName = 'patient_or_representative_signature';
          }

          if (
            currentPath.includes('consent.signature') ||
            currentPath.includes('consent.signature_file')
          ) {
            fieldName = 'signature';
          }

          // Initial Assessment
          if (currentPath.includes('assessment.doctor_signature')) {
            fieldName = 'assessment_doctor_signature';
          }
          if (currentPath.includes('consultant.cannula.nursing_staff_signature')) {
            fieldName = 'nursing_staff_signature';
          }

          if (currentPath.includes('consultant.cannula.cannula_doctor_signature')) {
            fieldName = 'cannula_doctor_signature';
          }

          if (currentPath.includes('consultant.planPrimaryConsultant.signature')) {
            fieldName = 'staff_signature';
          }

          if (currentPath.includes('assessment.consultant_signature')) {
            fieldName = 'consultant_signature';
          }

          // Telugu consent - patient / relative signature
          if (
            currentPath.includes('telugu_consent') &&
            (
              key === 'patient_signature_file' ||
              key === 'telugu_patient_signature_file' ||
              key.includes('patient_signature')
            )
          ) {
            fieldName = 'telugu_patient_signature';
          }

          // Telugu consent - doctor / admission officer signature
          if (
            currentPath.includes('telugu_consent') &&
            (
              key === 'doctor_signature_file' ||
              key === 'telugu_doctor_signature_file' ||
              key.includes('doctor_signature')
            )
          ) {
            fieldName = 'telugu_doctor_signature';
          }

          if (currentPath.includes('cannula_doctor_signature')) {
          }

          // Fall Risk Assessment signatures
          if (
            currentPath.includes('consultant.fallPages') &&
            currentPath.includes('nurseSignature')
          ) {
            fieldName = 'fall_nurse_signature';
          }


          if (
            currentPath.includes('consultant.fallPages') &&
            currentPath.includes('doctorSignature')
          ) {
            fieldName = 'fall_doctor_signature';
          }

          // Nutrition Risk Screening staff signature
          if (currentPath.includes('consultant.nutritionDietary.staff_signature')) {
            fieldName = 'nutrition_staff_signature';
          }

          // Nutrition Risk Assessment dietician signature
          if (currentPath.includes('consultant.nutritionDietary.assessment.dietician_signature')) {
            fieldName = 'dietician_signature';
          }

          // Dietary Notes row signature
          if (currentPath.includes('consultant.nutritionDietary.dietaryNotes.rows')) {
            fieldName = 'dietary_note_signature';
          }
          // Nurse handoff communication signatures
          if (currentPath.includes('consultant.nurseHandoffExact.exactColumns')) {
            fieldName = 'nurse_handover_signature';
          }

          // SOS & STAT medication signatures
          if (currentPath.includes('consultant.sosMedications')) {
            if (key === 'prescriber_sign_file') {
              fieldName = 'sos_prescriber_sign';
            }

            if (key === 'given_sign_file') {
              fieldName = 'sos_given_sign';
            }

            if (key === 'check_sign_file') {
              fieldName = 'sos_check_sign';
            }

            // Nurse Notes signature
            if (
              currentPath.includes('consultant.nurseNotes') &&
              key === 'nurse_notes_signature_file'
            ) {
              fieldName = 'nurse_notes_signature';


            }
          }

          formData.append(fieldName, value);

          meta.push({
            fieldName,
            sourcePath: currentPath,
            originalKey: key
          });

          cleanObj[key] = '';
          return;
        }

        if (key.toLowerCase().includes('preview')) {
          cleanObj[key] = '';
          return;
        }

        cleanObj[key] = this.appendAllFiles(value, formData, meta, currentPath);
      });

      return cleanObj;
    }

    return obj;
  }
  checklistData: any[] = [

    {
      content: 'Medical Record Check List',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    },

    {
      content: 'Admission Record',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    },

    {
      content: 'OPD Prescription',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    },

    {
      content: 'Doctors Signature Verification Form',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    },

    {
      content: 'Patient Movement Information',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    }

  ];

  onNursingYes(item: any) {

    if (item.nursing_yes) {
      item.nursing_no = false;
    }

  }

  onNursingNo(item: any) {

    if (item.nursing_no) {
      item.nursing_yes = false;
    }

  }

  onMRDYes(item: any) {

    if (item.mrd_yes) {
      item.mrd_no = false;
    }

  }

  onMRDNo(item: any) {

    if (item.mrd_no) {
      item.mrd_yes = false;
    }

  }

  markChecklist(item: any, type: string) {
    if (type === 'nursing_yes') {
      item.nursing_yes = !item.nursing_yes;
      if (item.nursing_yes) item.nursing_no = false;
    }

    if (type === 'nursing_no') {
      item.nursing_no = !item.nursing_no;
      if (item.nursing_no) item.nursing_yes = false;
    }

    if (type === 'mrd_yes') {
      item.mrd_yes = !item.mrd_yes;
      if (item.mrd_yes) item.mrd_no = false;
    }

    if (type === 'mrd_no') {
      item.mrd_no = !item.mrd_no;
      if (item.mrd_no) item.mrd_yes = false;
    }
  }
  markSurgicalChecklist(item: any, type: string): void {

    if (type === 'nursing_yes') {
      item.nursing_yes = !item.nursing_yes;
      item.yes = item.nursing_yes;
      if (item.nursing_yes) {
        item.nursing_no = false;
        item.no = false;
      }
    }

    if (type === 'nursing_no') {
      item.nursing_no = !item.nursing_no;
      item.no = item.nursing_no;
      if (item.nursing_no) {
        item.nursing_yes = false;
        item.yes = false;
      }
    }

    if (type === 'mrd_yes') {
      item.mrd_yes = !item.mrd_yes;
      if (item.mrd_yes) item.mrd_no = false;
    }

    if (type === 'mrd_no') {
      item.mrd_no = !item.mrd_no;
      if (item.mrd_no) item.mrd_yes = false;
    }

  }
  consentRows: any[] = [this.emptyConsentRow()];

  emptyConsentRow() {
    return {
      consent_name: '',
      nursing_yes: false,
      nursing_no: false,
      mrd_yes: false,
      mrd_no: false
    };
  }

  addConsentRow(): void {
    this.consentRows.push(this.emptyConsentRow());
  }

  removeConsentRow(index: number): void {
    if (this.consentRows.length > 1) {
      this.consentRows.splice(index, 1);
    }
  }

  removeDoctorRow(index: number): void {
    if (this.doctorSignatures.length > 1) {
      this.doctorSignatures.splice(index, 1);
    }
  }

  removeMovementRow(index: number): void {
    if (this.movements.length > 1) {
      this.movements.splice(index, 1);
    }
  }
  markConsentChecklist(item: any, type: string): void {
    if (type === 'nursing_yes') {
      item.nursing_yes = !item.nursing_yes;
      if (item.nursing_yes) item.nursing_no = false;
    }

    if (type === 'nursing_no') {
      item.nursing_no = !item.nursing_no;
      if (item.nursing_no) item.nursing_yes = false;
    }

    if (type === 'mrd_yes') {
      item.mrd_yes = !item.mrd_yes;
      if (item.mrd_yes) item.mrd_no = false;
    }

    if (type === 'mrd_no') {
      item.mrd_no = !item.mrd_no;
      if (item.mrd_no) item.mrd_yes = false;
    }
  }
  painNumbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  getPainCategory(score: number): string {
    const value = Number(score);

    if (value === 0) return 'None';
    if (value >= 1 && value <= 3) return 'Mild';
    if (value >= 4 && value <= 6) return 'Moderate';
    return 'Severe';
  }

  onPainScoreChange(): void {
    this.assessment.pain_assessment = this.getPainCategory(this.assessment.pain_score);
  }


  consultant = this.getDefaultConsultant();

  getDefaultConsultant(): any {
    return {
      planPrimaryConsultant: {
        diagnosis: '',
        plan_of_care: '',
        expected_outcome: '',
        preventive_aspects: '',
        signature_name: '',
        signature: '',
        date: new Date().toISOString().substring(0, 10),
        time: ''
      },
      changeOfPlan: Array.from({ length: 10 }, () => ({
        date_time: '',
        details: '',
        patient_signature: '',
        doctor_signature: ''
      })),
      progressNotes: Array.from({ length: 10 }, () => ({
        date_time: '',
        instructions: '',
        handing_doctor: '',
        taking_doctor: ''
      })),
      cannula: {
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
        insertion_reasons: '',
        ease_of_insertion: '',
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
        nursing_staff_name: '',
        doctor_name: '',
        doctor_signature: '',
        cannula_doctor_signature: '',
        cannula_doctor_signature_preview: '',
        cannula_doctor_signature_file: null,
        removal_date_time: ''
      }
    };
  }

  selectedPatientImages: File[] = [];
  selectedDocuments: File[] = [];
  selectedScans: File[] = [];

  onPatientImagesSelect(event: any): void {
    this.selectedPatientImages = Array.from(event.target.files);
  }

  onDocumentsSelect(event: any): void {
    this.selectedDocuments = Array.from(event.target.files);
  }

  onScansSelect(event: any): void {
    this.selectedScans = Array.from(event.target.files);
  }






  trackByIndex(index: number): number {
    return index;
  }

  openChecklistPage(label: string): void {
    const map: any = {
      'Medical Record Check List': 1,
      'Doctors Signature Verification Form': 2,
      'Patient Movement Information': 2,
      'General Consent': 3,
      'Doctor Initial Assessment': 4,

      'Plan of Primary Consultant': 6,
      'Change of Plan': 6,
      'Progress Notes': 6,
      'Peripheral Cannula Assessment Sheet': 6,
      'SOS & Stat Medication': 6,
      'Verbal Orders': 6,

      'Medication Chart': 7,

      'Nurses Initial Assessment': 8,

      'Nursing Assessment Chart': 10,
      'Nursing Care Plan': 10,
      'Nurse Notes': 10,

      'Nutrition Risk Screening Form': 11,
      'Nutrition Risk Assessment': 11,
      'Dietary Notes': 11,

      'Patient and Family Education': 12,
      'TPR Chart': 12,
      'Intake and Output Chart': 12,
      'Inpatient Investigation Chart': 12,
      'Investigation Result Chart': 12,
      'Critical Result Reporting Form': 12,

      'Nurse Handoff Communication': 13,
      'Risk Assessment for Pressure Ulcers': 14,

      'Activity Chart': 14,

      'Discharge Summary': 15,
      'Discharge Checklist': 15,
      'Handing Over of Reports': 15
    };

    const stepId = map[label];

    if (!stepId) {
      alert('This checklist page is not developed yet');
      return;
    }

    this.setStep(stepId);
  }

  openSurgicalPage(label: string): void {
    this.activeSurgicalPage = label;
    this.setStep(16);

    setTimeout(() => {
      document.getElementById('surgicalBookletSection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  bindSavedSignatures(signatures: any[]): void {



    let changePatientIndex = 0;
    let changeDoctorIndex = 0;
    let fallNurseIndex = 0;
    let fallDoctorIndex = 0;

    let careHandingIndex = 0;
    let careTakenIndex = 0;
    let dietaryNoteIndex = 0;
    let nurseHandoverIndex = 0;

    let sosPrescriberIndex = 0;
    let sosGivenIndex = 0;
    let sosCheckIndex = 0;

    let nurseNoteIndex = 0;
    const apiRoot = this.service.baseURL.replace('dashboardapi/', '');
    let doctorIndex = 0;

    signatures.forEach((s: any) => {
      if (!s.file_path) return;

      const imgUrl = apiRoot + s.file_path;

      // CHECKLIST
      if (s.signature_key === 'staff_nurse_signature') {
        this.checklistSignatures.staff_nurse_signature = s.file_name || s.file_path;
        this.checklistSignatures.staff_nurse_signature_saved = s;
        this.checklistSignatures.staff_nurse_signature_preview = imgUrl;
      }

      if (s.signature_key === 'mrd_executive_signature') {
        this.checklistSignatures.mrd_executive_signature = s.file_name || s.file_path;
        this.checklistSignatures.mrd_executive_signature_saved = s;
        this.checklistSignatures.mrd_executive_signature_preview = imgUrl;
      }

      // DOCTOR SIGNATURE VERIFICATION TABLE
      if (
        s.signature_key === 'doctor_signature' &&
        s.section_key === 'doctor_signatures'
      ) {
        const index = s.row_index !== null && s.row_index !== undefined
          ? Number(s.row_index)
          : doctorIndex;

        const doctorRow: any = this.doctorSignatures[index];

        if (doctorRow) {
          doctorRow.signature = s.file_name || s.file_path;
          doctorRow.signature_saved = s;
          doctorRow.signature_preview = imgUrl;
        }

        doctorIndex++;
      }

      // TELUGU CONSENT
      if (s.signature_key === 'telugu_patient_signature') {
        (this.consent as any).telugu_patient_signature = s.file_name || s.file_path;
        (this.consent as any).telugu_patient_signature_saved = s;
        (this.consent as any).telugu_patient_signature_preview = imgUrl;
      }

      if (s.signature_key === 'telugu_doctor_signature') {
        (this.consent as any).telugu_doctor_signature = s.file_name || s.file_path;
        (this.consent as any).telugu_doctor_signature_saved = s;
        (this.consent as any).telugu_doctor_signature_preview = imgUrl;
      }

      // ENGLISH GENERAL CONSENT
      if (s.signature_key === 'signature') {
        (this.consent as any).signature = s.file_name || s.file_path;
        (this.consent as any).signature_saved = s;
        (this.consent as any).signature_preview = imgUrl;
      }

      if (s.signature_key === 'patient_or_representative_signature') {
        (this.consent as any).patient_or_representative_signature = s.file_name || s.file_path;
        (this.consent as any).patient_or_representative_signature_saved = s;
        (this.consent as any).patient_or_representative_signature_preview = imgUrl;
      }

      if (s.signature_key === 'assessment_doctor_signature') {
        this.assessment.doctor_signature = s.file_name || s.file_path;
        (this.assessment as any).doctor_signature_saved = s;
        (this.assessment as any).doctor_signature_preview = imgUrl;
      }

      if (s.signature_key === 'consultant_signature') {
        this.assessment.consultant_signature = s.file_name || s.file_path;
        (this.assessment as any).consultant_signature_saved = s;
        (this.assessment as any).consultant_signature_preview = imgUrl;
      }


      if (s.signature_key === 'patient_signature') {
        const row = this.consultant.changeOfPlan?.[changePatientIndex];

        if (row) {
          row.patient_signature = s.file_name || s.file_path;
          row.patient_signature_saved = s;
          row.patient_signature_preview = imgUrl;
          changePatientIndex++;
        }
      }

      if (s.signature_key === 'doctor_signature') {
        const row = this.consultant.changeOfPlan?.[changeDoctorIndex];

        if (row) {
          row.doctor_signature = s.file_name || s.file_path;
          row.doctor_signature_saved = s;
          row.doctor_signature_preview = imgUrl;
          changeDoctorIndex++;
        }
      }

      if (s.signature_key === 'staff_signature') {
        this.consultant.planPrimaryConsultant.signature = s.file_name || s.file_path;
        this.consultant.planPrimaryConsultant.signature_saved = s;
        this.consultant.planPrimaryConsultant.signature_preview = imgUrl;
      }

      if (s.signature_key === 'nursing_staff_signature') {
        this.consultant.cannula.nursing_staff_signature = s.file_name || s.file_path;
        this.consultant.cannula.nursing_staff_signature_saved = s;
        this.consultant.cannula.nursing_staff_signature_preview = imgUrl;
      }
      if (s.signature_key === 'cannula_doctor_signature') {
        this.consultant.cannula.cannula_doctor_signature = s.file_name || s.file_path;
        this.consultant.cannula.cannula_doctor_signature_saved = s;
        this.consultant.cannula.cannula_doctor_signature_preview = imgUrl;
      }

      if (s.signature_key === 'fall_nurse_signature') {
        const index = s.row_index !== null && s.row_index !== undefined
          ? Number(s.row_index)
          : fallNurseIndex;

        const page = this.consultant.fallPages?.[index];

        if (page?.fall) {
          page.fall.nurseSignature = s.file_name || s.file_path;
          page.fall.nurseSignature_saved = s;
          page.fall.nurseSignature_preview = imgUrl;
        }

        fallNurseIndex++;
      }

      if (s.signature_key === 'fall_doctor_signature') {
        const page = this.consultant.fallPages?.[fallDoctorIndex];
        if (page?.fall) {
          page.fall.doctorSignature = s.file_name || s.file_path;
          page.fall.doctorSignature_saved = s;
          page.fall.doctorSignature_preview = imgUrl;
          fallDoctorIndex++;
        }
      }
      if (s.signature_key === 'handing_signature') {

        const row = this.consultant.nursingCarePlans?.[careHandingIndex];

        if (row) {
          row.handing_signature = s.file_name || s.file_path;
          row.handing_signature_saved = s;
          row.handing_signature_preview = imgUrl;
          careHandingIndex++;
        }
      }

      if (s.signature_key === 'taken_signature') {

        const row = this.consultant.nursingCarePlans?.[careTakenIndex];

        if (row) {
          row.taken_signature = s.file_name || s.file_path;
          row.taken_signature_saved = s;
          row.taken_signature_preview = imgUrl;
          careTakenIndex++;
        }
      }


      if (s.signature_key === 'nutrition_staff_signature') {
        this.consultant.nutritionDietary.staff_signature = s.file_name || s.file_path;
        this.consultant.nutritionDietary.staff_signature_saved = s;
        this.consultant.nutritionDietary.staff_signature_preview = imgUrl;
      }

      if (s.signature_key === 'dietician_signature') {
        this.consultant.nutritionDietary.assessment.dietician_signature = s.file_name || s.file_path;
        this.consultant.nutritionDietary.assessment.dietician_signature_saved = s;
        this.consultant.nutritionDietary.assessment.dietician_signature_preview = imgUrl;
      }

      if (s.signature_key === 'dietary_note_signature') {
        const row = this.consultant.nutritionDietary?.dietaryNotes?.rows?.[dietaryNoteIndex];

        if (row) {
          row.signature = s.file_name || s.file_path;
          row.signature_saved = s;
          row.signature_preview = imgUrl;
          dietaryNoteIndex++;
        }
      }


      if (s.signature_key === 'nurse_handover_signature') {
        const index = s.row_index !== null && s.row_index !== undefined
          ? Number(s.row_index)
          : nurseHandoverIndex;

        const col = this.consultant.nurseHandoffExact?.exactColumns?.[index];

        if (col) {
          col.signature = s.file_name || s.file_path;
          col.signature_saved = s;
          col.signature_preview = imgUrl;
        }

        nurseHandoverIndex++;
      }


      if (s.signature_key === 'sos_prescriber_sign') {
        const row = this.consultant.sosMedications?.[s.row_index ?? sosPrescriberIndex];
        if (row) {
          row.prescriber_sign = s.file_name || s.file_path;
          row.prescriber_sign_saved = s;
          row.prescriber_sign_preview = imgUrl;
        }
        sosPrescriberIndex++;
      }

      if (s.signature_key === 'sos_given_sign') {
        const row = this.consultant.sosMedications?.[s.row_index ?? sosGivenIndex];
        if (row) {
          row.given_sign = s.file_name || s.file_path;
          row.given_sign_saved = s;
          row.given_sign_preview = imgUrl;
        }
        sosGivenIndex++;
      }

      if (s.signature_key === 'sos_check_sign') {
        const row = this.consultant.sosMedications?.[s.row_index ?? sosCheckIndex];
        if (row) {
          row.check_sign = s.file_name || s.file_path;
          row.check_sign_saved = s;
          row.check_sign_preview = imgUrl;
        }
        sosCheckIndex++;
      }

      if (s.signature_key === 'nurse_notes_signature') {
        const index = s.row_index !== null && s.row_index !== undefined
          ? Number(s.row_index)
          : nurseNoteIndex;

        const row = this.consultant.nurseNotes?.[index];

        if (row) {
          row.nurse_notes_signature = s.file_name || s.file_path;
          row.nurse_notes_signature_saved = s;
          row.nurse_notes_signature_preview = imgUrl;
        }

        nurseNoteIndex++;
      }

    });
  }

  bindSavedFiles(files: any[]): void {
    const apiRoot = this.service.baseURL.replace('dashboardapi/', '');

    this.savedPatientImages = [];
    this.savedDocuments = [];
    this.savedScans = [];

    files.forEach((file: any) => {
      const item = {
        ...file,
        url: file.file_path ? apiRoot + file.file_path : ''
      };

      if (file.file_group === 'patient_images') {
        this.savedPatientImages.push(item);
      }

      if (file.file_group === 'documents') {
        this.savedDocuments.push(item);
      }

      if (file.file_group === 'scans') {
        this.savedScans.push(item);
      }
    });
  }

  normalizeChecklist(savedList: any, defaultList: any[]): any[] {
    if (!Array.isArray(savedList) || savedList.length === 0) {
      return defaultList;
    }

    return savedList.map((item: any, index: number) => ({
      ...defaultList[index],
      ...item,
      label: item.label || item.content || defaultList[index]?.label || ''
    }));
  }


  getStepClass(stepId: number): string {
    const status = this.getStepStatus(stepId);

    if (status === 'completed') return 'step-completed';
    if (status === 'partial') return 'step-partial';

    return 'step-not-started';
  }

  getStepStatus(stepId: number): 'completed' | 'partial' | 'not-started' {
    switch (stepId) {

      case 1:
        return this.checklistStatus(this.checklist);

      case 2:
        return this.formStatus([
          this.doctorSignatures,
          this.movements
        ]);

      case 3:
        return this.formStatus(this.consent);

      case 4:
        return this.formStatus(this.assessment);

      case 5:
        return this.formStatus([
          this.medications,
          this.nurse_note,
          this.nurse_name
        ]);

      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
        return this.formStatus(this.consultant);

      case 16:
        return this.checklistStatus(this.surgicalChecklist);

      case 17:
        return this.formStatus(this.getPayload());

      default:
        return 'not-started';
    }
  }

  checklistStatus(list: any[]): 'completed' | 'partial' | 'not-started' {
    if (!list || list.length === 0) return 'not-started';

    const answered = list.filter(x =>
      x.yes === true ||
      x.no === true ||
      x.nursing_yes === true ||
      x.nursing_no === true ||
      x.mrd_yes === true ||
      x.mrd_no === true
    ).length;

    if (answered === 0) return 'not-started';
    if (answered === list.length) return 'completed';

    return 'partial';
  }

  formStatus(data: any): 'completed' | 'partial' | 'not-started' {
    const result = this.countFields(data);

    if (result.filled === 0) return 'not-started';

    const percentage = result.total > 0
      ? (result.filled / result.total) * 100
      : 0;

    if (percentage >= 75) return 'completed';

    return 'partial';
  }

  countFields(data: any): { total: number; filled: number } {
    let total = 0;
    let filled = 0;

    const scan = (value: any) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        total++;
        filled++;
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(item => scan(item));
        return;
      }

      if (typeof value === 'object') {
        Object.keys(value).forEach(key => {
          if (
            key.includes('_preview') ||
            key.includes('_file') ||
            key.includes('_saved')
          ) {
            return;
          }

          scan(value[key]);
        });
        return;
      }

      total++;

      if (
        value === true ||
        (typeof value === 'string' && value.trim() !== '') ||
        typeof value === 'number'
      ) {
        filled++;
      }
    };

    scan(data);

    return { total, filled };
  }


  autoChecklistMark(row: any) {
    const filled = row.content && row.content.trim() !== '';

    if (filled) {
      row.nursing_yes = true;
      row.nursing_no = false;
      row.mrd_yes = true;
      row.mrd_no = false;
    } else {
      row.nursing_yes = false;
      row.nursing_no = false;
      row.mrd_yes = false;
      row.mrd_no = false;
    }
  }

  autoConsentMark(row: any) {

    const hasData =
      row.consent_name &&
      row.consent_name.trim() !== '';

    if (hasData) {
      row.nursing_yes = true;
      row.nursing_no = false;

      row.mrd_yes = true;
      row.mrd_no = false;
    }
  }

  isConsentCompleted(): boolean {
    return this.consentRows.some((row: any) =>
      row.consent_name?.trim()
    );
  }

  autoUpdateChecklist(): void {
    this.setChecklistAuto('Doctors Signature Verification Form', this.hasValue(this.doctorSignatures));
    this.setChecklistAuto('Patient Movement Information', this.hasValue(this.movements));
    this.setChecklistAuto('General Consent', this.hasValue(this.consent) || this.hasValue(this.consentRows));
    this.setChecklistAuto('Doctor Initial Assessment', this.hasValue(this.assessment));
    this.setChecklistAuto('Medication Chart', this.hasValue(this.medications));
    this.setChecklistAuto('Nurse Notes', this.hasValue(this.nurse_note));
    this.setChecklistAuto('Plan of Primary Consultant', this.hasValue(this.consultant?.planPrimaryConsultant));
    this.setChecklistAuto('Change of Plan', this.hasValue(this.consultant?.changeOfPlan));
    this.setChecklistAuto('Progress Notes', this.hasValue(this.consultant?.progressNotes));
    this.setChecklistAuto('Peripheral Cannula Assessment Sheet', this.hasValue(this.consultant?.cannula));
  }

  setChecklistAuto(label: string, completed: boolean): void {
    const row: any = this.checklist.find((x: any) =>
      (x.label || x.content || '').trim().toLowerCase() === label.trim().toLowerCase()
    );

    if (!row) return;

    row.nursing_yes = completed;
    row.nursing_no = false;
    row.mrd_yes = completed;
    row.mrd_no = false;

    row.yes = completed;
    row.no = false;
  }

  hasValue(data: any): boolean {
    if (data === null || data === undefined) return false;

    if (data instanceof File) return true;

    if (Array.isArray(data)) {
      return data.some(item => this.hasValue(item));
    }

    if (typeof data === 'object') {
      return Object.keys(data).some(key => {
        if (
          key.includes('_preview') ||
          key.includes('_file') ||
          key.includes('_saved')
        ) {
          return false;
        }

        return this.hasValue(data[key]);
      });
    }

    if (typeof data === 'string') return data.trim() !== '';
    if (typeof data === 'number') return data !== 0;
    if (typeof data === 'boolean') return data === true;
    return false;
  }
  todayAdmissions: any[] = [];
  getTodayIPAdmissions(): void {
    this.service.getTodayIPAdmissions().subscribe({
      next: (res: any) => {
        this.todayAdmissions = res?.data || [];
      },
      error: err => console.error('Today IP admission API error', err)
    });
  }

  loadTodayPatient(p: any): void {
    this.selected_uhid = p.ip_number;
    this.searchPatient();
  }


  todaySearch = '';

  filteredTodayAdmissions(): any[] {
    const t = (this.todaySearch || '').toLowerCase().trim();
    if (!t) return this.todayAdmissions;
    return this.todayAdmissions.filter((p: any) =>
      (p.name || '').toLowerCase().includes(t) ||
      (p.ip_number || '').toLowerCase().includes(t) ||
      (p.uh_id || '').toLowerCase().includes(t) ||
      (p.bed_no || '').toLowerCase().includes(t)
    );
  }
}
