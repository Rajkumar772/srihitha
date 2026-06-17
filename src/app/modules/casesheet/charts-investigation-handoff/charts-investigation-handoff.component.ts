import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts-investigation-handoff',
  templateUrl: './charts-investigation-handoff.component.html',
  styleUrls: ['./charts-investigation-handoff.component.scss']
})
export class ChartsInvestigationHandoffComponent implements OnInit {

  @Input() header: any = {};
  @Input() consultant: any = {};

  showTprEntryForm = false;
  editingTprIndex: number | null = null;

  timeSlots = ['2 AM', '6 AM', '10 AM', '2 PM', '6 PM', '10 PM'];
  dayIndexes = [0, 1, 2, 3, 4];

  tprEntry: any = this.emptyTprEntry();

  temperatureRows = [
    { c: '41.10', f: '106°' },
    { c: '40.5°', f: '105°' },
    { c: '40°', f: '104°' },
    { c: '39.4°', f: '103°' },
    { c: '38.8°', f: '102°' },
    { c: '38.3°', f: '101°' },
    { c: '37.2°', f: '100°' },
    { c: '37.2°', f: '99°' },
    { c: '', f: '98.4°' },
    { c: '36.1°', f: '97°' },
    { c: '35.1°', f: '96°' },
    { c: '', f: '95°' }
  ];

ngOnInit(): void {
  this.preparePatientFamilyEducation();
  this.prepareTprChart();
  this.prepareIntakeOutputChart();
  this.prepareIntakeOutputPages();

  this.prepareInvestigationChart();
  this.prepareInvestigationSecondPage();
  this.prepareCriticalResults();

  this.consultant.investigationChart = this.investigationChart;
this.consultant.investigationResults = this.investigationChartSecond;

if (!this.consultant.criticalResultReporting) {
  this.consultant.criticalResultReporting = this.consultant.criticalResults || [];
}

this.consultant.criticalResults = this.consultant.criticalResultReporting;
}


  preparePatientFamilyEducation(): void {
    if (!this.consultant) this.consultant = {};

    if (Array.isArray(this.consultant.patientFamilyEducation) && this.consultant.patientFamilyEducation.length) {
      this.consultant.patientFamilyEducation =
        this.consultant.patientFamilyEducation.map((item: any) => ({
          ...this.emptyEducationBlock(),
          ...item
        }));
    } else {
      this.consultant.patientFamilyEducation = [this.emptyEducationBlock()];
    }
  }

  emptyEducationBlock(): any {
    return {
      date: '',
      teaching_provided_to: '',
      patient: false,
      attendant: false,
      training_by: {
        doctor: false,
        nurse: false,
        dietician: false,
        medical_social_worker: false,
        physiotherapist: false
      },
      topics: {
        medication: false,
        disease_specific: false,
        emergency_care: false,
        pain_management: false,
        insulin_management: false,
        hand_hygiene: false,
        nsi_prevention: false,
        infection_control: false,
        fall_prevention: false,
        dietary_intervention: false,
        food_drug_interaction: false,
        equipment_use: false,
        psychological_support: false,
        smoking_cessation: false,
        lifestyle: false,
        rehabilitation: false,
        physiotherapy: false
      },
      other_specify: '',
      teaching_method: {
        demonstration: false,
        discussion: false,
        handouts: false
      },
      response: {
        acceptable: false,
        additional_instruction: false
      },
      sign: '',
      remarks: ''
    };
  }

  addEducationBlock(): void {
    this.consultant.patientFamilyEducation.push(this.emptyEducationBlock());
  }

  removeEducationBlock(index: number): void {
    if (this.consultant.patientFamilyEducation.length <= 1) {
      alert('At least one education block required');
      return;
    }

    this.consultant.patientFamilyEducation.splice(index, 1);
  }

  prepareTprChart(): void {
    if (!this.consultant) this.consultant = {};

    if (!this.consultant.tprChart) {
      this.consultant.tprChart = {};
    }

    if (!Array.isArray(this.consultant.tprChart.entries)) {
      this.consultant.tprChart.entries = [];
    }
  }

  emptyTprEntry(): any {
    return {
      date: '',
      time_slot: '',
      hospital_day: '',
      post_op_day: '',
      temperature_f: '',
      pulse_rate: '',
      respiration: '',
      blood_pressure: '',
      urine: '',
      bowels: '',
      weight: '',
      diet: '',
      antibiotics_days: '',
      bath: '',
      allergy: '',
      others: '',
      nurse_name: ''
    };
  }

