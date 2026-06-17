import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CasessheetService } from '../casessheet.service';
@Component({
  selector: 'app-nursing-communication',
  templateUrl: './nursing-communication.component.html',
  styleUrls: ['./nursing-communication.component.scss']
})
export class NursingCommunicationComponent implements OnInit, OnChanges {
  loginEmpId = localStorage.getItem('emp_id') || '';
userRole = localStorage.getItem('role') || '';

  constructor(private casessheetService: CasessheetService) {}

  @Input() header: any = {};
  @Input() consultant: any = {};

  editingColumnKey: string | null = null;
  handoffEntry: any = this.emptyHandoffEntry();

  exactColumns: any[] = [
    { key: 'c1', label: 'Shift 1' },
    { key: 'c2', label: 'Shift 2' },
    { key: 'c3', label: 'Shift 3' },
    { key: 'c4', label: 'Shift 4' },
    { key: 'c5', label: 'Shift 5' },
    { key: 'c6', label: 'Shift 6' },
    { key: 'c7', label: 'Shift 7' },
    { key: 'c8', label: 'Shift 8' },
    { key: 'c9', label: 'Shift 9' }
  ];

  exactHandoffGroups: any[] = [];

  currentShift: any = this.emptyExactShiftEntry();

ngOnInit(): void {
  this.prepareHandoffChart();
  this.prepareExactSecondSection();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['consultant'] && this.consultant) {
    this.prepareHandoffChart();

    if (this.consultant.nurseHandoffExact) {
      this.exactColumns =
        this.consultant.nurseHandoffExact.exactColumns?.length
          ? this.consultant.nurseHandoffExact.exactColumns
          : this.exactColumns;

      this.exactHandoffGroups =
        this.consultant.nurseHandoffExact.exactHandoffGroups?.length
          ? this.consultant.nurseHandoffExact.exactHandoffGroups
          : this.exactHandoffGroups;

      this.savedExactShiftEntries =
        this.consultant.nurseHandoffExact.savedExactShiftEntries || [];
    }

    if (!this.exactHandoffGroups.length) {
      this.prepareExactSecondSection();
    }
  }
}

  get handoff(): any {
    return this.consultant.nurseHandOff;
  }

  prepareHandoffChart(): void {
    this.header ||= {};
    this.consultant ||= {};

    this.header.patient_name ||= '';
    this.header.umr_no ||= '';
    this.header.sex ||= '';
    this.header.age ||= '';
    this.header.ip_no ||= '';

    if (!this.consultant.nurseHandOff) {
      this.consultant.nurseHandOff = {
        columns: [],
        groups: []
      };
    }

    if (!Array.isArray(this.handoff.columns)) {
      this.handoff.columns = [];
    }

    if (!Array.isArray(this.handoff.groups) || !this.handoff.groups.length) {
      this.handoff.groups = [
        {
          title: 'SITUATION',
          rows: [
            this.createRow('Identify Yourself : (Yes/No)'),
            this.createRow('Identify Patient: (Yes/No)'),
            this.createRow('General condition:<br>Good/Fair/Poor'),
            this.createRow('Level of consciousness: Conscious/<br>Semiconscious/Unconscious')
          ]
        },
        {
          title: 'BACKGROUND',
          rows: [
            this.createRow('IV Fluids: Yes/No, If Yes, Name the<br>fluid and flow rate'),
            this.createRow('Vitals Recorded: (Yes/No)'),
            this.createRow('Any Critical Lab/Radiology results:<br>Yes/No')
          ]
        },
        {
          title: 'INVASIVE LINES',
          rows: [
            this.createRow('Invasive Lines: Yes/No If yes specify<br>Date of Insertion<br>NIV Cannula, PICC line,<br>Chemoport/Dialysis Port, Arterial<br>Line, Femoral Line'),
            ...Array.from({ length: 8 }, () => this.createRow(''))
          ]
        }
      ];
    }

    if (!this.handoff.columns.length) {
      for (let i = 0; i < 9; i++) {
        this.addShiftColumn(false);
      }
    }

    this.syncRowValuesWithColumns();
  }

  emptyHandoffEntry(): any {
    return {
      area: '',
      shift: '',
      identify_yourself: '',
      identify_patient: '',
      general_condition: '',
      consciousness: '',
      iv_fluids: '',
      vitals_recorded: '',
      critical_results: '',
      invasive_lines: '',
      nurse_name: ''
    };
  }

  createRow(label: string): any {
    const values: any = {};

    if (this.consultant?.nurseHandOff?.columns) {
      this.consultant.nurseHandOff.columns.forEach((col: any) => {
        values[col.key] = '';
      });
    }

    return { label, values };
  }

  syncRowValuesWithColumns(): void {
    this.handoff.groups.forEach((group: any) => {
      group.rows.forEach((row: any) => {
        row.values ||= {};

        this.handoff.columns.forEach((col: any) => {
          if (row.values[col.key] === undefined) {
            row.values[col.key] = '';
          }
        });
      });
    });
  }

  saveHandoffEntry(): void {
    let col: any;

    if (this.editingColumnKey) {
      col = this.handoff.columns.find((c: any) => c.key === this.editingColumnKey);
    } else {
      col = this.handoff.columns.find((c: any) => !c.value);

      if (!col) {
        this.addShiftColumn(false);
        col = this.handoff.columns[this.handoff.columns.length - 1];
      }
    }

    if (!col) return;

    col.value = `${this.handoffEntry.area || ''}${this.handoffEntry.area && this.handoffEntry.shift ? ' / ' : ''}${this.handoffEntry.shift || ''}`;
    col.area = this.handoffEntry.area;
    col.shift = this.handoffEntry.shift;
    col.nurse_name = this.handoffEntry.nurse_name;

    this.handoff.groups[0].rows[0].values[col.key] = this.handoffEntry.identify_yourself;
    this.handoff.groups[0].rows[1].values[col.key] = this.handoffEntry.identify_patient;
    this.handoff.groups[0].rows[2].values[col.key] = this.handoffEntry.general_condition;
    this.handoff.groups[0].rows[3].values[col.key] = this.handoffEntry.consciousness;

    this.handoff.groups[1].rows[0].values[col.key] = this.handoffEntry.iv_fluids;
    this.handoff.groups[1].rows[1].values[col.key] = this.handoffEntry.vitals_recorded;
    this.handoff.groups[1].rows[2].values[col.key] = this.handoffEntry.critical_results;

    this.handoff.groups[2].rows[0].values[col.key] = this.handoffEntry.invasive_lines;

    this.resetHandoffEntry();
  }

  editHandoffEntry(index: number): void {
    const col = this.handoff.columns[index];
    if (!col) return;

    this.editingColumnKey = col.key;

    this.handoffEntry = {
      area: col.area || '',
      shift: col.shift || '',
      identify_yourself: this.handoff.groups[0].rows[0].values[col.key] || '',
      identify_patient: this.handoff.groups[0].rows[1].values[col.key] || '',
      general_condition: this.handoff.groups[0].rows[2].values[col.key] || '',
      consciousness: this.handoff.groups[0].rows[3].values[col.key] || '',
      iv_fluids: this.handoff.groups[1].rows[0].values[col.key] || '',
      vitals_recorded: this.handoff.groups[1].rows[1].values[col.key] || '',
      critical_results: this.handoff.groups[1].rows[2].values[col.key] || '',
      invasive_lines: this.handoff.groups[2].rows[0].values[col.key] || '',
      nurse_name: col.nurse_name || ''
    };
  }

  deleteHandoffEntry(index: number): void {
    const col = this.handoff.columns[index];
    if (!col) return;

    this.handoff.groups.forEach((group: any) => {
      group.rows.forEach((row: any) => {
        delete row.values[col.key];
      });
    });

    this.handoff.columns.splice(index, 1);

    if (!this.handoff.columns.length) {
      this.addShiftColumn(false);
    }

    this.resetHandoffEntry();
  }

  resetHandoffEntry(): void {
    this.editingColumnKey = null;
    this.handoffEntry = this.emptyHandoffEntry();
  }

  addShiftColumn(clearEntry: boolean = true): void {
    const key = `shift_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    this.handoff.columns.push({
      key,
      value: '',
      area: '',
      shift: '',
      nurse_name: ''
    });

    this.handoff.groups.forEach((group: any) => {
      group.rows.forEach((row: any) => {
        row.values ||= {};
        row.values[key] = '';
      });
    });

    if (clearEntry) {
      this.resetHandoffEntry();
    }
  }

  removeShiftColumn(): void {
    if (!this.handoff.columns.length) return;

    const removed = this.handoff.columns.pop();

    this.handoff.groups.forEach((group: any) => {
      group.rows.forEach((row: any) => {
        delete row.values[removed.key];
      });
    });

    if (!this.handoff.columns.length) {
      this.addShiftColumn(false);
    }

    this.resetHandoffEntry();
  }

  addBlankInvasiveLine(): void {
    const group = this.handoff.groups.find((g: any) => g.title === 'INVASIVE LINES');

    if (group) {
      group.rows.push(this.createRow(''));
      this.syncRowValuesWithColumns();
    }
  }

  removeBlankInvasiveLine(): void {
    const group = this.handoff.groups.find((g: any) => g.title === 'INVASIVE LINES');

    if (!group || group.rows.length <= 1) return;

    group.rows.pop();
  }

  getCellValue(columnIndex: number, groupIndex: number, rowIndex: number): string {
    const col = this.handoff.columns[columnIndex];
    const row = this.handoff.groups?.[groupIndex]?.rows?.[rowIndex];

    if (!col || !row) return '';

    return row.values?.[col.key] || '';
  }

  prepareExactSecondSection(): void {
    this.exactHandoffGroups = [
      {
        title: 'ASSESSMENT',
        rows: [
          this.exactRow('Temperature'),
          this.exactRow('Pulse'),
          this.exactRow('Respiration Rate'),
          this.exactRow('Blood Pressure'),
          this.exactRow('SpO₂'),
          this.exactRow('If on oxygen specify type of mask<br>& Limit'),
          this.exactRow('GRBS'),
          this.exactRow('Pain Score Yes/No, If yes Specify<br>Site & Score'),
          this.exactRow('Any other like CPAP, BIPAP'),
          this.exactRow('Restraints'),
          this.exactRow('Intake/Output'),
          this.exactRow('Drain Output')
        ]
      },
      {
        title: 'RECOMMENDATION',
        rows: [
          this.exactRow('Risk for fall: Score<br>(Ready Reference)'),
          this.exactRow('Prevention for Fall Programme<br>(Ready Reference)'),
          this.exactRow('Risk for pressure Ulcer: Score<br>(Ready Reference)'),
          this.exactRow('Phlebitis score (VIP tool ready<br>Reference)'),
          this.exactRow('Bowel Incontinence: Stool/Urine'),
          this.exactRow('Activities Daily living'),
          this.exactRow('Elimination Needs'),
          this.exactRow('Diet'),
          this.exactRow('Pending Reports'),
          this.exactRow('Any others')
        ]
      },
      {
        title: '',
        rows: [
          this.exactRow('Date'),
          this.exactRow('Time'),
          this.exactRow('Handover by Sign &<br>Employee ID')
        ]
      }
    ];
  }

  exactRow(label: string): any {
    const values: any = {};
    this.exactColumns.forEach((col: any) => {
      values[col.key] = '';
    });

    return { label, values };
  }

  emptyExactShiftEntry(): any {
    return {
      date: '',
      shift: '',
      columnKey: '',
      nurseName: '',
      temperature: '',
      pulse: '',
      respiration: '',
      bp: '',
      spo2: '',
      grbs: '',
      pain: '',
      intakeOutput: ''
    };
  }

saveExactShiftEntry(): void {

  if (!this.currentShift.date) {
    alert('Please select date');
    return;
  }

  if (!this.currentShift.shift) {
    alert('Please select shift');
    return;
  }

  const duplicateIndex = this.savedExactShiftEntries.findIndex(
    (x: any, index: number) =>
      x.date === this.currentShift.date &&
      x.shift === this.currentShift.shift &&
      index !== this.editingExactIndex
  );

  if (duplicateIndex !== -1) {
    alert('This date and shift already saved. Please click Edit, do not add again.');
    return;
  }

  let colKey = this.currentShift.columnKey;

  if (!colKey) {
    const emptyCol = this.exactColumns.find((col: any) => !col.date && !col.shift);
    colKey = emptyCol ? emptyCol.key : '';

    if (!colKey) {
      this.addExactShiftColumn();
      colKey = this.exactColumns[this.exactColumns.length - 1].key;
    }

    this.currentShift.columnKey = colKey;
  }

  const selectedColumn = this.exactColumns.find((x: any) => x.key === colKey);

  if (selectedColumn?.date || selectedColumn?.shift) {
    if (this.editingExactIndex === null) {
      alert('This column already has data. Please select empty column.');
      return;
    }
  }

  if (selectedColumn) {
    selectedColumn.shift = this.currentShift.shift;
    selectedColumn.date = this.currentShift.date;
    selectedColumn.nurse = this.currentShift.nurseName;
  }

  this.setExactRowValue('Temperature', colKey, this.currentShift.temperature);
  this.setExactRowValue('Pulse', colKey, this.currentShift.pulse);
  this.setExactRowValue('Respiration Rate', colKey, this.currentShift.respiration);
  this.setExactRowValue('Blood Pressure', colKey, this.currentShift.bp);
  this.setExactRowValue('SpO₂', colKey, this.currentShift.spo2);
  this.setExactRowValue('GRBS', colKey, this.currentShift.grbs);
  this.setExactRowValue('Pain Score Yes/No, If yes Specify<br>Site & Score', colKey, this.currentShift.pain);
  this.setExactRowValue('Intake/Output', colKey, this.currentShift.intakeOutput);

  this.setExactRowValue('Date', colKey, this.currentShift.date);
  this.setExactRowValue('Time', colKey, this.currentShift.shift);
  this.setExactRowValue('Handover by Sign &<br>Employee ID', colKey, this.currentShift.nurseName);

const savedData = {
  ...this.currentShift,
  createdBy: this.loginEmpId,
  createdDate: new Date(),
  columnKey: colKey,
  columnLabel: selectedColumn?.label || ''
};

  if (this.editingExactIndex !== null) {
    this.savedExactShiftEntries[this.editingExactIndex] = savedData;
    alert('Shift data updated successfully');
  } else {
    this.savedExactShiftEntries.push(savedData);
    alert('Shift data saved successfully');
  }

  this.editingExactIndex = null;
  this.clearExactShiftEntry();
}



  setExactRowValue(label: string, columnKey: string, value: string): void {
    this.exactHandoffGroups.forEach((group: any) => {
      group.rows.forEach((row: any) => {
        if (row.label === label) {
          row.values[columnKey] = value || '';
        }
      });
    });
  }

  clearExactShiftEntry(): void {
    this.currentShift = this.emptyExactShiftEntry();
  }

  trackByIndex(index: number): number {
    return index;
  }


  savedExactShiftEntries: any[] = [];
editingExactIndex: number | null = null;

editExactShiftEntry(index: number): void {
  const entry = this.savedExactShiftEntries[index];
  if (!entry) return;

  this.editingExactIndex = index;
  this.currentShift = { ...entry };
}

deleteExactShiftEntry(index: number): void {
  const entry = this.savedExactShiftEntries[index];
  if (!entry) return;

  const colKey = entry.columnKey;

  this.exactHandoffGroups.forEach((group: any) => {
    group.rows.forEach((row: any) => {
      row.values[colKey] = '';
    });
  });

  const selectedColumn = this.exactColumns.find((x: any) => x.key === colKey);
  if (selectedColumn) {
    selectedColumn.shift = '';
    selectedColumn.date = '';
    selectedColumn.nurse = '';
  }

  this.savedExactShiftEntries.splice(index, 1);
  this.clearExactShiftEntry();
}

addExactShiftColumn(): void {
  const next = this.exactColumns.length + 1;
  const key = `c${Date.now()}`;

  this.exactColumns.push({
    key,
    label: `Shift ${next}`,
    shift: '',
    date: '',
    nurse: ''
  });

  this.exactHandoffGroups.forEach((group: any) => {
    group.rows.forEach((row: any) => {
      row.values[key] = '';
    });
  });
}

removeExactShiftColumn(): void {
  if (this.exactColumns.length <= 1) return;

  const removed = this.exactColumns.pop();

  this.exactHandoffGroups.forEach((group: any) => {
    group.rows.forEach((row: any) => {
      delete row.values[removed.key];
    });
  });

  this.savedExactShiftEntries = this.savedExactShiftEntries.filter(
    (entry: any) => entry.columnKey !== removed.key
  );
}

addExactOtherRow(): void {
  const recommendationGroup = this.exactHandoffGroups.find(
    (g: any) => g.title === 'RECOMMENDATION'
  );

  if (!recommendationGroup) return;

  recommendationGroup.rows.push(this.exactRow('Any others'));
}

removeExactOtherRow(): void {
  const recommendationGroup = this.exactHandoffGroups.find(
    (g: any) => g.title === 'RECOMMENDATION'
  );

  if (!recommendationGroup || recommendationGroup.rows.length <= 1) return;

  recommendationGroup.rows.pop();
}


uploadExactTableSignature(event: any, col: any): void {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload image only');
    event.target.value = '';
    return;
  }

  col.signature = '';
  col.signature_file = file;

  const reader = new FileReader();

reader.onload = () => {
  col.signature_preview = reader.result as string;
  this.syncExactToConsultant();
};

  reader.readAsDataURL(file);
    this.syncExactToConsultant();

}

prepareCaseSheetPayload(): any {
  this.consultant.nurseHandOff = this.handoff;

  this.consultant.nurseHandoffExact = {
    exactColumns: this.exactColumns,
    exactHandoffGroups: this.exactHandoffGroups,
    savedExactShiftEntries: this.savedExactShiftEntries || []
    
  };

  return {
    header: this.header,
    consultant: this.consultant,
    uh_id: this.header.umr_no,
    uhid: this.header.umr_no,
    ip_no: this.header.ip_no,
    patient_name: this.header.patient_name,
    status: 'draft'
  };
}

safeParse(value: any): any {
  if (!value) return null;

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('JSON PARSE ERROR:', value);
    return null;
  }
}

bindCaseSheetSections(res: any): void {
  const latest = res?.data?.[0];

  if (!latest) {
    alert('No saved case sheet found');
    return;
  }

  const sections = this.safeParse(latest.sections) || [];



  const handoffSection = sections.find(
    (x: any) => x.section_key === 'nurse_handoff'
  );

  const exactSection = sections.find(
    (x: any) => x.section_key === 'nurse_handoff_exact'
  );

  if (handoffSection?.section_data) {
    const handoffData = this.safeParse(handoffSection.section_data);

    if (handoffData) {
      this.consultant.nurseHandOff = handoffData;
    }
  }

  if (exactSection?.section_data) {
    const exactData = this.safeParse(exactSection.section_data);
    if (exactData) {
      this.exactColumns = exactData.exactColumns || [];
      this.exactHandoffGroups = exactData.exactHandoffGroups || [];
      this.savedExactShiftEntries = exactData.savedExactShiftEntries || [];
    }
  }

  alert('Saved nurse handoff loaded successfully');
}


syncExactToConsultant(): void {
  this.consultant.nurseHandOff = this.handoff;

  this.consultant.nurseHandoffExact = {
    exactColumns: this.exactColumns,
    exactHandoffGroups: this.exactHandoffGroups,
    savedExactShiftEntries: this.savedExactShiftEntries || []
  };
}


}