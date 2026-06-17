import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-fall-pain-assessment',
  templateUrl: './fall-pain-assessment.component.html',
  styleUrls: ['./fall-pain-assessment.component.scss']
})
export class FallPainAssessmentComponent implements OnInit, OnChanges {
@Input() header: any = {};
@Input() consultant: any = {};

  fall: any = {};
  fallDates: any[] = [];
  boxColumns: number[] = [];
  fallGroups: any[] = [];

  activeBox: number = -1;

  painRows: any[] = [];
  painNumbers: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectedPainScore: number | null = null;
  selectedPainFace: string = '';
  selectedBehaviour: any[] = [];
  behaviourTotalScore: number = 0;
  selectedVentilation: number | null = null;

  faces: any[] = [
    { icon: '😊', text: 'No Hurt', score: '0', value: 0 },
    { icon: '🙂', text: 'Hurts like Bite', score: '1-2', value: 2 },
    { icon: '😐', text: 'Hurts like More', score: '3-4', value: 4 },
    { icon: '😟', text: 'Hurts even More', score: '5-6', value: 6 },
    { icon: '😢', text: 'Hurts Whole lot', score: '7-8', value: 8 },
    { icon: '😭', text: 'Hurts Worst', score: '9-10', value: 10 }
  ];

  behaviouralScale: any[] = [
    { item: 'Facial Expression', description: 'Relaxed', score: 1, group: 'face' },
    { item: 'Facial Expression', description: 'Partially Tightened (Brow. Lowering)', score: 2, group: 'face' },
    { item: 'Facial Expression', description: 'Fully Tightened (Eyelid)', score: 3, group: 'face' },
    { item: 'Facial Expression', description: 'Grimacing', score: 4, group: 'face' },

    { item: 'Upper Limbs', description: 'No Movement', score: 1, group: 'limb' },
    { item: 'Upper Limbs', description: 'Partially Bent', score: 2, group: 'limb' },
    { item: 'Upper Limbs', description: 'Fully Bent with finger flexion', score: 3, group: 'limb' },
    { item: 'Upper Limbs', description: 'Permanently Retracted', score: 4, group: 'limb' }
  ];

  ventilationOptions: any[] = [
    { description: 'Tolerating Movement', score: 1 },
    { description: 'Coughing but tolerating ventilation most of the time', score: 2 },
    { description: 'Fighting ventilation', score: 3 },
    { description: 'Unable to control ventilation', score: 4 }
  ];

ngOnInit(): void {
  if (!this.consultant) {
    this.consultant = {};
  }

  this.prepareFallAssessment();
  this.preparePainAssessment();
  this.prepareNursingAssessment();

  this.consultant.fallAssessment = this.fall;
  this.consultant.fallDates = this.fallDates;
  this.consultant.fallGroups = this.fallGroups;
  this.consultant.painRows = this.painRows;
  this.consultant.nursingDates = this.nursingDates;
  this.consultant.nursingColumns = this.nursingColumns;
  this.consultant.nursingRows = this.nursingRows;
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['consultant'] && this.consultant) {
    this.prepareFallAssessment();
    this.preparePainAssessment();
    this.prepareNursingAssessment();
  }
}

preparePainAssessment(): void {
  this.painRows =
    Array.isArray(this.consultant.painRows) && this.consultant.painRows.length
      ? this.consultant.painRows
      : [this.emptyPainRow()];

  this.selectedPainScore = this.consultant.selectedPainScore ?? null;
  this.selectedPainFace = this.consultant.selectedPainFace || '';
  this.selectedBehaviour = this.consultant.selectedBehaviour || [];
  this.selectedVentilation = this.consultant.selectedVentilation ?? null;
  this.behaviourTotalScore = this.consultant.behaviourTotalScore || 0;

  this.syncPainAssessment();
}

syncPainAssessment(): void {
  this.consultant.painRows = this.painRows;
  this.consultant.selectedPainScore = this.selectedPainScore;
  this.consultant.selectedPainFace = this.selectedPainFace;
  this.consultant.selectedBehaviour = this.selectedBehaviour;
  this.consultant.selectedVentilation = this.selectedVentilation;
  this.consultant.behaviourTotalScore = this.behaviourTotalScore;
}
addPainRow(): void {
  this.painRows.push(this.emptyPainRow());
  this.syncPainAssessment();
}

removePainRow(index: number): void {
  if (this.painRows.length > 1) {
    this.painRows.splice(index, 1);
    this.syncPainAssessment();
  }
}

  emptyPainRow(): any {
    const now = new Date();

    return {
      date: now.toISOString().substring(0, 10),
      time: now.toTimeString().substring(0, 5),
      pain_score: '',
      character: '',
      location: '',
      duration: '',
      referral: '',
      intervention: '',
      assessed_by: '',
      doctor_by: ''
    };
  }

