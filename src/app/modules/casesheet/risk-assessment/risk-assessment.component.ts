import { Component, Input, OnInit } from '@angular/core';
import { CasessheetService } from '../casessheet.service';
@Component({
  selector: 'app-risk-assessment',
  templateUrl: './risk-assessment.component.html',
  styleUrls: ['./risk-assessment.component.scss']
})
export class RiskAssessmentComponent implements OnInit {

  @Input() header: any = {
    patient_name: '',
    umr_no: '',
    sex: '',
    age: '',
    ip_no: ''
  };
constructor(private casessheetService: CasessheetService) {}
pressureUlcerRisk: any = {
  dates: [''],
  times: [
    ['08', '2', '8']
  ],
  rows: []
};

  parameters: any[] = [
    {
      title: 'Sensory perception',
      options: [
        '1. Completely limited',
        '2. Very limited',
        '3. Slightly limited',
        '4. No impairment'
      ]
    },
    {
      title: 'Moisture',
      options: [
        '1. Constantly moist',
        '2. Often',
        '3. Occasionally moist',
        '4. Rarely moist'
      ]
    },
    {
      title: 'Activity',
      options: [
        '1. Bed fast',
        '2. Chair fast',
        '3. Walks occasionally',
        '4. Walks frequently'
      ]
    },
    {
      title: 'Mobility',
      options: [
        '1. Completely immobile',
        '2. Very limited',
        '3. Slightly limited',
        '4. No limitation'
      ]
    },
    {
      title: 'Nutrition',
      options: [
        '1. Very poor',
        '2. Probably inadequate',
        '3. Adequate',
        '4. Excellent'
      ]
    },
    {
      title: 'Friction and shear',
      options: [
        '1. Maximum to moderate assistance for movement',
        '2. Minimal assistance for movement',
        '3. No Assistance for movement'
      ]
    }
  ];

ngOnInit(): void {
  this.buildRows();
  this.addBundlePage();
  this.addActivityPage();
  this.addProcedurePage();

  setTimeout(() => {
    this.loadRiskAssessmentData();
  }, 500);
}

buildRows(): void {
  this.pressureUlcerRisk.rows = [];

  this.parameters.forEach(group => {
    this.pressureUlcerRisk.rows.push({
      isHeader: true,
      label: group.title,
      values: []
    });

    group.options.forEach((option: string) => {
      this.pressureUlcerRisk.rows.push({
        isHeader: false,
        label: option,
        values: Array(this.pressureUlcerRisk.dates.length * 3).fill('')
      });
    });
  });

  this.pressureUlcerRisk.rows.push({
    isHeader: true,
    label: 'TOTAL SCORE',
    values: Array(this.pressureUlcerRisk.dates.length).fill('')
  });

  this.pressureUlcerRisk.rows.push({
    isHeader: false,
    label: '1. Preventive Measures',
    values: Array(this.pressureUlcerRisk.dates.length).fill('')
  });

  this.pressureUlcerRisk.rows.push({
    isHeader: false,
    label: '2. Name and sign of the nursing staff',
    values: Array(this.pressureUlcerRisk.dates.length).fill('')
  });

  this.pressureUlcerRisk.rows.push({
    isHeader: false,
    label: '3. Name and sign of the Doctor',
    values: Array(this.pressureUlcerRisk.dates.length).fill('')
  });
}