  openTprEntryForm(): void {
    this.editingTprIndex = null;
    this.tprEntry = this.emptyTprEntry();
    this.showTprEntryForm = true;
  }

  editTprEntry(index: number): void {
    this.editingTprIndex = index;
    this.tprEntry = {
      ...this.emptyTprEntry(),
      ...this.consultant.tprChart.entries[index]
    };
    this.showTprEntryForm = true;
  }

saveTprEntry(): void {

  if (!this.tprEntry.date || !this.tprEntry.time_slot) {
    alert('Date and Time Slot are required');
    return;
  }

  const alreadyIndex = this.consultant.tprChart.entries.findIndex(
    (x: any, i: number) =>

      x.date === this.tprEntry.date &&
      x.time_slot === this.tprEntry.time_slot &&
      i !== this.editingTprIndex
  );

  if (alreadyIndex !== -1) {
    alert('This Date and Time Slot already entered. Please edit existing entry.');
    return;
  }

  /* UPDATE ENTRY */
  if (this.editingTprIndex !== null) {

    this.consultant.tprChart.entries[this.editingTprIndex] = {
      ...this.tprEntry
    };

  } else {

    /* ADD NEW ENTRY */
    this.consultant.tprChart.entries.push({
      ...this.tprEntry
    });

  }

  /* SORT DATE WISE */
  this.consultant.tprChart.entries.sort((a: any, b: any) => {

    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return dateA - dateB;

  });

  /* AUTO MOVE PAGE AFTER 5 DAYS */
  const allDates = [
    ...new Set(
      this.consultant.tprChart.entries.map((x: any) => x.date)
    )
  ];

  const currentDateIndex = allDates.indexOf(this.tprEntry.date);

  if (currentDateIndex !== -1) {

    this.tprCurrentPage = Math.floor(
      currentDateIndex / this.tprDaysPerPage
    );

  }

  /* AUTO CREATE NEW PAGE */
  const totalPages = Math.ceil(
    allDates.length / this.tprDaysPerPage
  );

  if (this.tprCurrentPage >= totalPages) {

    this.tprCurrentPage = totalPages - 1;

  }

  this.closeTprEntryForm();

}

  deleteTprEntry(index: number): void {
    if (!confirm('Delete this TPR entry?')) return;
    this.consultant.tprChart.entries.splice(index, 1);
  }

  closeTprEntryForm(): void {
    this.showTprEntryForm = false;
    this.editingTprIndex = null;
    this.tprEntry = this.emptyTprEntry();
  }


  getTprValue(dateIndex: number, slot: string, key: string): string {
    const date = this.getTprDates()[dateIndex];
    if (!date) return '';

    const entry = this.consultant.tprChart.entries.find((x: any) =>
      x.date === date && x.time_slot === slot
    );

    return entry ? entry[key] || '' : '';
  }

  getDailyValue(dateIndex: number, key: string): string {
    const date = this.getTprDates()[dateIndex];
    if (!date) return '';

    const entries = this.consultant.tprChart.entries
      .filter((x: any) => x.date === date && x[key])
      .map((x: any) => `${x.time_slot}: ${x[key]}`);

    return entries.join(' | ');
  }

  getHospitalDay(dateIndex: number): string {
    const date = this.getTprDates()[dateIndex];
    const entry = this.consultant.tprChart.entries.find((x: any) => x.date === date);
    return entry?.hospital_day || '';
  }

  getPostOpDay(dateIndex: number): string {
    const date = this.getTprDates()[dateIndex];
    const entry = this.consultant.tprChart.entries.find((x: any) => x.date === date);
    return entry?.post_op_day || '';
  }

  getTempMark(dateIndex: number, slot: string, rowTemp: string): string {
    const value = this.getTprValue(dateIndex, slot, 'temperature_f');
    if (!value) return '';

    const enteredTemp = Number(String(value).replace('°', '').trim());
    const chartTemp = Number(String(rowTemp).replace('°', '').trim());

    if (isNaN(enteredTemp) || isNaN(chartTemp)) return '';

    return Math.round(enteredTemp) === Math.round(chartTemp) ? '●' : '';
  }