selectPainScore(score: number): void {
  this.selectedPainScore = score;

  if (this.painRows.length) {
    this.painRows[this.painRows.length - 1].pain_score = score;
  }

  this.syncPainAssessment();
}

selectPainFace(face: any): void {
  this.selectedPainFace = face.score;
  this.selectedPainScore = face.value;

  if (this.painRows.length) {
    this.painRows[this.painRows.length - 1].pain_score = face.value;
  }

  this.syncPainAssessment();
}

selectBehaviourItem(item: any): void {
  const index = this.selectedBehaviour.findIndex(x => x.group === item.group);

  if (index >= 0) {
    this.selectedBehaviour[index] = item;
  } else {
    this.selectedBehaviour.push(item);
  }

  this.calculateBehaviourTotal();
  this.syncPainAssessment();
}


  isBehaviourSelected(item: any): boolean {
    return this.selectedBehaviour.some(
      x => x.group === item.group && x.score === item.score
    );
  }

 selectVentilation(vent: any): void {
  this.selectedVentilation = vent.score;
  this.calculateBehaviourTotal();
  this.syncPainAssessment();
}


calculateBehaviourTotal(): void {
  const behaviourScore = this.selectedBehaviour.reduce(
    (total, item) => total + Number(item.score),
    0
  );

  this.behaviourTotalScore = behaviourScore + (this.selectedVentilation || 0);

  if (this.painRows.length) {
    this.painRows[this.painRows.length - 1].pain_score = this.behaviourTotalScore;
  }

  this.syncPainAssessment();
}
prepareFallAssessment(): void {
  this.boxColumns = Array.from({ length: 21 }, (_, i) => i);

  if (Array.isArray(this.consultant.fallPages) && this.consultant.fallPages.length) {
    this.fallPages = this.consultant.fallPages;
  } else {
    this.fallPages = [this.emptyFallPage()];
  }

  this.consultant.fallPages = this.fallPages;
}

emptyFallPage(): any {
  return {
    fall: {
      patient_name: '',
      ip_no: '',
      totalScore: Array(21).fill(''),
      nurseId: '',
      nurseName: '',
      nurseSignature: '',
      nurseSignature_file: null,
      nurseSignature_preview: '',
      doctorName: '',
      doctorSignature: '',
      doctorSignature_file: null,
      doctorSignature_preview: ''
    },

    fallDates: Array.from({ length: 7 }, () => ({
      date: '',
      morning: '',
      evening: '',
      night: ''
    })),

    fallGroups: this.createFallGroups()
  };
}

addFallRiskPage(): void {
  this.fallPages.push(this.emptyFallPage());
  this.consultant.fallPages = this.fallPages;
}

createFallGroups(): any[] {
  return [
    this.group('Level of consciousness/ Mental status.', [
      this.r('0', 'Alert and oriented'),
      this.r('2', 'Disoriented'),
      this.r('4', 'Intermittent Disoriented')
    ]),

    this.group('History of fall (past 3 months)', [
      this.r('0', 'No fall'),
      this.r('2', '1-2 falls'),
      this.r('4', '>3 falls')
    ]),

    this.group('Ambulation/ Elimination Status', [
      this.r('0', 'Ambulatory & continent'),
      this.r('2', 'Chair bound and requires assistance with toileting'),
      this.r('4', 'Ambulatory & incontinent')
    ]),

    this.group('Vision Status', [
      this.r('0', 'Adequate (with or without glasses)'),
      this.r('2', 'Poor (with or without glasses)'),
      this.r('4', 'Legally Blind')
    ]),

    this.group('Gait & balance', [
      this.r('', 'Normal/safe gait and balance'),
      this.r('1', 'Balance problem while standing'),
      this.r('1', 'Balance problem while walking'),
      this.r('1', 'Decreased muscular Coordination'),
      this.r('1', 'Change in gait pattern while walking'),
      this.r('1', 'Jerking or unstable when making turns'),
      this.r('1', 'Requires assistance (person, Furniture/wall or device)')
    ], 'Have patient stand on both feet without any type of assist then have walk; forward, through a doorway, then make a turn'),

    this.group('Orthostatic Changes (BP and cardiac rhythm between lying and standing)', [
      this.r('0', 'No drop in BP\nNo change in cardiac rhythm'),
      this.r('2', 'Drop <20mmhg in BP\nIncrease of rhythm<20'),
      this.r('4', 'Drop <20mmhg in BP\nIncrease of rhythm<20')
    ]),

    this.group('Medications (taken/ takes medication currently of past 7 days)', [
      this.r('0', 'None of these medications'),
      this.r('2', 'Takes 1-2 of these medications'),
      this.r('4', 'Takes 3-4 of these medications'),
      this.r('', 'PL has bad change in these medications of does in past 5 days')
    ], 'Anesthetics, antihistamines, cathartics, diuretics, antihypertensive, antiseizure, benzodiazepines hypoglycemic, psychotropic, sedative/hypnotics'),

    this.group('Predisposing Disease', [
      this.r('0', 'None present'),
      this.r('2', '1-2 present'),
      this.r('4', '3 or more present')
    ], 'Hypertension, vertigo, CVA, Parkinsons Disease Lose of limb(s), seizures, arthritis, osteoporosis, fractures'),

    this.group('Equipment issues (assistive devices)', [
      this.r('0', 'No risk factor noted'),
      this.r('1', 'Oxygen Tubing'),
      this.r('1', 'Inappropriate or does not consistently use device'),
      this.r('1', 'Equipment needs'),
      this.r('1', 'Others')
    ])
  ];
}



  group(parameter: string, rows: any[], note: string = ''): any {
    return { parameter, rows, note };
  }

  r(score: string, condition: string): any {
    return {
      score,
      condition,
      values: Array(21).fill('')
    };
  }

  toggleTick(row: any, index: number): void {
    row.values[index] = row.values[index] === '✓' ? '' : '✓';
  }

  onNurseSignUpload(event: any): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.fall.nurseSignature = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onDoctorSignUpload(event: any): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.fall.doctorSignature = reader.result;
    };

    reader.readAsDataURL(file);
  }


  nursingDates: any[] = [];
