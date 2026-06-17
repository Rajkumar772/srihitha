import { Component, OnInit } from '@angular/core';
import { OpServicesService } from '../../op-patients/op-services.service';
import Swal from 'sweetalert2';

interface IKPIFieldSchema {
  key: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
}

interface IKPIRegistryItem {
  code: string;
  name: string;
  department: string;
  fields: IKPIFieldSchema[];
}


interface IKPIEntryPayload {
  kpiCode: string;
  core: {
    dateTime: string;
    patientName: string;
    ageSex: string;
    mrNo: string;
  };
  dynamic: Record<string, string>;
}

@Component({
  selector: 'app-kpis',
  templateUrl: './kpis.component.html',
  styleUrls: ['./kpis.component.scss']
})
export class KpisComponent implements OnInit {

  // Master KPI Configuration Mapping Dictionary containing all 18 targets from your format sheet
  public kpiRegistry: IKPIRegistryItem[] = [
    {
      code: 'KPI-CARD-01',
      name: 'Percentage Of Beta-Blocker Prescription With A Diagnosis Of CHF With Reduced EF',
      department: 'Cardiology',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text', placeholder: 'CHF with Reduced EF' },
        { key: 'bb_prescribed', label: 'Beta Blocker Prescribed at Discharge', type: 'select', options: ['Yes', 'No'] },
        { key: 'bb_details', label: 'Name & Dose of Beta-blocker', type: 'text', placeholder: 'e.g., Metoprolol 25mg' },
        { key: 'prescribed_by', label: 'Prescribed By', type: 'text' },
        { key: 'sign', label: 'Name & Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-CATH-02',
      name: 'Percentage of patients with myocardial infarction for whom door to balloon time of 90 minutes is achieved',
      department: 'Cathlab',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 't1_arrival', label: 'Time of Arrival (T1)', type: 'text', placeholder: 'HH:MM' },
        { key: 't2_activations', label: 'Time of Device Activation (T2)', type: 'text', placeholder: 'HH:MM' },
        { key: 'compliance', label: 'Is Door-to-balloon time ≤ 90 minutes?', type: 'select', options: ['Yes', 'No'] },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'staff_sign', label: 'Staff Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-IPD-03',
      name: 'Percentage of hospitalized patients with hypoglycaemia who achieved targeted blood glucose level',
      department: 'Inpatient Wards',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'pre_glucose', label: 'Pre-Treatment Glucose Level', type: 'text' },
        { key: 'intervention', label: 'Intervention', type: 'text' },
        { key: 'target_glucose', label: 'Target Glucose Level', type: 'text' },
        { key: 'post_glucose', label: 'Post Intervention Glucose Level', type: 'text' },
        { key: 'target_reached', label: 'Target Glucose Level Reached or Not', type: 'select', options: ['Yes', 'No'] },
        { key: 'action_taken', label: 'If No, Action Taken', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-GYN-04',
      name: 'Spontaneous Perineal Tear Rate',
      department: 'Gynic OT',
      fields: [
        { key: 'procedures', label: 'procedures', type: 'text' },
        { key: 'delivery_time', label: 'Date & Time of Delivery', type: 'text' },
        { key: 'delivery_mode', label: 'Mode of Delivery', type: 'text' },
        { key: 'tear_occurred', label: 'Whether a spontaneous perineal tear occurred or not', type: 'select', options: ['Yes', 'No'] },
        { key: 'tear_repair', label: 'Tear Repair (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Name & Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-OPH-05',
      name: 'Post operative Endophthalmitis Rate',
      department: 'Ophthal Ward',
      fields: [
        { key: 'procedures', label: 'procedures', type: 'text' },
        { key: 'onset_date', label: 'Date of Onset of Symptoms', type: 'text' },
        { key: 'symptoms', label: 'Symptoms', type: 'textarea' },
        { key: 'culture_reports', label: 'Culture Reports', type: 'text' },
        { key: 'culture_positive', label: 'Whether culture is positive for endophthalmitis', type: 'select', options: ['Yes', 'No'] },
        { key: 'treatment_given', label: 'Treatment Given', type: 'textarea' },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-ENDO-06',
      name: 'Percentage of patients undergoing colonoscopy who are sedated',
      department: 'Endoscopy / GI',
      fields: [
        { key: 'consultant', label: 'Consultant', type: 'text' },
        { key: 'sedation_administered', label: 'Sedation Administered (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'sedative_drug', label: 'Name of the Sedative Drug', type: 'text' },
        { key: 'sedation_type', label: 'Type of Sedation', type: 'text' },
        { key: 'sedated_by', label: 'Sedated By', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      code: 'KPI-SURG-07',
      name: 'Bile duct injury rate requiring operative intervention during laparoscopic cholecystectomy',
      department: 'General Surgery OT',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'injury_occurred', label: 'Bile Duct Injury (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'injury_type', label: 'Injury Type (If Yes)', type: 'text' },
        { key: 'intervention', label: 'Intervention', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Name & Sign', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      code: 'KPI-POCT-08',
      name: 'Percentage of POCT results which led to a clinical intervention',
      department: 'All Patient Care Areas',
      fields: [
        { key: 'investigation', label: 'Investigation Done', type: 'text' },
        { key: 'result', label: 'Result', type: 'text' },
        { key: 'intervention', label: 'Intervention', type: 'textarea' },
        { key: 'outcome', label: 'Outcome of Intervention', type: 'textarea' },
        { key: 'staff_sign', label: 'Staff Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-REHAB-09',
      name: 'Functional gain following rehabilitation',
      department: 'Rehabilitation',
      fields: [
        { key: 'initial_assessment', label: 'Initial Functional Assessment', type: 'textarea' },
        { key: 'discharge_assessment', label: 'Discharge Functional Assessment', type: 'textarea' },
        { key: 'functional_gain', label: 'Functional Gain before Discharge', type: 'text' },
        { key: 'interventions', label: 'Rehabilitation Interventions', type: 'textarea' },
        { key: 'rehabilitator_sign', label: 'Rehabilitator Name & Sign', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'textarea' }
      ]
    },
    {
      code: 'KPI-ICU-10',
      name: 'Percentage of sepsis patients who receives care as per the Hour-1 sepsis bundle',
      department: 'ICU',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'sepsis_recognition_time', label: 'Date & Time of Sepsis Recognition', type: 'text' },
        { key: 'lactate_measured', label: 'Lactate Measured (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'cultures_sent', label: 'Blood Cultures Sent (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'antibiotics_details', label: 'Administered Broad Spectrum Antibiotics (Drug Name & Dose)', type: 'text' },
        { key: 'fluids_initiated', label: 'Initiated Fluid Resuscitation (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'vasopressors', label: 'Vasopressors Initiated (If Needed) (Y/N)', type: 'select', options: ['Yes', 'No', 'N/A'] },
        { key: 'bundle_compliance', label: 'Hour-1 Bundle Compliance (Y/N)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      code: 'KPI-PULM-11',
      name: 'Percentage of COPD patients receiving COPD action plan at the time of discharge',
      department: 'Pulmonology',
      fields: [
        { key: 'doa', label: 'D.O.A (Date of Admission)', type: 'text' },
        { key: 'dod', label: 'D.O.D (Date of Discharge)', type: 'text' },
        { key: 'plan_given', label: 'COPD Action Plan Given (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'plan_components', label: 'Components of Action Plan', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Name & Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-NEUR-12',
      name: 'Percentage of stroke patients in whom Door to Needle time of 60 minutes is achieved',
      department: 'Neurology',
      fields: [
        { key: 'door_time', label: 'Time of Arrival (Door Time)', type: 'text' },
        { key: 'recognition_time', label: 'Time of Stroke Recognition', type: 'text' },
        { key: 'ct_completion', label: 'Time of CT Scan Completion', type: 'text' },
        { key: 'needle_time', label: 'Time of tPA Administration (Needle Time)', type: 'text' },
        { key: 'duration_minutes', label: 'Door-to-Needle Time (Minutes)', type: 'text' },
        { key: 'compliance_60', label: 'Door-to-Needle ≤ 60 min (Yes/No)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      code: 'KPI-PED-13',
      name: 'Percentage of Bronchiolitis patients treated inappropriately',
      department: 'Paediatrics',
      fields: [
        { key: 'doa', label: 'D.O.A.', type: 'text' },
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'inappropriate_treatment', label: 'Inappropriate Treatment (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'treatment_details', label: 'Inappropriate Treatment Details', type: 'textarea' },
        { key: 'guidelines_followed', label: 'Correct Treatment Guidelines Followed (Yes/No)', type: 'select', options: ['Yes', 'No'] }
      ]
    },
    {
      code: 'KPI-ONCO-14',
      name: 'Percentage of oncology patients who had treatment initiated following multidisciplinary meeting',
      department: 'Oncology',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'tumorboard_date', label: 'Date of Tumor Board Meeting', type: 'text' },
        { key: 'mdt_recommendation', label: 'Treatment Recommendation from MDT', type: 'textarea' },
        { key: 'treatment_initiated', label: 'Treatment Initiated (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'initiation_date', label: 'Date of Treatment Initiation', type: 'text' },
        { key: 'initiated_by', label: 'Treatment Initiated By', type: 'text' },
        { key: 'consultant_sign', label: 'Consultant Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-RAD-15',
      name: 'Percentage of adverse reaction to radio-pharmaceutical drugs',
      department: 'Radiology (Nuclear)',
      fields: [
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'drug_name', label: 'Name of the Radiopharmaceutical Drug Administered', type: 'text' },
        { key: 'route_dose', label: 'Dose & Route of Administration', type: 'text' },
        { key: 'adverse_reaction', label: 'Adverse Reaction (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'reaction_type', label: 'Reaction Type', type: 'text' },
        { key: 'reaction_time', label: 'Time of Reaction', type: 'text' },
        { key: 'treatment_given', label: 'Treatment Given', type: 'textarea' },
        { key: 'consultant_sign', label: 'Consultant Sign', type: 'text' }
      ]
    },
    {
      code: 'KPI-RAD-16',
      name: 'Percentage of intravenous contrast media extravasation',
      department: 'Radiology / Imaging',
      fields: [
        { key: 'procedures', label: 'procedures', type: 'text' },
        { key: 'contrast_details', label: 'Contrast Administered (Name & Volume)', type: 'text' },
        { key: 'needle_gauge', label: 'Gauge of Needle/Catheter', type: 'text' },
        { key: 'extravasation', label: 'Extravasation (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'extravasation_volume', label: 'Extravasation Volume (mL, if applicable)', type: 'text' },
        { key: 'action_taken', label: 'Action Taken', type: 'textarea' }
      ]
    },
    {
      code: 'KPI-ER-17',
      name: 'Time taken for triage',
      department: 'Emergency / Triage',
      fields: [
        { key: 't1_start', label: 'Time Triage Started (T1)', type: 'text' },
        { key: 't2_complete', label: 'Time Triage Completed (T2)', type: 'text' },
        { key: 't3_duration', label: 'Triage Duration (T3) (Minutes)', type: 'text' },
        { key: 'acuity_level', label: 'Acuity Level', type: 'select', options: ['Level 1 (Resuscitation)', 'Level 2 (Emergent)', 'Level 3 (Urgent)', 'Level 4 (Less Urgent)', 'Level 5 (Non-Urgent)'] },
        { key: 'triage_nurse', label: 'Triage Nurse', type: 'text' }
      ]
    },
    {
      code: 'KPI-DIA-18',
      name: 'Percentage of patients undergoing dialysis who are able to achieve target haemoglobin levels',
      department: 'Dialysis Unit',
      fields: [
        { key: 'pre_hb', label: 'Pre-Dialysis Hemoglobin (g/dL)', type: 'text' },
        { key: 'target_hb_range', label: 'Target Hemoglobin Range (g/dL)', type: 'text' },
        { key: 'target_achieved', label: 'Target Hemoglobin Achieved (Yes/No)', type: 'select', options: ['Yes', 'No'] },
        { key: 'technician_sign', label: 'Technician Incharge Name & Sign', type: 'text' }
      ]
    }
  ];

  public selectedKPI: IKPIRegistryItem | null = null;
  public masterEntriesList: IKPIEntryPayload[] = [];
  public filteredEntries: IKPIEntryPayload[] = [];

  public formBuffer = { dateTime: '', patientName: '', ageSex: '', mrNo: '' };
  public dynamicBuffer: Record<string, string> = {};
  private currentSearchQuery: string = '';

  constructor(private server: OpServicesService) { }
  kpivalue: any = '';
  ngOnInit(): void {
    this.getkpis();
  }


  public onIndicatorChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    this.kpivalue = selectEl.value;
    const foundKpi = this.kpiRegistry.find(
      (k: any) => k.code === this.kpivalue
    );
    if (foundKpi) {
      this.selectedKPI = foundKpi;
      this.dynamicBuffer = {};

      foundKpi.fields.forEach((f: any) => {
        this.dynamicBuffer[f.key] = '';
      });

      this.masterEntriesList = [];
      this.filteredEntries = [];

      this.getkpis();
    } else {
      this.selectedKPI = null;
      this.masterEntriesList = [];
      this.filteredEntries = [];
    }
  }
  getkpis() {
    const data = {
      kpiCode: this.kpivalue
    };
    this.server.getkpis(data).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res?.data;
        if (!Array.isArray(list)) {
          this.masterEntriesList = [];
          this.filteredEntries = [];
          return;
        }

        this.masterEntriesList = list.map((item: any) => {

          const dynamicObj: any = {};

          this.selectedKPI.fields.forEach((field: any) => {
            dynamicObj[field.key] =
              item[field.key] !== null &&
                item[field.key] !== undefined &&
                item[field.key] !== ''
                ? item[field.key]
                : '-';
          });

          return {
            kpiCode: item.kpiCode,
            core: {
              dateTime: item.dateTime || '-',
              patientName: item.patientName || '-',
              ageSex: item.ageSex || '-',
              mrNo: item.mrNo || '-'
            },
            dynamic: dynamicObj
          };
        });
        this.filteredEntries = [...this.masterEntriesList];
      },

      error: (error) => {
        console.error('Failed to fetch KPI entries:', error);
        this.masterEntriesList = [];
        this.filteredEntries = [];
      }
    });
  }
  public addEntry(event: Event): void {
    event.preventDefault();
    if (!this.selectedKPI) return;

    var data = {
      kpiCode: this.selectedKPI.code,
      dateTime: this.formBuffer.dateTime.replace('T', ' ') + ':00',
      patientName: this.formBuffer.patientName,
      ageSex: this.formBuffer.ageSex,
      mrNo: this.formBuffer.mrNo,
      dynamicData: { ...this.dynamicBuffer }
    };
    this.server.addnewkpi(data).subscribe((res) => {
      // Double-check if your backend returns data inside res.status or just res
      if (res && (res.status == 200 || res.affectedRows > 0)) {
        Swal.fire({
          title: "Good job!",
          text: "New KPI Added Successfully",
          icon: "success"
        });

        // Clear the forms here so it only resets on SUCCESS
        this.formBuffer = { dateTime: '', patientName: '', ageSex: '', mrNo: '' };
        Object.keys(this.dynamicBuffer).forEach(k => this.dynamicBuffer[k] = '');

        // If you have a refresh function, run it here
        // this.refreshTableViews();
      }
    }, (error) => {
      console.error("Server insertion failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Could not save KPI entry data.",
        icon: "error"
      });
    });
  }

  filterData(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredEntries = this.masterEntriesList.filter((row: any) => {
      const coreText = Object.values(row.core || {}).join(' ').toLowerCase();
      const dynamicText = Object.values(row.dynamic || {}).join(' ').toLowerCase();

      return coreText.includes(value) || dynamicText.includes(value);
    });
  }

  private refreshTableViews(): void {
    if (!this.selectedKPI) return;

    let subset = this.masterEntriesList.filter(e => e.kpiCode === this.selectedKPI?.code);

    if (this.currentSearchQuery) {
      subset = subset.filter(e =>
        e.core.patientName.toLowerCase().includes(this.currentSearchQuery) ||
        e.core.mrNo.toLowerCase().includes(this.currentSearchQuery) ||
        Object.values(e.dynamic).some(val => val.toLowerCase().includes(this.currentSearchQuery))
      );
    }
    this.filteredEntries = subset;
  }

  public exportToExcel(): void {
    if (!this.selectedKPI || this.filteredEntries.length === 0) {
      alert("No telemetry entries compiled to execute spreadsheet extraction.");
      return;
    }

    const baseHeaders = ['S.No', 'Date_Time', 'Patient Name', 'Age_Sex', 'MR_No'];
    const dynamicHeaders = this.selectedKPI.fields.map(f => f.label.replace(/,/g, ' '));
    const finalCSVHeaders = [...baseHeaders, ...dynamicHeaders].join(',');

    const fileRows = this.filteredEntries.map((row, index) => {
      const coreValues = [
        index + 1,
        `"${row.core.dateTime}"`,
        `"${row.core.patientName}"`,
        `"${row.core.ageSex}"`,
        `"${row.core.mrNo}"`
      ];

      const dynamicValues = this.selectedKPI!.fields.map(f => `"${row.dynamic[f.key] || ''}"`);
      return [...coreValues, ...dynamicValues].join(',');
    });

    const fullCSVString = [finalCSVHeaders, ...fileRows].join('\n');
    const blobObject = new Blob([fullCSVString], { type: 'text/csv;charset=utf-8;' });
    const extractionLink = document.createElement('a');

    extractionLink.href = URL.createObjectURL(blobObject);
    extractionLink.setAttribute('download', `${this.selectedKPI.code}_Report.csv`);
    document.body.appendChild(extractionLink);
    extractionLink.click();
    document.body.removeChild(extractionLink);
  }
}