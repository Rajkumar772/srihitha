import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasesheetRoutingModule } from './casesheet-routing.module';
import { PatientCasesheetComponent } from './patient-casesheet/patient-casesheet.component';
import { LiveEntryComponent } from './live-entry/live-entry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PrimaryConsultantComponent } from './primary-consultant/primary-consultant.component';
import { NurseAssessmentComponent } from './nurse-assessment/nurse-assessment.component';
import { FallPainAssessmentComponent } from './fall-pain-assessment/fall-pain-assessment.component';
import { NursingAssessmentCareComponent } from './nursing-assessment-care/nursing-assessment-care.component';
import { NutritionDietaryComponent } from './nutrition-dietary/nutrition-dietary.component';
import { ChartsInvestigationHandoffComponent } from './charts-investigation-handoff/charts-investigation-handoff.component';
import { DischargeComponent } from './discharge/discharge.component';
import { NursingCommunicationComponent } from './nursing-communication/nursing-communication.component';
import { RiskAssessmentComponent } from './risk-assessment/risk-assessment.component';

@NgModule({
  declarations: [
    PatientCasesheetComponent,
    LiveEntryComponent,
    PrimaryConsultantComponent,
    NurseAssessmentComponent,
    FallPainAssessmentComponent,
    NursingAssessmentCareComponent,
    NutritionDietaryComponent,
    ChartsInvestigationHandoffComponent,
    DischargeComponent,
    NursingCommunicationComponent,
    RiskAssessmentComponent,
  ],
  imports: [
    CommonModule,
    CasesheetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
  ]
})
export class CasesheetModule { }
