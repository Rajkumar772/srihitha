import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
// import { VideoConsultationService } from '../services/video-consultation.service';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent  {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private videoSvc: InPatienrservicesService
  ) {}

  patientForm = this.fb.group({
    patientName: ['', Validators.required],
    mobile: ['', Validators.required],
    appointmentDate: ['', Validators.required],
    appointmentTime: ['', Validators.required]
  });

  joinCall() {
    if (this.patientForm.invalid) return;

    const f = this.patientForm.getRawValue();

    const roomId = `op-${f.appointmentDate}-${String(f.appointmentTime).replace(':', '')}`;

    const payload = {
      patientName: f.patientName,
      mobile: f.mobile,
      appointmentDate: f.appointmentDate,
      appointmentTime: f.appointmentTime,
      roomId,
      role: 'patient'
    };

    this.videoSvc.addVideoConsultation(payload).subscribe({
      next: () => {
        // ✅ IMPORTANT FIX: use module prefix
        this.router.navigateByUrl('/onlineconsultancy/videocall', {
          state: { roomId, role: 'patient' }
        });
      },
      error: () => alert('Failed to join consultation')
    });
  }

}
