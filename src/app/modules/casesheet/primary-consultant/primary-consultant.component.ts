import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-primary-consultant',
  templateUrl: './primary-consultant.component.html',
  styleUrls: ['./primary-consultant.component.scss']
})
export class PrimaryConsultantComponent implements OnInit {

  @Input() header: any = {};
  @Input() consultant: any = {};

  ngOnInit(): void {
    this.prepareMedicationChart();
  }

 private nurseRowId = 0;

prepareMedicationChart(): void {

  if (!this.consultant) {
    this.consultant = {};
  }

  this.consultant.medicationChart ||= {
    date: ''
  };

  this.consultant.medicationRows =
    Array.isArray(this.consultant.medicationRows) &&
    this.consultant.medicationRows.length
      ? this.consultant.medicationRows
      : [this.emptyMedicationRow()];

  this.consultant.medicationAllergies =
    Array.isArray(this.consultant.medicationAllergies) &&
    this.consultant.medicationAllergies.length
      ? this.consultant.medicationAllergies
      : [this.emptyAllergyRow()];

 this.consultant.intakeDates =
  Array.isArray(this.consultant.intakeDates)
    ? [...this.consultant.intakeDates]
    : ['', '', '', '', ''];

  // ✅ MAIN FIX
  if (
    Array.isArray(this.consultant.nurseIntakeRows) &&
    this.consultant.nurseIntakeRows.length
  ) {

  this.consultant.nurseIntakeRows =
  this.consultant.nurseIntakeRows.map((row: any) =>
    this.normalizeNurseIntakeRow(row)
  );

  } else {

    this.consultant.nurseIntakeRows = [
      this.emptyNurseIntakeRow()
    ];
  }


  
}




normalizeNurseIntakeRow(row: any): any {
  const values = Array.isArray(row?.values) ? [...row.values] : [];

  while (values.length < 20) {
    values.push('');
  }

  return {
    uid: row?.uid || ++this.nurseRowId,
    values: values.slice(0, 20)
  };
}

  emptyMedicationRow(): any {
    return {
      start_date: '',
      start_time: '',
      drug_name: '',
      dose: '',
      route: '',
      site: '',
      frequency: '',
      sign: '',
      intake_1: '',
      intake_2: '',
      intake_3: '',
      intake_4: '',

    };
  }

  
  addMedicationRow(): void {
    this.consultant.medicationRows.push(this.emptyMedicationRow());
  }

  removeMedicationRow(index: number): void {
    this.consultant.medicationRows.splice(index, 1);

    if (this.consultant.medicationRows.length === 0) {
      this.consultant.medicationRows.push(this.emptyMedicationRow());
    }
  }



emptyAllergyRow(): any {
  return {
    drug_allergy: '',
    type: '',
    onset_date: '',
    primary_reactions: '',
    other_reactions: '',
    severity: '',
    comments: '',
    confirm: ''
  };
}

addAllergyRow(): void {
  this.consultant.medicationAllergies.push(this.emptyAllergyRow());
}

removeAllergyRow(index: number): void {
  this.consultant.medicationAllergies.splice(index, 1);

  if (this.consultant.medicationAllergies.length === 0) {
    this.consultant.medicationAllergies.push(this.emptyAllergyRow());
  }
}

emptyNurseIntakeRow(): any {

  return {
    uid: ++this.nurseRowId,

    // ✅ NEW ARRAY EVERY TIME
    values: Array.from({ length: 20 }, () => '')
  };
}


addNurseIntakeRow(): void {

  if (!Array.isArray(this.consultant.nurseIntakeRows)) {
    this.consultant.nurseIntakeRows = [];
  }

  // ✅ PUSH BRAND NEW OBJECT
  this.consultant.nurseIntakeRows = [
    ...this.consultant.nurseIntakeRows,
    this.emptyNurseIntakeRow()
  ];
}

removeNurseIntakeRow(index: number): void {

  this.consultant.nurseIntakeRows.splice(index, 1);

  if (this.consultant.nurseIntakeRows.length === 0) {

    this.consultant.nurseIntakeRows = [
      this.emptyNurseIntakeRow()
    ];
  }
}

trackByNurseRow(index: number, row: any): any {
  return row.uid;
}

trackByIndex(index: number): number {
  return index;
}



}