nursingShifts: any[] = [];
nursingColumns: number[] = [];
nursingRows: any[] = [];


nursingRow(label: string, options: string[] = []): any {
  return {
    label,
    options,
    values: Array(6).fill('')
  };
}

gRows: any[] = [];

prepareNursingAssessment(): void {
  this.nursingDates =
    Array.isArray(this.consultant.nursingDates) && this.consultant.nursingDates.length
      ? this.consultant.nursingDates
      : [
          { date: '' },
          { date: '' }
        ];

  this.nursingColumns =
    Array.isArray(this.consultant.nursingColumns) && this.consultant.nursingColumns.length
      ? this.consultant.nursingColumns
      : [
          { key: 'd1_m', time: '' },
          { key: 'd1_e', time: '' },
          { key: 'd1_n', time: '' },
          { key: 'd2_m', time: '' },
          { key: 'd2_e', time: '' },
          { key: 'd2_n', time: '' }
        ];

  this.nursingRows =
    Array.isArray(this.consultant.nursingRows) && this.consultant.nursingRows.length
      ? this.consultant.nursingRows
      : [
          this.createNursingTextRow('Patient Response'),
          this.createNursingTextRow('Airway'),
          this.createNursingFixedRow('Abdomen', ['Normal', 'Distended', 'Palpable-mass']),
          this.createNursingTextRow('Bowel Elimination'),
          this.createNursingFixedRow('Hygiene', ['Eye/Skin/', 'Mouth/', 'Perineum Any', 'Other']),
          this.createNursingFixedRow('Patient Safety', ['Side Rails', 'Lighting', 'Education', 'Toilet', 'Cleanliness']),
          this.createNursingTextRow('Diet'),
          this.createNursingTextRow('Patient Counselling'),
          this.createNursingTextRow('Other Nursing Procedures'),
          this.createNursingTextRow('Any Other Findings'),
          this.createNursingTextRow('Sign. With Name'),
          this.createNursingTextRow('Handed over by'),
          this.createNursingTextRow('Taken by')
        ];

  this.syncNursingAssessment();
}
syncNursingAssessment(): void {
  this.consultant.nursingDates = this.nursingDates;
  this.consultant.nursingColumns = this.nursingColumns;
  this.consultant.nursingRows = this.nursingRows;
}
createNursingTextRow(label: string): any {
  const values: any = {};

  this.nursingColumns.forEach((col: any) => {
    values[col.key] = '';
  });

  return {
    label,
    type: 'text',
    values
  };
}

createNursingFixedRow(label: string, options: string[]): any {
  const values: any = {};

  this.nursingColumns.forEach((col: any) => {
    values[col.key] = [...options];
  });

  return {
    label,
    type: 'fixed',
    options,
    values
  };
}
 trackByIndex(index: number): number {
  return index;
} 

fallPages: any[] = [];

removeFallRiskPage(index: number): void {
  if (this.fallPages.length <= 1) {
    alert('At least one Fall Risk page is required');
    return;
  }

  if (!confirm('Delete this Fall Risk page?')) {
    return;
  }

  this.fallPages.splice(index, 1);
  this.consultant.fallPages = this.fallPages;
}
onFallSignatureUpload(event: any, target: any, key: string): void {
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

}