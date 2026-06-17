import { Component, Input, OnInit, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { CasessheetService } from '../casessheet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss']
})
export class DischargeComponent implements OnInit, OnChanges, DoCheck {
  @Input() consultant: any = {};

  @Input() header: any = {
    patient_name: '',
    umr_no: '',
    sex: '',
    age: '',
    ip_no: '',
    unit: '',
    mlc_no: ''
  };

  dischargeSummary: any = this.createDischargeSummary();
  dischargeChecklist: any = this.createDischargeChecklist();

  constructor(private caseService: CasessheetService) { }

  ngOnInit(): void {
    if (this.header?.umr_no) {
      this.getDischargeByUMR();
    }
  }

  ngDoCheck(): void {
    // this.syncDischargeToConsultant();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['header'] && this.header?.umr_no) {
      this.getDischargeByUMR();
    }
  }

  createDischargeSummary(): any {
    return {
      admission_date: '',
      operation_date: '',
      discharge_date_time: '',
      final_diagnosis: '',
      clinical_summary: '',
      investigation_done: '',
      treatment_given_hospital: '',
      progress_in_hospital: '',
      condition_at_discharge: '',
      medicines: Array.from({ length: 9 }, (_, i) => ({
        sl_no: i + 1,
        medicine_name: '',
        morning: '',
        afternoon: '',
        evening: '',
        no_of_days: '',
        remarks: ''
      })),
      preventive_care: '',
      diet: '',
      urgent_care: '',
      review_after_days: '',
      review_in_opd: '',
      emergency_symptoms: ['', '', ''],
      prepared_doctor: '',
      prepared_signature: '',
      prepared_date: '',
      treating_signature: '',
      treating_doctor_name: '',
      regn_no: ''
    };
  }

  createDischargeChecklist(): any {
    return {
      id_band_off: false,
      iv_tubes_removed: false,
      summary_explained: false,
      wound_dressing_explained: false,
      vulnerable_safety_explained: false,
      followup_contact_explained: false,
      emergency_contact_explained: false,
      equipment_usage_explained: false,
      feedback_collected: false,
      patient_sign_name: '',
      patient_date_time: '',
      return_demonstrated: false,
      verbalization_understanding: false,
      nurse_sign: ''
    };
  }

  safeParse(value: any, fallback: any = {}): any {
    try {
      if (!value) return fallback;

      if (typeof value === 'string') {
        return JSON.parse(value);
      }

      if (typeof value === 'object') {
        return value;
      }

      return fallback;
    } catch {
      return fallback;
    }
  }
  getDischargeByUMR(): void {
    const uhid = this.header?.umr_no;

    if (!uhid) {
      Swal.fire('Required', 'UMR No missing', 'warning');
      return;
    }

    this.caseService.getPatientCasesheets(uhid).subscribe({
      next: (res: any) => {
        const sheet = Array.isArray(res?.data) ? res.data[0] : res?.data;
        const dbHeader = this.safeParse(sheet.patient_header, {});
        this.header = {
          ...this.header,
          ...dbHeader,
          patient_name: dbHeader.patient_name || sheet.patient_name || this.header.patient_name || '',
          umr_no: dbHeader.umr_no || sheet.uh_id || this.header.umr_no || '',
          sex: dbHeader.sex || this.header.sex || '',
          age: dbHeader.age || this.header.age || '',
          ip_no: dbHeader.ip_no || sheet.ip_no || this.header.ip_no || '',
          unit: dbHeader.unit || this.header.unit || '',
          mlc_no: dbHeader.mlc_no || this.header.mlc_no || ''
        };

        const sections = sheet.sections || [];

        const getSection = (key: string) => {
          const sec = sections.find((x: any) => x.section_key === key);
          if (!sec) return null;
          return this.safeParse(sec.section_data, null);
        };

        const consultantData = getSection('consultant') || {};

        const summaryData =
          getSection('discharge_summary') ||
          getSection('dischargeSummary') ||
          consultantData?.dischargeSummary;

        const checklistData =
          getSection('discharge_checklist') ||
          getSection('dischargeChecklist') ||
          consultantData?.dischargeChecklist;

        const handingData =
          getSection('handing_over_reports') ||
          getSection('handingOverReports') ||
          consultantData?.handingOverReports;

        const medicoData =
          getSection('medico_legal_data') ||
          getSection('medicoLegalData') ||
          consultantData?.medicoLegalData;

        

        if (summaryData) {
          this.dischargeSummary = {
            ...this.createDischargeSummary(),
            ...summaryData,
            medicines: summaryData.medicines?.length
              ? summaryData.medicines
              : this.createDischargeSummary().medicines,
            emergency_symptoms: summaryData.emergency_symptoms?.length
              ? summaryData.emergency_symptoms
              : ['', '', '']
          };
        }

        if (checklistData) {
          this.dischargeChecklist = {
            ...this.createDischargeChecklist(),
            ...checklistData
          };
        }

        if (handingData) {
          this.handingOverReports = {
            ...this.createHandingOverReports(),
            ...handingData,
            documents: handingData.documents?.length
              ? handingData.documents
              : this.createHandingOverReports().documents
          };
        }

        if (medicoData) {
          this.medicoLegalData = {
            ...this.createMedicoLegalData(),
            ...medicoData,
            movements: medicoData.movements?.length
              ? medicoData.movements
              : this.createMedicoLegalData().movements
          };
        }
        this.bindDischargeSavedSignatures(sheet.signatures || []);
        this.syncDischargeToConsultant();
      },

      error: (err) => {
        console.error('DISCHARGE GET ERROR:', err);
        Swal.fire('Error', 'API error while fetching', 'error');
      }
    });


  }

  bindDischargeSavedSignatures(signatures: any[]): void {
    const apiRoot = this.caseService.baseURL.replace('dashboardapi/', '');

    signatures.forEach((s: any) => {
      if (!s.file_path) return;

      const imgUrl = apiRoot + s.file_path;

      if (s.signature_key === 'prepared_signature') {
        this.dischargeSummary.prepared_signature = s.file_name || s.file_path;
        this.dischargeSummary.prepared_signature_saved = s;
        this.dischargeSummary.prepared_signature_preview = imgUrl;
      }

      if (s.signature_key === 'treating_signature') {
        this.dischargeSummary.treating_signature = s.file_name || s.file_path;
        this.dischargeSummary.treating_signature_saved = s;
        this.dischargeSummary.treating_signature_preview = imgUrl;
      }

      if (s.signature_key === 'ward_signature') {
        this.handingOverReports.ward_signature = s.file_name || s.file_path;
        this.handingOverReports.ward_signature_saved = s;
        this.handingOverReports.ward_signature_preview = imgUrl;
      }

      if (s.signature_key === 'recipient_signature') {
        this.handingOverReports.recipient_signature = s.file_name || s.file_path;
        this.handingOverReports.recipient_signature_saved = s;
        this.handingOverReports.recipient_signature_preview = imgUrl;
      }

      if (s.signature_key === 'mlc_signature') {
        this.medicoLegalData.signature = s.file_name || s.file_path;
        this.medicoLegalData.signature_saved = s;
        this.medicoLegalData.signature_preview = imgUrl;
      }

      if (s.signature_key === 'nurse_signature') {
        this.medicoLegalData.nurse_signature = s.file_name || s.file_path;
        this.medicoLegalData.nurse_signature_saved = s;
        this.medicoLegalData.nurse_signature_preview = imgUrl;
      }
    });
  }
  saveDischarge(): void {
    this.syncDischargeToConsultant();

    const payload = {
      uh_id: this.header?.umr_no || '',
      uhid: this.header?.umr_no || '',
      ip_no: this.header?.ip_no || '',
      patient_name: this.header?.patient_name || '',
      header: this.header,
      status: 'draft',

      consultant: {
        dischargeSummary: this.dischargeSummary,
        dischargeChecklist: this.dischargeChecklist,
        handingOverReports: this.handingOverReports,
        medicoLegalData: this.medicoLegalData
      }
    };

    this.caseService.saveCaseSheet(payload).subscribe({
      next: (res: any) => {
        if (res?.status === 200) {
          Swal.fire('Saved', 'Discharge data saved successfully', 'success');
          this.getDischargeByUMR();
        } else {
          Swal.fire('Error', res?.msg || 'Save failed', 'error');
        }
      },
      error: (err) => {
        console.error('DISCHARGE SAVE ERROR:', err);
        Swal.fire('Error', 'API error while saving', 'error');
      }
    });
  }

  createMedicineRow(): any {
    return {
      medicine_name: '',
      morning: '',
      afternoon: '',
      evening: '',
      no_of_days: '',
      remarks: ''
    };
  }

  addMedicineRow(): void {
    this.dischargeSummary.medicines.push(this.createMedicineRow());
  }

  removeMedicineRow(index: number): void {
    if (this.dischargeSummary.medicines.length === 1) return;
    this.dischargeSummary.medicines.splice(index, 1);
  }

  onPreparedSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.dischargeSummary.prepared_signature = '';
    this.dischargeSummary.prepared_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.dischargeSummary.prepared_signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }

  onTreatingSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.dischargeSummary.treating_signature = '';
    this.dischargeSummary.treating_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.dischargeSummary.treating_signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }



  handingOverReports: any = this.createHandingOverReports();
  medicoLegalData: any = this.createMedicoLegalData();

  createHandingOverReports(): any {
    return {
      receiver_name: '',
      patient_or_relative_name: '',
      documents: [
        { document_name: 'X-Ray', nos: '' },
        { document_name: 'CT Scan', nos: '' },
        { document_name: 'MRI', nos: '' },
        { document_name: 'Ultra Sound', nos: '' },
        { document_name: 'ECG', nos: '' },
        { document_name: 'ECHO', nos: '' },
        { document_name: 'EEG', nos: '' },
        { document_name: 'OTHERS', nos: '' }
      ],
      ward_signature: '',
      emp_no: '',
      ward_date_time: '',
      recipient_signature: '',
      relationship: '',
      recipient_date_time: ''
    };
  }

  createMedicoLegalData(): any {
    return {
      informant_name: '',
      brought_by: '',
      pc_no: '',
      dying_declaration: '',
      police_station: '',
      dd_recorded_by: '',
      police_intimation: '',
      nature_of_injury: '',

      signature: '',
      mlc_signature_file: null,
      signature_preview: '',

      nurse_signature: '',
      nurse_signature_file: null,
      nurse_signature_preview: '',

      date_time: '',
      movements: Array.from({ length: 10 }, () => ({
        shifted_from: '',
        handed_over_by: '',
        shifted_to: '',
        received_by: '',
        date_time: '',
        remarks: ''
      }))
    };
  }

  onNurseSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.medicoLegalData.nurse_signature = '';
    this.medicoLegalData.nurse_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.medicoLegalData.nurse_signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }
  addReportDocumentRow(): void {
    this.handingOverReports.documents.push({ document_name: '', nos: '' });
  }

  removeReportDocumentRow(index: number): void {
    if (this.handingOverReports.documents.length > 1) {
      this.handingOverReports.documents.splice(index, 1);
    }
  }

  addMovementRow(): void {
    this.medicoLegalData.movements.push({
      shifted_from: '',
      handed_over_by: '',
      shifted_to: '',
      received_by: '',
      date_time: '',
      remarks: ''
    });
  }

  removeMovementRow(index: number): void {
    if (this.medicoLegalData.movements.length > 1) {
      this.medicoLegalData.movements.splice(index, 1);
    }
  }

  readSignature(event: any, callback: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => callback(reader.result);
    reader.readAsDataURL(file);
  }

  onWardSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.handingOverReports.ward_signature = '';
    this.handingOverReports.ward_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.handingOverReports.ward_signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }

  onRecipientSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.handingOverReports.recipient_signature = '';
    this.handingOverReports.recipient_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.handingOverReports.recipient_signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }

  onMLCSignatureUpload(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.medicoLegalData.signature = '';
    this.medicoLegalData.mlc_signature_file = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.medicoLegalData.signature_preview = reader.result;
      this.syncDischargeToConsultant();
    };
    reader.readAsDataURL(file);
  }

  syncDischargeToConsultant(): void {
    if (!this.consultant) this.consultant = {};

    this.consultant.dischargeSummary = this.dischargeSummary;
    this.consultant.dischargeChecklist = this.dischargeChecklist;
    this.consultant.handingOverReports = this.handingOverReports;
    this.consultant.medicoLegalData = this.medicoLegalData;
  }
}