  getScore(): number {
    let total = 0;

    this.pressureUlcerRisk.rows.forEach((row: any) => {
      if (!row.isHeader) {
        row.values.forEach((v: any) => {
          const n = Number(v);
          if (!isNaN(n)) total += n;
        });
      }
    });

    return total;
  }

addDateColumn(): void {
  this.pressureUlcerRisk.dates.push('');
  this.pressureUlcerRisk.times.push(['08', '14', '20']);

  this.pressureUlcerRisk.rows.forEach((row: any) => {
    if (row.isHeader && row.label !== 'TOTAL SCORE') return;

    if (this.isSingleCellRow(row)) {
      row.values.push('');
    } else {
      row.values.push('', '', '');
    }
  });
}

removeDateColumn(): void {
  if (this.pressureUlcerRisk.dates.length <= 1) return;

  this.pressureUlcerRisk.dates.pop();
  this.pressureUlcerRisk.times.pop();

  this.pressureUlcerRisk.rows.forEach((row: any) => {
    if (row.isHeader && row.label !== 'TOTAL SCORE') return;

    if (this.isSingleCellRow(row)) {
      row.values.pop();
    } else {
      row.values.splice(row.values.length - 3, 3);
    }
  });

  this.calculateTotalScores();
}
clearOtherOptions(currentRow: any, cellIndex: number): void {
  if (!currentRow || currentRow.isHeader) return;

  const currentRowIndex = this.pressureUlcerRisk.rows.indexOf(currentRow);

  let groupStart = currentRowIndex;
  while (groupStart >= 0 && !this.pressureUlcerRisk.rows[groupStart].isHeader) {
    groupStart--;
  }

  if (groupStart < 0) return;

  const optionRows = this.pressureUlcerRisk.rows.slice(groupStart + 1, groupStart + 5);

  optionRows.forEach((row: any) => {
    if (row !== currentRow && row.values && row.values[cellIndex] !== undefined) {
      row.values[cellIndex] = '';
    }
  });
}

calculateTotalScores(): void {
  const totalRow = this.pressureUlcerRisk.rows.find(
    (r: any) => r.label === 'TOTAL SCORE'
  );

  if (!totalRow) return;

  for (let d = 0; d < this.pressureUlcerRisk.dates.length; d++) {
    let total = 0;

    for (let t = 0; t < 3; t++) {
      const cellIndex = d * 3 + t;
      let timeTotal = 0;

      this.parameters.forEach((parameter: any) => {
        const groupIndex = this.pressureUlcerRisk.rows.findIndex(
          (r: any) => r.isHeader && r.label === parameter.title
        );

        const optionRows = this.pressureUlcerRisk.rows.slice(
          groupIndex + 1,
          groupIndex + 1 + parameter.options.length
        );

        optionRows.forEach((row: any, optionIndex: number) => {
          if (row.values[cellIndex] === '✓') {
            timeTotal += optionIndex + 1;
          }
        });
      });

      total = Math.max(total, timeTotal);
    }

    totalRow.values[d] = total || '';
  }
}

selectPressureTick(row: any, cellIndex: number): void {
  if (!row || row.isHeader) return;

  const alreadySelected = row.values[cellIndex] === '✓';

  this.clearOtherOptions(row, cellIndex);

  row.values[cellIndex] = alreadySelected ? '' : '✓';

  this.calculateTotalScores();
}

updateTime(dateIndex: number, timeIndex: number, value: string): void {
  if (!this.pressureUlcerRisk.times[dateIndex]) {
    this.pressureUlcerRisk.times[dateIndex] = ['', '', ''];
  }

  this.pressureUlcerRisk.times[dateIndex][timeIndex] = value;
}

trackByIndex(index: number): number {
  return index;
}

trackByRowLabel(index: number, row: any): string {
  return row.label + '_' + index;
}

getNormalCells(): number[] {
  return Array(this.pressureUlcerRisk.dates.length * 3).fill(0);
}

isSingleCellRow(row: any): boolean {
  return row.label === 'TOTAL SCORE'
    || row.label.includes('Preventive')
    || row.label.includes('Name');
}


bundleTimes = [
  { hour: '8', period: 'AM' },
  { hour: '9', period: 'AM' },
  { hour: '10', period: 'AM' },
  { hour: '11', period: 'AM' },
  { hour: '12', period: 'PM' },
  { hour: '1', period: 'PM' },
  { hour: '2', period: 'PM' },
  { hour: '3', period: 'PM' },
  { hour: '4', period: 'PM' },
  { hour: '5', period: 'PM' },
  { hour: '6', period: 'PM' },
  { hour: '7', period: 'PM' },
  { hour: '8', period: 'PM' },
  { hour: '9', period: 'PM' },
  { hour: '10', period: 'PM' },
  { hour: '11', period: 'PM' },
  { hour: '12', period: 'AM' },
  { hour: '1', period: 'AM' },
  { hour: '2', period: 'AM' },
  { hour: '3', period: 'AM' },
  { hour: '4', period: 'AM' },
  { hour: '5', period: 'AM' },
  { hour: '6', period: 'AM' },
  { hour: '7', period: 'AM' }
];

bundleItems = [
  'Positioning-2nd Hourly in ICUs & 4th Hourly in wards',
  'Back Care-2nd Hourly in ICUs & 4th Hourly in wards',
  'Frequent check/changing of diapers & cozy sheets',
  'Frequent check of alpha beds/nimbus beds',
  'Frequent check of urinary catheters',
  'Immediate cleaning of excreta (urine / stools)'
];

pressureBundlePages: any[] = [];


createBundlePage() {
  return {
    date: '',
    values: this.bundleItems.map(() =>
      this.bundleTimes.map(() => '')
    )
  };
}

addBundlePage(): void {
  this.pressureBundlePages.push(this.createBundlePage());
}

removeBundlePage(): void {
  if (this.pressureBundlePages.length > 1) {
    this.pressureBundlePages.pop();
  }
}

toggleBundleCheck(pageIndex: number, bundleIndex: number, timeIndex: number): void {
  const current = this.pressureBundlePages[pageIndex].values[bundleIndex][timeIndex];
  this.pressureBundlePages[pageIndex].values[bundleIndex][timeIndex] =
    current === '✓' ? '' : '✓';
}


activity = {
  ward: '',
  consultant_name: '',
  admission_date: '',
  discharge_date: ''
};

doctorDates = Array(9).fill('');

doctorRows = Array.from({ length: 9 }, () => ({
  doctor_name: '',
  visits: Array(9).fill('')
}));

equipmentHeaders = [
  'Started Date',
  'Time of Start',
  'Stopped Date',
  'Time of Stop',
  'Total / Hrs. Day'
];

equipmentRows = Array.from({ length: 8 }, () => Array(10).fill(''));
pumpRows = Array.from({ length: 8 }, () => Array(10).fill(''));
oxygenRows = Array.from({ length: 8 }, () => Array(10).fill(''));

getEquipmentCols(): number[] {
  return Array(10).fill(0);
}

activityPages: any[] = [];

createActivityPage() {
  return {
    ward: '',
    consultant_name: '',
    admission_date: '',
    discharge_date: '',

    doctorHeaderDates: Array(9).fill(''),

    doctorRows: Array.from({ length: 9 }, () => ({
      doctor_name: '',
      signature: '',
      visits: Array(9).fill('')
    })),

    equipmentRows: Array.from({ length: 8 }, () =>
      Array(10).fill('')
    ),

    pumpRows: Array.from({ length: 8 }, () =>
      Array(10).fill('')
    ),

    oxygenRows: Array.from({ length: 8 }, () =>
      Array(10).fill('')
    )
  };
}

addActivityPage(): void {
  this.activityPages.push(
    this.createActivityPage()
  );
}


removeActivityPage(): void {

  if (this.activityPages.length > 1) {
    this.activityPages.pop();
  }

}

equipHeaders = [
  'Started Date',
  'Time of Start',
  'Stopped Date',
  'Time of Stop',
  'Total / Hrs. Day'
];

photoRows = Array.from({ length: 8 }, () => Array(10).fill(''));

procedureDates = Array(8).fill('');

procedures = [
  'INTUBATION',
  'LUMBAR PUNCTURE',
  'ALPHA BED',
  'DVT MACHINE',
  'IABP',
  'PACEMAKER',
  'FEEDING PUMP',
  'DEFIBRILLATOR',
  'BODY WARMER',
  'INCUBATOR',
  'GRBS',
  'FOLEYS CATHETER',
  'RYLES TUBE',
  'MONITOR',
  'CENTRAL INSERTION',
  'DIALYSIS CATHETER',
  'CARDIOVERSION',
  'DIALYSIS BED SIDE',
  'IV CANNULA',
  'OTHER'
];


procedureValues = this.procedures.map(() =>
  Array(this.procedureDates.length).fill('')
);

getEquipCols(): number[] {
  return Array(10).fill(0);
}

procedurePages: any[] = [];



createProcedurePage() {
  return {
    photoRows: Array.from({ length: 8 }, () => Array(10).fill('')),
    procedureValues: this.procedures.map(() =>
      Array(this.procedureDates.length).fill('')
    )
  };
}

addProcedurePage(): void {
  this.procedurePages.push(this.createProcedurePage());
}

removeProcedurePage(): void {
  if (this.procedurePages.length > 1) {
    this.procedurePages.pop();
  }
}

onDoctorSignatureUpload(event: any, row: any): void {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload image only');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    row.signature = reader.result as string;
  };