  trackByIndex(index: number): number {
    return index;
  }

tprCurrentPage = 0;
tprDaysPerPage = 5;

getAllTprDates(): string[] {
  const dates = (this.consultant.tprChart?.entries || [])
    .map((x: any) => x.date)
    .filter((x: string) => !!x);

  return [...new Set(dates)].sort() as string[];
}

getTprDates(): string[] {
  const start = this.tprCurrentPage * this.tprDaysPerPage;
  return this.getAllTprDates().slice(start, start + this.tprDaysPerPage);
}

getTotalTprPages(): number {
  const totalDates = this.getAllTprDates().length;
  return Math.max(1, Math.ceil(totalDates / this.tprDaysPerPage));
}

nextTprPage(): void {
  if (this.tprCurrentPage < this.getTotalTprPages() - 1) {
    this.tprCurrentPage++;
  }
}

previousTprPage(): void {
  if (this.tprCurrentPage > 0) {
    this.tprCurrentPage--;
  }
}

createNewTprPage(): void {
  this.tprCurrentPage = this.getTotalTprPages();
  this.openTprEntryForm();
}


ioHours = [
  '6-00 AM', '7-00', '8-00', '9-00', '10-00', '11-00', '12-00',
  '1-00PM', '2-00', '3-00', '4-00', '5-00', '6-00', '7-00',
  '8-00', '9-00', '10-00', '11-00', '12-00', '1-00AM',
  '2-00', '3-00', '4-00', '5-00'
];

prepareIntakeOutputPages(): void {
  if (!this.consultant.intakeOutputPages || !this.consultant.intakeOutputPages.length) {
    this.consultant.intakeOutputPages = [this.emptyIntakeOutputPage()];
  }
}
addIntakeOutputPage(): void {
  this.consultant.intakeOutputPages.push(this.emptyIntakeOutputPage());
}

emptyIntakeOutputPage(): any {
  return {
    name: '',
    age: '',
    sex: '',
    hosp_no: '',
    unit: '',
    ward: '',
    date: '',
    past_oral: '',
    past_iv: '',
    past_intake_other: '',
    past_intake_total: '',
    past_urine: '',
    past_ng_asp: '',
    past_drainage: '',
    past_output_other: '',
    past_output_total: '',
    rows: this.ioHours.map(hour => this.emptyIoRow(hour))
  };
}


prepareIntakeOutputChart(): void {
  if (!this.consultant.intakeOutput) {
    this.consultant.intakeOutput = {};
  }

  this.consultant.intakeOutput = {
    name: '',
    age: '',
    sex: '',
    hosp_no: '',
    unit: '',
    ward: '',
    date: '',
    past_oral: '',
    past_iv: '',
    past_intake_other: '',
    past_intake_total: '',
    past_urine: '',
    past_ng_asp: '',
    past_drainage: '',
    past_output_other: '',
    past_output_total: '',
    ...this.consultant.intakeOutput
  };

  if (!Array.isArray(this.consultant.intakeOutput.rows)) {
    this.consultant.intakeOutput.rows = this.ioHours.map(hour => this.emptyIoRow(hour));
  }
}

emptyIoRow(hour: string): any {
  return {
    hour,
    med_fluids: '',
    hrly: '',
    intake_total: '',
    oral_fluids: '',
    oral_amount: '',
    urine: '',
    ng_asp: '',
    drainage: '',
    output_other: '',
    signature: ''
  };
}


deleteIntakeOutputPage(pageIndex: number): void {
  if (this.consultant.intakeOutputPages.length <= 1) {
    alert('At least one Intake Output page is required');
    return;
  }

  if (confirm('Are you sure you want to delete this Intake Output page?')) {
    this.consultant.intakeOutputPages.splice(pageIndex, 1);
  }
}


/* PAGE 1 */
investigationChart: any = {
  dates: [
    { date: '' }, { date: '' }, { date: '' }, { date: '' },
    { date: '' }, { date: '' }, { date: '' }
  ],
  rows: []
};


prepareInvestigationChart(): void {
  if (!this.investigationChart.rows.length) {
    for (let i = 0; i < 28; i++) {
      this.investigationChart.rows.push(this.emptyInvestigationRow());
    }
  }
}

emptyInvestigationRow(): any {
  return {
    name: '',
    values: this.investigationChart.dates.map(() => '')
  };
}

addInvestigationRow(): void {
  this.investigationChart.rows.push({
    name: '',
    values: this.investigationChart.dates.map(() => '')
  });
}

addInvestigationDate(): void {
  this.investigationChart.dates.push({ date: '' });

  this.investigationChart.rows.forEach((row: any) => {
    row.values.push('');
  });
}


/* PAGE 2 */
investigationChartSecond: any = {
  dates: [
    { date: '' }, { date: '' }, { date: '' }, { date: '' },
    { date: '' }, { date: '' }, { date: '' }
  ],
  rows: []
};




prepareInvestigationSecondPage(): void {
  const names = [
    'HAEMATOLOGY',
    'Hemoglobin',
    'P.C.V',
    'Red cell count Platelets',
    'TOTAL LEUCOCYTES',
    'Neutrophils',
    'Lymphocytes',
    'Eosinophils',
    'Monocytes M.P/Parasite F',
    'ESR',
    'CRP',
    'BIOCHEMISTRY',
    'FB.S PPB.S',
    'R.B.S',
    'HBAIC Urea',
    'Co-Creatinine',
    'Uric Acid',
    'Sodium',
    'Potassium',
    'Chlorides',
    'Bicarb',
    'GFR',
    'Total Bilirubin',
    'Direct Bilirubin',
    'Indirect Bilirubin',
    'S.G.O.T',
    'S.G.P.T',
    'Alk. Phosphatase',
    'Total Proleins',
    'Ser. Albumin',
    'Ser. Globulin',
    'AG Ratio',
    'CARDIAC ENZYMES',
    'CK-NAC C.P.K-M.B',
    'Troponin T COAGULATION',
    'B.T',
    'C.T P.T',
    'INR',
    'A.P.T.T',
    'D-dimer',
    'LIPID PROFILE',
    'Total Cholesterol',
    'Triglycerides',
    'H.D.L',
    'L.D.L',
    'SEROLOGY',
    'HBsAg',
    'H.I.V',
    'Hepatitis C',
    'VDRL',
    'THYROID FUNCTION',
    'T3',
    'T4/Free T 4',
    'T.S.H',
    'URINE',
    'PUS Cells',
    'Epithelial Cells',
    'Protein Glucose',
    'STOOL',
    'Occult Blood',
    'OVA / CYST',
    'CULTURE: AFB/',
    'FUNGAL /ANAEROBES',
    'Urine',
    'Blood',
    'Sputum',
    'E.T',
    'BAL',
    'CSF',
    'SMEAR',
    'AFG',
    'Gramstain',
    'Fungal',
    'VIROLOGY',
    'IgG',
    'IgM',
    'Deengu',
    'Fluid Analysis'
  ];

  this.investigationChartSecond.rows = names.map(name => ({
    name,
    values: this.investigationChartSecond.dates.map(() => '')
  }));
}



addInvestigationSecondRow(): void {
  this.investigationChartSecond.rows.push({
    name: '',
    values: this.investigationChartSecond.dates.map(() => '')
  });
}

addInvestigationSecondDate(): void {
  this.investigationChartSecond.dates.push({ date: '' });

  this.investigationChartSecond.rows.forEach((row: any) => {
    row.values.push('');
  });
}

/* FIRST PAGE REMOVE */

removeInvestigationRow(): void {
  if (this.investigationChart.rows.length > 1) {
    this.investigationChart.rows.pop();
  }
}

removeInvestigationDate(): void {

  if (this.investigationChart.dates.length > 1) {

    this.investigationChart.dates.pop();

    this.investigationChart.rows.forEach((row: any) => {
      row.values.pop();
    });

  }
}


/* SECOND PAGE REMOVE */

removeInvestigationSecondRow(): void {
  if (this.investigationChartSecond.rows.length > 1) {
    this.investigationChartSecond.rows.pop();
  }
}

removeInvestigationSecondDate(): void {

  if (this.investigationChartSecond.dates.length > 1) {

    this.investigationChartSecond.dates.pop();

    this.investigationChartSecond.rows.forEach((row: any) => {
      row.values.pop();
    });

  }
}



prepareCriticalResults(): void {
  if (!this.consultant) {
    this.consultant = {};
  }

  if (!Array.isArray(this.consultant.criticalResults)) {
    this.consultant.criticalResults = [];
  }

  if (!this.consultant.criticalResults.length) {
    for (let i = 0; i < 12; i++) {
      this.consultant.criticalResults.push(this.emptyCriticalResult());
    }
  }
}

emptyCriticalResult(): any {
  return {
    critical_result: '',
    received_by: '',
    date_time: '',
    received_from: '',
    informed_to: ''
  };
}

addCriticalResult(): void {
  this.consultant.criticalResults.push(this.emptyCriticalResult());
}

removeCriticalResult(): void {
  if (this.consultant.criticalResults.length > 1) {
    this.consultant.criticalResults.pop();
  }
}
}