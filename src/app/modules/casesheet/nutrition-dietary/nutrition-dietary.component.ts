import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-nutrition-dietary',
  templateUrl: './nutrition-dietary.component.html',
  styleUrls: ['./nutrition-dietary.component.scss']
})
export class NutritionDietaryComponent implements OnInit,OnChanges  {

  @Input() header: any = {};
  @Input() consultant: any = {};



  ngOnInit(): void {
    this.prepareNutrition();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['consultant'] && this.consultant) {
      this.prepareNutrition();
    }
  }

prepareNutrition(): void {
  if (!this.consultant) {
    this.consultant = {};
  }

  const oldData = this.consultant.nutritionDietary || {};

  this.consultant.nutritionDietary = {
    date: oldData.date || '',

    initial: {
      bmi_yes: false,
      bmi_no: false,
      weight_loss_yes: false,
      weight_loss_no: false,
      reduced_intake_yes: false,
      reduced_intake_no: false,
      severely_ill_yes: false,
      severely_ill_no: false,
      ...(oldData.initial || {})
    },

    nutritional_score: oldData.nutritional_score || '',
    disease_score: oldData.disease_score || '',
    total_score: oldData.total_score || '',
    age_adjusted_score: oldData.age_adjusted_score || '',
    other_diseases: oldData.other_diseases || '',
    risk_assessment_required: oldData.risk_assessment_required || '',
    staff_signature_name: oldData.staff_signature_name || '',
staff_signature_file: oldData.staff_signature_file || null,
staff_signature_preview: oldData.staff_signature_preview || '',
    assessment: {
      ...this.emptyAssessment(),
      ...(oldData.assessment || {})
    },

    dietaryNotes: {
      ...this.emptyDietaryNotes(),
      ...(oldData.dietaryNotes || {}),
      rows: this.normalizeDietaryRows(oldData.dietaryNotes?.rows)
    }
  };
}

emptyAssessment(): any {
  return {
    weight_change: '',
    increased_gain: '',
    decreased_loss: '',
    nutritionally_at_risk: '',
    specific_intervention: '',
    current_feeding_pattern: '',
    energy_requirement_day: '',
    protein_requirement_day: '',
    instruction: '',
    dietician_name_signature: '',
    dietician_signature_file: null,
    dietician_signature_preview: '',
    date_time: ''
  };
}

  emptyDietaryNotes(): any {
    return {
      allergy: '',
      allergy_specify: '',
      rows: [
        this.emptyDietaryNoteRow()
      ]
    };
  }

emptyDietaryNoteRow(): any {
  return {
    date_time: '',
    notes: '',
    signature_name: '',
    signature_file: null,
    signature_preview: ''
  };
}

  normalizeDietaryRows(rows: any): any[] {
    if (!Array.isArray(rows) || !rows.length) {
      return [this.emptyDietaryNoteRow()];
    }

    return rows.map((row: any) => ({
      ...this.emptyDietaryNoteRow(),
      ...row
    }));
  }

  addDietaryNoteRow(): void {
    this.consultant.nutritionDietary.dietaryNotes.rows.push(
      this.emptyDietaryNoteRow()
    );
  }

  removeDietaryNoteRow(index: number): void {
    const rows = this.consultant.nutritionDietary.dietaryNotes.rows;

    if (rows.length <= 1) {
      alert('At least one row required');
      return;
    }

    rows.splice(index, 1);
  }

  selectRisk(value: 'Yes' | 'No'): void {
    this.consultant.nutritionDietary.risk_assessment_required = value;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSignatureUpload(event: any, row: any, key: string): void {

  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload image only');
    event.target.value = '';
    return;
  }

  row[key + '_file'] = file;

  const reader = new FileReader();

  reader.onload = () => {
    row[key + '_preview'] = reader.result;
  };

  reader.readAsDataURL(file);
}
}