  reader.readAsDataURL(file);
}


toggleDoctorVisit(row: any, index: number): void {
  const current = row.visits[index];

  if (!current) {
    row.visits[index] = '✓';
  } else if (current === '✓') {
    row.visits[index] = 'R';
  } else if (current === 'R') {
    row.visits[index] = 'V';
  } else {
    row.visits[index] = '';
  }
}

calculateEquipmentHours(row: any, side: number): void {
  const startDateIndex = side === 1 ? 0 : 5;
  const startTimeIndex = side === 1 ? 1 : 6;
  const stopDateIndex = side === 1 ? 2 : 7;
  const stopTimeIndex = side === 1 ? 3 : 8;
  const totalIndex = side === 1 ? 4 : 9;

  if (
    !row[startDateIndex] ||
    !row[startTimeIndex] ||
    !row[stopDateIndex] ||
    !row[stopTimeIndex]
  ) {
    row[totalIndex] = '';
    return;
  }

  const start = new Date(`${row[startDateIndex]}T${row[startTimeIndex]}`);
  const stop = new Date(`${row[stopDateIndex]}T${row[stopTimeIndex]}`);

  if (stop <= start) {
    row[totalIndex] = '';
    alert('Stop time must be greater than start time');
    return;
  }

  const diffMs = stop.getTime() - start.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  row[totalIndex] = hours.toFixed(2);
}

