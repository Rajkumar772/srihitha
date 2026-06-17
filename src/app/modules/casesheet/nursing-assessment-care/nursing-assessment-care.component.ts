import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-nursing-assessment-care',
  templateUrl: './nursing-assessment-care.component.html',
  styleUrls: ['./nursing-assessment-care.component.scss']
})
export class NursingAssessmentCareComponent implements OnInit, OnChanges {

  @Input() header: any = {};
  @Input() consultant: any = {};

  nurseNotesRows: any[] = [];

  ngOnInit(): void {
    this.prepareNursingCarePlan();
    this.prepareNurseNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultant'] && this.consultant) {
      this.prepareNursingCarePlan();
      this.prepareNurseNotes();
    }
  }

  prepareNursingCarePlan(): void {
    if (!this.consultant) {
      this.consultant = {};
    }

    if (
      Array.isArray(this.consultant.nursingCarePlans) &&
      this.consultant.nursingCarePlans.length
    ) {
      this.consultant.nursingCarePlans =
        this.consultant.nursingCarePlans.map((plan: any) =>
          this.normalizePlan(plan)
        );
    } else {
      this.consultant.nursingCarePlans = [
        this.emptyPlan(),
        this.emptyPlan()
      ];
    }

    if (this.consultant.nursingCarePlans.length % 2 !== 0) {
      this.consultant.nursingCarePlans.push(this.emptyPlan());
    }
  }

  prepareNurseNotes(): void {
    if (!this.consultant) {
      this.consultant = {};
    }

    if (
      Array.isArray(this.consultant.nurseNotes) &&
      this.consultant.nurseNotes.length
    ) {
      this.nurseNotesRows = this.consultant.nurseNotes.map((row: any) => ({
        ...this.emptyNurseNoteRow(),
        ...row
      }));
    } else {
      this.nurseNotesRows = [
        this.emptyNurseNoteRow()
      ];
    }

    this.syncNurseNotesToConsultant();
  }

  get carePlanPages(): any[][] {
    const pages: any[][] = [];

    if (!this.consultant?.nursingCarePlans) {
      return pages;
    }

    for (let i = 0; i < this.consultant.nursingCarePlans.length; i += 2) {
      pages.push(this.consultant.nursingCarePlans.slice(i, i + 2));
    }

    return pages;
  }

  emptyPlan(): any {
    return {
      date: '',
      time: '',
      shift: '',

      goals: {
        airway: false,
        fluid_balance: false,
        pain: false,
        nutrition: false,
        infection: false,
        elimination: false,
        fall: false,
        activity: false,
        hygiene: false,
        anxiety: false,
        ambulation: false,
        skin: false
      },

      rows: Array.from({ length: 9 }, () => ({
        care_plan: '',
        care_given: '',
        outcome: ''
      })),

      special_notes: '',

      handing_nurse_name: '',
      handing_emp_no: '',
      handing_signature: '',
      handing_signature_saved: null,
      handing_signature_file: null,
      handing_signature_preview: '',

      taken_nurse_name: '',
      taken_emp_no: '',
      taken_signature: '',
      taken_signature_saved: null,
      taken_signature_file: null,
      taken_signature_preview: ''
    };
  }

  normalizePlan(plan: any): any {
    const empty = this.emptyPlan();

    const cleanPlan = {
      ...empty,
      ...plan,
      goals: {
        ...empty.goals,
        ...(plan?.goals || {})
      },

      // important: preserve saved previews
      handing_signature: plan?.handing_signature || '',
      handing_signature_saved: plan?.handing_signature_saved || null,
      handing_signature_file: plan?.handing_signature_file || null,
      handing_signature_preview: plan?.handing_signature_preview || '',

      taken_signature: plan?.taken_signature || '',
      taken_signature_saved: plan?.taken_signature_saved || null,
      taken_signature_file: plan?.taken_signature_file || null,
      taken_signature_preview: plan?.taken_signature_preview || ''
    };

    cleanPlan.rows = Array.isArray(plan?.rows) && plan.rows.length
      ? plan.rows
      : empty.rows;

    while (cleanPlan.rows.length < 9) {
      cleanPlan.rows.push({
        care_plan: '',
        care_given: '',
        outcome: ''
      });
    }

    cleanPlan.rows = cleanPlan.rows.slice(0, 9);

    return cleanPlan;
  }

  addNursingCarePlanPage(): void {
    if (!Array.isArray(this.consultant.nursingCarePlans)) {
      this.consultant.nursingCarePlans = [];
    }

    this.consultant.nursingCarePlans.push(this.emptyPlan());
    this.consultant.nursingCarePlans.push(this.emptyPlan());
  }

  removeNursingCarePlanPage(pageIndex: number): void {
    if (!Array.isArray(this.consultant.nursingCarePlans)) {
      return;
    }

    if (this.consultant.nursingCarePlans.length <= 2) {
      alert('At least one Nursing Care Plan page is required');
      return;
    }

    if (!confirm('Delete this Nursing Care Plan page?')) {
      return;
    }

    const startIndex = pageIndex * 2;
    this.consultant.nursingCarePlans.splice(startIndex, 2);
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
    row[key + '_saved'] = null;

    const reader = new FileReader();

    reader.onload = () => {
      row[key + '_preview'] = reader.result as string;
      
    };

    reader.readAsDataURL(file);
  }

  emptyNurseNoteRow(): any {
    return {
      date_time: '',
      notes: '',
      signature_name: '',
    nurse_notes_signature_file: null,
nurse_notes_signature_saved: null,
nurse_notes_signature_preview: ''
    };
  }

  addNurseNotePage(): void {
    this.nurseNotesRows.push(this.emptyNurseNoteRow());
    this.syncNurseNotesToConsultant();
  }

  removeNurseNotePage(index: number): void {
    if (this.nurseNotesRows.length <= 1) {
      alert('At least one Nurse Notes page is required');
      return;
    }

    this.nurseNotesRows.splice(index, 1);
    this.syncNurseNotesToConsultant();
  }

  syncNurseNotesToConsultant(): void {
    this.consultant.nurseNotes = this.nurseNotesRows;
  }

  prepareBeforeSave(): void {
    this.consultant.nursingCarePlans = this.consultant.nursingCarePlans || [];
    this.consultant.nurseNotes = this.nurseNotesRows || [];
  }

  trackByIndex(index: number): number {
    return index;
  }


  onNurseNoteSignatureUpload(event: any, row: any): void {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('Please upload image only');
    event.target.value = '';
    return;
  }

row.nurse_notes_signature_file = file;
row.nurse_notes_signature_saved = null;

  const reader = new FileReader();

  reader.onload = () => {
row.nurse_notes_signature_preview = reader.result as string;
    this.syncNurseNotesToConsultant();
  };

  reader.readAsDataURL(file);
}
}