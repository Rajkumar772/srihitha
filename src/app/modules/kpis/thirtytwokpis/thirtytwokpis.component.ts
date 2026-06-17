import { Component, OnInit } from '@angular/core';
import { OpServicesService } from '../../op-patients/op-services.service';
interface KpiField {
  key: string;
  label: string;
  type: string;
  options?: string[];
}

interface KpiIndicator {
  id: number;
  indicator_no: number;
  title: string;
  fields: KpiField[];
}

@Component({
  selector: 'app-thirtytwokpis',
  templateUrl: './thirtytwokpis.component.html',
  styleUrls: ['./thirtytwokpis.component.scss']
})
export class ThirtytwokpisComponent implements OnInit {

  selectedIndicatorId: any = '';
  selectedIndicator: KpiIndicator | null = null;

  formData: any = {};
  entries: any[] = [];

  indicators: KpiIndicator[] = [
    {
      id: 1,
      indicator_no: 1,
      title: 'Time Taken For Initial Assessment at Casualty / ICUs / Ward',
      fields: [
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'received_time', label: 'Patient Received Time T1', type: 'time' },
        { key: 'nurse_examined_time', label: 'Nurse Examined Time T2', type: 'time' },
        { key: 'doctor_examined_time', label: 'Doctor Examined Time T3', type: 'time' },
        { key: 'time_gap_t2_t1', label: 'T2 - T1', type: 'text' },
        { key: 'time_gap_t3_t1', label: 'T3 - T1', type: 'text' },
        { key: 'within_time', label: 'Within 05/15 Min', type: 'select', options: ['Yes', 'No'] },
        { key: 'nutritional_assessment', label: 'Nutritional Assessment Done', type: 'select', options: ['Yes', 'No'] },
        { key: 'care_plan', label: 'Care Plan Documented', type: 'select', options: ['Yes', 'No'] },
        { key: 'nursing_care_plan', label: 'Nursing Care Plan Documented', type: 'select', options: ['Yes', 'No'] },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'signature', label: 'Signature', type: 'text' }
      ]
    },
    {
      id: 2,
      indicator_no: 2,
      title: 'Reporting Errors Per 1000 Investigation',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'sample_type', label: 'Sample Type', type: 'select', options: ['Blood', 'Urine', 'Semen', 'Vaginal Samples', 'Biopsy', 'Any Other'] },
        { key: 'first_report_result', label: 'Result on First Test Report', type: 'textarea' },
        { key: 'redo_result', label: 'Result on Re-do', type: 'textarea' },
        { key: 'error_reason', label: 'Reason for Error', type: 'textarea' },
        { key: 'signature', label: 'Signature', type: 'text' }
      ]
    },
    {
      id: 3,
      indicator_no: 3,
      title: 'Adherence to Universal Precautions by Employees in Diagnostics',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'employees_count', label: 'Number of Employees in Lab', type: 'number' },
        { key: 'precautions_followed', label: 'Universal Precautions Followed', type: 'select', options: ['Yes', 'No'] },
        { key: 'remarks', label: 'Remarks', type: 'textarea' },
        { key: 'supervisor_signature', label: 'Supervisor Signature', type: 'text' },
        { key: 'hod_signature', label: 'HOD Signature', type: 'text' }
      ]
    },
    {
      id: 4,
      indicator_no: 4,
      title: 'Percentage of Medication Errors',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'diagnosis', label: 'Diagnosis', type: 'text' },
        { key: 'department_name', label: 'Department Name', type: 'text' },
        { key: 'medication_error', label: 'Medication Error Reported', type: 'textarea' },
        { key: 'error_reason', label: 'Reason for Medication Error', type: 'textarea' },
        { key: 'nursing_signature', label: 'Signature of Nursing Staff', type: 'text' }
      ]
    },
    {
      id: 5,
      indicator_no: 5,
      title: 'Percentage of Medication Charts with Error prone Abbreviations',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'ipid', label: 'IP ID', type: 'text' },
        { key: 'errorprone_abbreviations', label: 'Medication Chart with Error-Prone Abbreviations', type: 'text' },
        { key: 'Action_Taken', label: 'Action Taken', type: 'text' },
        { key: 'medication_error', label: 'Medication Error Reported', type: 'textarea' },
        { key: 'error_reason', label: 'Reason for Medication Error', type: 'textarea' },
        { key: 'nursing_signature', label: 'Signature of Nursing Staff', type: 'text' }
      ]
    },

    {
      id: 6,
      indicator_no: 6,
      title: 'Percentage of Inpatients Developing Adverse Drug Reaction',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'age_sex', label: 'AGE/SEX', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'doa', label: 'DOA', type: 'text' },
        { key: 'medication_error', label: 'Medication Error Reported', type: 'textarea' },
        { key: 'drug_name', label: 'DRUG NAME', type: 'text' },
        { key: 'consultant_signature', label: 'SYMPTOMS OF THE DRUG RECTION', type: 'text' },
        { key: 'consultant_sign', label: 'CONSULATANT SIGN', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'nursing_signature', label: 'Signature of Nursing Staff', type: 'text' }
      ]
    },
    {
      id: 7,
      indicator_no: 7,
      title: 'Percentage of Unplanned return to OT',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'IP_ID', label: 'IP ID', type: 'text' },
        { key: 'type_of_surgery', label: 'Type of Surgery', type: 'text' },
        { key: 'return_to_ot', label: 'Whether Patient return to OT', type: 'text' },
        { key: 'if_yes', label: 'If Yes', type: 'textarea' },
        { key: 'date_of_last_surgery', label: 'If Yes, Date of Last surgery', type: 'text' },
        { key: 'reasons_of_return', label: 'Reasons of Return', type: 'text' },
        { key: 'signature', label: 'Signature', type: 'text' },

      ]
    },

    {
      id: 8,
      indicator_no: 8,
      title: 'Percentage of Surgical Cases where the Organisations procedure to prevent Adverse Events like Wrong Site,Wrong Patient & Wrong Surgery have been adhered to',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'type_of_surgery', label: 'Type of Surgery', type: 'text' },
        { key: 'procedure_followed', label: 'Whether Procedure to Prevent Adverse Event Followed', type: 'text' },
        { key: 'remarks', label: 'If Yes', type: 'Remarks' },
        { key: 'signature', label: 'Signature', type: 'text' },

      ]
    },

    {
      id: 9,
      indicator_no: 9,
      title: 'Percentage Of Transfusion Reactions',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'type_of_surgery', label: 'Type of Transfusion Administered', type: 'text' },
        { key: 'procedure_followed', label: 'Whole Blood', type: 'text' },
        { key: 'blood_components', label: 'If Yes', type: 'text' },
        { key: 'reason_for_transfusion', label: 'Reason for Transfusion', type: 'text' },
        { key: 'signature', label: 'Signature', type: 'text' },

      ]
    },

    {
      id: 10,
      indicator_no: 10,
      title: 'Mortality Rate ICU/Wards',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'date_of_admission', label: 'Date of Admission', type: 'text' },
        { key: 'department', label: 'Department /MORTALITY RATIO  FOR ICU/WARD', type: 'text' },
        { key: 'date_of_death', label: 'Date Of Death', type: 'date' },
        { key: 'reason_for_transfusion', label: 'Reason for Transfusion', type: 'text' },
        { key: 'signature', label: 'Signature', type: 'text' },

      ]
    },

    {
      id: 11,
      indicator_no: 11,
      title: 'Return to ER within 72 Hrs with similar presenting Complaints',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'returned_to_er', label: 'Whether Pt is returned to ER within 72 Hrs', type: 'text' },
        { key: 'same_presenting_complaints', label: 'If Yes, with same presenting complaints', type: 'text' },
        { key: 'date_of_discharge_transfer', label: 'If Yes, Date of Discharge/Transfer', type: 'date' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'signature', label: 'Signature', type: 'text' },

      ]
    },

    {
      id: 12,
      indicator_no: 12,
      title: 'Incidence of Hospital Bed Sore Per 1000 Patient Days',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'age_sex', label: 'AGE/SEX', type: 'text' },
        { key: 'doa', label: 'DOA', type: 'text' },
        { key: 'diagnosis', label: 'DIAGNOSIS', type: 'date' },
        { key: 'reason_for_bed_sore', label: 'REASON FOR BED SORE', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'nursing_staff_signature', label: 'NURSING STAFF SIGNATURE', type: 'text' }

      ]
    },
    {
      id: 13,
      indicator_no: 13,
      title: 'Catheter Associated Urinary Tract Infection Rate',
      fields: [

        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'date_of_admission', label: 'Date Of Admission', type: 'date' },
        { key: 'date_of_catheterisation', label: 'Date Of Catheterisation(D1)', type: 'date' },
        { key: 'date_of_removal_of_catheters', label: 'Date of Removal of Catheters(D2)', type: 'date' },
        { key: 'catheter_days', label: 'No. of Catheter Days (D2-D1)', type: 'text' },
        { key: 'date_of_collection_of_urine_sample', label: 'Date of Collection of Urine Sample', type: 'text' },
        { key: 'no_of_urine_samples_collected', label: 'No. of Urine Samples Collected', type: 'text' },
        { key: 'urine_sample_positive', label: 'Whether Urine sample report positive for any growth', type: 'text' },
        { key: 'action_taken', label: 'Action Taken', type: 'text' },
        { key: 'remarks', label: 'Remarks', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }

      ]
    },
    {
      id: 14,
      indicator_no: 14,
      title: 'Ventilator Associated Pneumonia rate (VAP)',
      fields: [
        { key: 'date_of_admission', label: 'DATE OF ADMISSION', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'ip_no', label: 'IP NO.', type: 'text' },
        { key: 'age_sex', label: 'AGE/SEX', type: 'text' },
        { key: 'date_of_intubation', label: 'DATE OF INTUBATION(D1) ', type: 'text' },
        { key: 'ventilator_days', label: 'NO.OF VENTILATOR DAYS D3=D2-D1', type: 'date' },
        { key: 'date_of_collection_of_sample', label: 'DATE OF COLLECTION OF SAMPLE', type: 'text' },
        { key: 'no_of_samples_collected', label: 'NO.OF SAMPLES COLLECTED', type: 'text' },
        { key: 'sample_report_positive', label: 'WHETHER SAMPLE REPORT POSITIVE FOR ANY GROWTH', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'nursing_staff_signature', label: 'NURSING STAFF SIGNATURE', type: 'text' }

      ]
    },

    {
      id: 15,
      indicator_no: 15,
      title: 'Central Line Infection Rate',
      fields: [

        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'date_of_admission', label: 'DATE OF ADMISSION', type: 'date' },
        { key: 'date_of_insertion_of_central_line', label: 'Date of Insertion of Central Line (D1)', type: 'text' },
        { key: 'date_of_removal_of_central_line', label: 'Date of Removal of Central Line (D2)', type: 'text' },
        { key: 'central_line_days', label: 'Number of Central Line Days (D2-D1)', type: 'date' },
        { key: 'date_of_collection_of_central_tip', label: 'Date of Collection of Central Tip', type: 'text' },
        { key: 'sample_results', label: 'Sample Results', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }

      ]
    },

    {
      id: 16,
      indicator_no: 16,
      title: 'Surgical Site Infection Rate',
      fields: [

        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'surgical_procedure', label: 'Name of the Surgical Procedure Performed', type: 'date' },
        { key: 'date_of_surgery', label: 'Date of Surgery', type: 'text' },
        { key: 'date_of_infection_appearance', label: 'Date of appearance of symptoms of infection at Surgery site', type: 'text' },
        { key: 'date_and_type_of_sample_sent_to_lab', label: 'Date and Type of Sample send to Lab', type: 'date' },
        { key: 'results', label: 'Results', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }

      ]
    },

    {
      id: 17,
      indicator_no: 17,
      title: 'Percentage Of Cases who received appropriate Prophylactic Antibiotics within the Specified Time Frame',
      fields: [
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'date_of_surgery', label: 'Date of Surgery', type: 'text' },
        { key: 'surgical_procedure', label: 'Name of Surgical Procedure', type: 'text' },
        { key: 'prophylactic_antibiotic_given', label: 'Prophylactic Antibiotic Given within specified Time Frame', type: 'date' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }

      ]
    },

    {
      id: 18,
      indicator_no: 18,
      title: 'Percentage of Re-scheduling of Surgeries',
      fields: [
        { key: 'actual_date_and_time_of_surgery', label: 'Actual Date & Time of Surgery', type: 'date' },
        { key: 'patient_name', label: 'Patient Name', type: 'text' },
        { key: 'ip_id', label: 'IP ID', type: 'text' },
        { key: 'type_of_surgery', label: 'Type of Surgery', type: 'text' },
        { key: 'rescheduled_date_and_time', label: 'Rescheduled Date & Time', type: 'text' },
        { key: 'reason_for_rescheduling', label: 'Reason for Rescheduling ', type: 'date' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }

      ]
    },
    {
      id: 19,
      indicator_no: 19,
      title: 'Percentage of Usage of Blood and its Components and Turn Around Time for issue of Blood and Blood Components',
      fields: [
        { key: 'whole_blood', label: 'Whole Blood', type: 'text' },
        { key: 'blood_bank', label: 'Number of Blood Units prepared by the Blood Bank', type: 'text' },
        { key: 'blood_units', label: 'Number of Blood Units issued by the Blood Bank', type: 'text' },
        { key: 'utilized_units', label: 'Number of Blood Units utilized by the Blood Bank', type: 'text' },
        { key: 'requesting_department', label: 'Number of Blood Units issued in < 30 min of the receipt requisition slip from the Requesting department', type: 'text' },
      ]
    },

    {
      id: 20,
      indicator_no: 20,
      title: 'Nurse Patient Ratio in Ward/ICU',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'durningmorning', label: 'DURING MORNING TIME', type: 'text' },
        { key: 'duringevening', label: 'DURING EVENING TIME', type: 'text' },
        { key: 'utilized_units', label: 'Number of Blood Units utilized by the Blood Bank', type: 'text' },
        { key: 'nursing_staff_signature', label: 'NURSING STAFF SIGN.', type: 'text' },
      ]
    },
    {
      id: 21,
      indicator_no: 21,
      title: 'Waiting time for out-patient consultation',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'age_sex', label: 'AGE/SEX', type: 'text' },
        { key: 'address', label: 'ADDRESS', type: 'text' },
        { key: 'uhid_op_no', label: 'UHID/OP NO.', type: 'text' },
        { key: 'consultant_name', label: 'CONSULTANT NAME', type: 'text' },
        { key: 'time', label: 'TIME', type: 'time' },
        { key: 'waiting_time', label: 'PATIENT WAITING TIME T3=T2-T1', type: 'text' },
        { key: 'staff_signature', label: ' STAFF SIGN', type: 'text' },
      ]
    },
    {
      id: 22,
      indicator_no: 22,
      title: 'Waiting time for diagnostics',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'age_sex', label: 'AGE/SEX', type: 'text' },
        { key: 'uhid_op_no', label: 'UHID/OP NO.', type: 'text' },
        { key: 'test_names', label: 'TEST NAME(S)', type: 'text' },
        { key: 'results', label: 'RESULT(S)', type: 'time' },
        { key: 'sample_collection', label: 'SAMPLE COLLECTION TIME(T1)', type: 'text' },
        { key: 'report_delivery_time', label: 'REPORT DELIVERY TIME(T2)', type: 'text' },
        { key: 'turnaround', label: 'TURN AROUND TIME T3=T2-T1(MINS)', type: 'text' },
        { key: 'technician_sign', label: 'TECHNICIAN SIGNATURE', type: 'text' },
      ]
    },

    {
      id: 23,
      indicator_no: 23,
      title: 'Time Taken For Discharge',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'uhid_op_no', label: 'UHID/OP NO.', type: 'text' },
        { key: 'billing', label: 'TIME WHEN PATIENT WAS SENT FOR BILLING', type: 'text' },
        { key: 't1_t2', label: 'T1 T2 IN MIN', type: 'time' },
        { key: 'remarks', label: 'REMARKS', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' }
      ]
    },

    {
      id: 24,
      indicator_no: 24,
      title: 'Stock Out Rate of Emergency Medications',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'reason_for_stockout', label: 'REASON FOR STOCKOUT', type: 'text' },
        { key: 'action_taken', label: 'ACTION TAKEN', type: 'text' },
        { key: 'pharmacy_staff_signature', label: 'PHARMACY STAFF SIGN', type: 'time' },

      ]
    },

    {
      id: 25,
      indicator_no: 25,
      title: 'Incidents Of Needle Stick Injuries',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'department_name', label: 'Department Name', type: 'text' },
        { key: 'reason_for_injury', label: 'Reason for Acquiring the Injury', type: 'text' },
        { key: 'action_taken', label: 'Action Taken', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' },

      ]
    },

    {
      id: 26,
      indicator_no: 26,
      title: 'Compliance Rate to Medication Prescription in Capitals',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'hand_written_prescription', label: 'Hand written Prescription in Capital Letter', type: 'text' },
        { key: 'action_taken', label: 'Action Taken', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' },

      ]
    },

    {
      id: 27,
      indicator_no: 27,
      title: 'Percentage of Near Misses',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'patient_id', label: 'Patient ID', type: 'text' },
        { key: 'report', label: 'Near miss event Reported', type: 'text' },
        { key: 'corrective_preventive_actions', label: 'Corrective and Preventive action taken', type: 'text' },
        { key: 'signature', label: 'SIGNATURE', type: 'text' },

      ]
    },
    {
      id: 28,
      indicator_no: 28,
      title: 'Hand Hygiene Compliance Rate',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'no_of_staff_audited', label: 'NO.OF STAFF AUDITED', type: 'text' },
        { key: 'total_opportunity', label: 'TOTAL OPPOURTUNITY', type: 'text' },
        { key: 'missed_opportunity', label: 'MISSED OPPOURTUNITY', type: 'text' },
        { key: 'nurse_staff_audited', label: 'NURSE STAFF AUDITED', type: 'text' },
        { key: 'nurse_total_opportunity', label: 'NURSE TOTAL OPPOURTUNITY', type: 'text' },
        { key: 'nurse_missed_opportunity', label: 'NURSE MISSED OPPOURTUNITY', type: 'text' },

      ]
    },

    {
      id: 29,
      indicator_no: 29,
      title: 'Patient Fall Rate',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'patient_name', label: 'PATIENT NAME', type: 'text' },
        { key: 'number_of_patient_falls', label: 'NUMBER OF PATIENT FALLS', type: 'text' },
        { key: 'patient_days', label: 'PATIENT DAYS', type: 'text' },
        { key: 'nursing_staff_signature', label: 'NURSING STAFF SIGN', type: 'text' },

      ]
    },
    {
      id: 30,
      indicator_no: 30,
      title: 'Number of variations  observed in mock drills',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'emp_id', label: 'Emp.ID', type: 'text' },
        { key: 'mock_drill_date', label: 'Date Mock drill held', type: 'text' },
        { key: 'was_variations_noticed', label: 'Was variations noticed', type: 'text' },
        { key: 'no_of_variations', label: 'No of Variations', type: 'text' },
        { key: 'corrective_preventive_actions', label: 'Corrective and Preventive action', type: 'text' },
        { key: 'signature', label: 'SIGNATURE ', type: 'text' },
      ]
    },
    {
      id: 31,
      indicator_no: 31,
      title: 'Appropriate handovers during shift change (to be done separately for doctors and nurses) -( per patient per shift)',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },
        { key: 'Area', label: 'Area', type: 'text' },
        { key: 'emp_id', label: 'Emp.ID', type: 'text' },
        { key: 'Area', label: 'Area', type: 'text' },
        { key: 'handover_done', label: 'Handover actually done during shift change (nursing)', type: 'text' },
        { key: 'handover_done_doctors', label: 'Handover actually done during shift change (doctors)', type: 'text' },
        { key: 'corrective_preventive_actions', label: 'Corrective and Preventive action taken', type: 'text' },
        { key: 'signature', label: 'SIGNATURE ', type: 'text' },
      ]
    },

    {
      id: 32,
      indicator_no: 32,
      title: 'Medical Records Having Improper Consent Forms',
      fields: [
        { key: 'date', label: 'DATE', type: 'date' },

        { key: 'emp_id', label: 'Emp.ID', type: 'text' },
        { key: 'Area', label: 'Area', type: 'text' },
        { key: 'incomplete_improper_consent', label: 'Medical records having incomplete or improper consent', type: 'text' },
        { key: 'corrective_preventive_actions', label: 'Corrective and Preventive action', type: 'text' },
        { key: 'mrd_assistant_signature', label: 'MRD ASSISTANT SIGNATURE', type: 'text' },

      ]
    },
  ];

  ngOnInit(): void {
    // this.getEntries();
  }

  constructor(private server: OpServicesService) { }

  onIndicatorChange(): void {
    this.selectedIndicator = this.indicators.find(
      x => x.id == this.selectedIndicatorId
    ) || null;

    this.formData = {};
    this.entries = [];

    if (this.selectedIndicator) {
      this.getEntries();
    }
  }

  saveEntry(): void {
    if (!this.selectedIndicator) {
      alert('Please select indicator');
      return;
    }

    const payload = {
      indicator_id: this.selectedIndicator.id,
      entry_date: this.formData.date || null,
      patient_name: this.formData.patient_name || null,
      patient_id: this.formData.patient_id || this.formData.uhid_op_no || null,
      data: this.formData,
      created_by: localStorage.getItem('user_id')
    };
    this.server.saveKpiEntry(payload).subscribe((res: any) => {
      if (res.status === 200) {
        alert('Saved Successfully');
        this.clearForm();
        this.getEntries();
      }
    });
  }

  getEntries(): void {
    var data = {
      "indicator_id": this.selectedIndicatorId,
    }
    this.server.getKpiEntries(data).subscribe((res: any) => {

      this.entries = res.data || [];

    });

  }

  clearForm(): void {
    this.formData = {};
  }

  exportExcel(): void {
    var data = {
      "indicator_id": this.selectedIndicatorId,
    }
    this.server.exportKpiExcel(data).subscribe((blob: Blob) => {

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;

      a.download =
        'NABH_KPI_' +
        this.selectedIndicatorId +
        '.xlsx';

      a.click();

      window.URL.revokeObjectURL(url);

    });

  }
}