showEntryModal = false;
activeType = '';
modalTitle = '';
editIndex: number | null = null;

physiotherapyList: any[] = [];
dressingList: any[] = [];
nebulisationList: any[] = [];
procedureList: any[] = [];
equipmentList: any[] = [];

entryForm: any = {};

openEntryModal(type: string): void {
  this.activeType = type;
  this.editIndex = null;
  this.modalTitle = this.getModalTitle(type);
  this.entryForm = this.createEmptyEntry(type);
  this.showEntryModal = true;
}

closeEntryModal(): void {
  this.showEntryModal = false;
  this.activeType = '';
  this.editIndex = null;
  this.entryForm = {};
}

getModalTitle(type: string): string {
  const titles: any = {
    physiotherapy: 'Add Physiotherapy',
    dressing: 'Add Dressing',
    nebulisation: 'Add Nebulisation',
    procedure: 'Add Procedure',
    equipment: 'Add Equipment / Other',
    photoSingle: 'Add Phototherapy Single Surface',
photoDouble: 'Add Phototherapy Double Surface',
  };

  return titles[type] || 'Add Entry';
}

createEmptyEntry(type: string): any {
  const today = new Date().toISOString().split('T')[0];

  return {
    date: today,
    time: '',
    treatment: '',
    count: 1,
    doneBy: '',
    type: '',
    remarks: '',
    medicine: '',
    procedure: '',
    fromTime: '',
    toTime: '',
    equipment: '',
    totalHours: ''
  };
}

saveEntry(): void {
  if (!this.entryForm.date) {
    alert('Please select date');
    return;
  }

  if (
    ['physiotherapy', 'dressing', 'nebulisation'].includes(this.activeType) &&
    !this.entryForm.doneBy
  ) {
    alert('Please enter Done By');
    return;
  }

  const data = { ...this.entryForm };

  if (this.activeType === 'physiotherapy') this.saveToList(this.physiotherapyList, data);
  if (this.activeType === 'dressing') this.saveToList(this.dressingList, data);
  if (this.activeType === 'nebulisation') this.saveToList(this.nebulisationList, data);
  if (this.activeType === 'procedure') this.saveToList(this.procedureList, data);
  if (this.activeType === 'photoSingle') this.saveToList(this.photoSingleList, data);
  if (this.activeType === 'photoDouble') this.saveToList(this.photoDoubleList, data);

  this.closeEntryModal();
}

saveToList(list: any[], data: any): void {
  if (this.editIndex !== null) {
    list[this.editIndex] = data;
  } else {
    list.push(data);
  }
}

editEntry(type: string, index: number): void {
  this.activeType = type;
  this.editIndex = index;
  this.modalTitle = this.getModalTitle(type).replace('Add', 'Edit');

  if (type === 'physiotherapy') {
    this.entryForm = { ...this.physiotherapyList[index] };
  }

  if (type === 'dressing') {
    this.entryForm = { ...this.dressingList[index] };
  }

  if (type === 'nebulisation') {
    this.entryForm = { ...this.nebulisationList[index] };
  }

  if (type === 'procedure') {
    this.entryForm = { ...this.procedureList[index] };
  }

  if (type === 'equipment') {
    this.entryForm = { ...this.equipmentList[index] };
  }

  if (type === 'photoSingle') {
  this.entryForm = { ...this.photoSingleList[index] };
}

if (type === 'photoDouble') {
  this.entryForm = { ...this.photoDoubleList[index] };
}

  this.showEntryModal = true;
}

deleteEntry(type: string, index: number): void {
  if (!confirm('Are you sure you want to delete this entry?')) {
    return;
  }

  if (type === 'physiotherapy') this.physiotherapyList.splice(index, 1);
  if (type === 'dressing') this.dressingList.splice(index, 1);
  if (type === 'nebulisation') this.nebulisationList.splice(index, 1);
  if (type === 'procedure') this.procedureList.splice(index, 1);
  if (type === 'equipment') this.equipmentList.splice(index, 1);
  if (type === 'photoSingle') this.photoSingleList.splice(index, 1);
if (type === 'photoDouble') this.photoDoubleList.splice(index, 1);
}

calculateTotalHours(): void {
  if (!this.entryForm.fromTime || !this.entryForm.toTime) {
    this.entryForm.totalHours = '';
    return;
  }

  const from = new Date(`2000-01-01T${this.entryForm.fromTime}`);
  const to = new Date(`2000-01-01T${this.entryForm.toTime}`);

  let diff = to.getTime() - from.getTime();

  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  this.entryForm.totalHours =
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

photoSingleList: any[] = [];
photoDoubleList: any[] = [];

getProcedureDate(procedureName: string, index: number): string {
  const list = this.procedureList.filter(
    x => x.procedure === procedureName
  );

  return list[index]?.date || '';
}

staffNurseName: string = '';
staffNurseSignature: string = '';

onStaffSignatureUpload(event: any): void {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    this.staffNurseSignature = reader.result as string;
  };

  reader.readAsDataURL(file);
}
getProcedureTreatmentRecord() {
  return {
    physiotherapyList: this.physiotherapyList,
    dressingList: this.dressingList,
    nebulisationList: this.nebulisationList,

    photoSingleList: this.photoSingleList,
    photoDoubleList: this.photoDoubleList,

    procedureList: this.procedureList,

    staffNurseName: this.staffNurseName,
    staffNurseSignature: this.staffNurseSignature,

    pressureUlcerRisk: this.pressureUlcerRisk,

    pressureBundlePages: this.pressureBundlePages,

    activityPages: this.activityPages
  };
}

saveRiskAssessmentData(): void {
  const payload = {
    uh_id: this.header?.umr_no || '',
    uhid: this.header?.umr_no || '',
    ip_no: this.header?.ip_no || '',
    patient_name: this.header?.patient_name || '',
    header: this.header,
    status: 'draft',

consultant: {
  pressureUlcerRisk: {
    risk: this.pressureUlcerRisk,
    bundlePages: this.pressureBundlePages
  },

activityChart: {
  activityPages: this.cleanBase64FromActivityPages(this.activityPages)
},

  physiotherapyList: this.physiotherapyList || [],
  dressingList: this.dressingList || [],
  nebulisationList: this.nebulisationList || [],
  photoSingleList: this.photoSingleList || [],
  photoDoubleList: this.photoDoubleList || [],
  procedureList: this.procedureList || [],
  staffNurseName: this.staffNurseName || '',
 staffNurseSignature: this.staffNurseSignature?.startsWith('data:image')
  ? ''
  : this.staffNurseSignature
}
  };

  this.casessheetService.saveCaseSheet(payload).subscribe({
    next: (res: any) => {
      if (res.status === 200) {
        alert('Saved Successfully');
        this.loadRiskAssessmentData();
      } else {
        alert(res.msg || 'Save failed');
      }
    },
    error: (err) => {
      console.error('SAVE ERROR', err);
      alert('Server error while saving');
    }
  });
}

loadRiskAssessmentData(): void {
  const uhid = this.header?.umr_no;
  if (!uhid) {
    return;
  }

  this.casessheetService.getPatientCasesheets(this.header.umr_no,
  this.header.ip_no).subscribe({
    next: (res: any) => {
      const sheet = res?.data?.[0];
      if (!sheet) return;
      if (sheet.patient_header) {
        this.header = typeof sheet.patient_header === 'string'
          ? JSON.parse(sheet.patient_header)
          : sheet.patient_header;
      }
      const sections = sheet.sections || [];
      const getSection = (key: string) => {
        const sec = sections.find((x: any) => x.section_key === key);
        if (!sec) return null;
        try {
          return typeof sec.section_data === 'string'
            ? JSON.parse(sec.section_data)
            : sec.section_data;
        } catch {
          return null;
        }
      };
      const pressureData = getSection('pressure_ulcer_risk');
      const activityData = getSection('activity_chart');
      const procedureData = getSection('procedure_treatment_record');
   if (pressureData) {
  this.pressureUlcerRisk = pressureData.risk || pressureData;

  this.pressureBundlePages =
    pressureData.bundlePages?.length
      ? pressureData.bundlePages
      : this.pressureBundlePages;
}

if (activityData) {
  this.activityPages =
    activityData.activityPages?.length
      ? activityData.activityPages
      : this.activityPages;
}

if (procedureData) {
  this.physiotherapyList = procedureData.physiotherapyList || [];
  this.dressingList = procedureData.dressingList || [];
  this.nebulisationList = procedureData.nebulisationList || [];
  this.photoSingleList = procedureData.photoSingleList || [];
  this.photoDoubleList = procedureData.photoDoubleList || [];
  this.procedureList = procedureData.procedureList || [];
  this.staffNurseName = procedureData.staffNurseName || '';
  this.staffNurseSignature = procedureData.staffNurseSignature || '';
}
      if (activityData) {
        this.activityPages =
          activityData.activityPages ||
          activityData.pages ||
          this.activityPages;
      }

      if (procedureData) {
        this.physiotherapyList = procedureData.physiotherapyList || [];
        this.dressingList = procedureData.dressingList || [];
        this.nebulisationList = procedureData.nebulisationList || [];
        this.photoSingleList = procedureData.photoSingleList || [];
        this.photoDoubleList = procedureData.photoDoubleList || [];
        this.procedureList = procedureData.procedureList || [];
        this.staffNurseName = procedureData.staffNurseName || '';
        this.staffNurseSignature = procedureData.staffNurseSignature || '';
      }
    },
    error: (err) => {
      console.error('GET CASESHEET ERROR:', err);
    }
  });
}

onPatientSelect(patient: any): void {
  this.header.patient_name = patient.patient_name;
  this.header.umr_no = patient.umr_no || patient.uh_id;
  this.header.ip_no = patient.ip_no;
  this.header.sex = patient.sex;
  this.header.age = patient.age;

  this.loadRiskAssessmentData();
}

cleanBase64FromActivityPages(pages: any[]): any[] {
  return JSON.parse(JSON.stringify(pages || [])).map((page: any) => {
    page.doctorRows = (page.doctorRows || []).map((row: any) => ({
      ...row,
      signature: row.signature?.startsWith('data:image') ? '' : row.signature
    }));

    return page;
  });
}
}