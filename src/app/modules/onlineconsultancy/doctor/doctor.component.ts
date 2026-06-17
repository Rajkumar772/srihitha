// import { Component, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
// import { VideoConsultationService } from '../services/video-consultation.service';
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent   {
constructor(
    private fb: FormBuilder,
    private router: Router,
    private videoSvc: InPatienrservicesService
  ) {}

  doctorForm = this.fb.group({
    doctorName: ['', Validators.required],
    department: ['', Validators.required],
    appointmentDate: ['', Validators.required],
    appointmentTime: ['', Validators.required]
  });

  startConsultation() {
    if (this.doctorForm.invalid) return;

    const f = this.doctorForm.getRawValue();

    const roomId = `op-${f.appointmentDate}-${String(f.appointmentTime).replace(':', '')}`;

    const payload = {
      doctorName: f.doctorName,
      department: f.department,
      appointmentDate: f.appointmentDate,
      appointmentTime: f.appointmentTime,
      roomId,
      role: 'doctor'
    };

    this.videoSvc.addVideoConsultation(payload).subscribe({
      next: () => {
        // ✅ IMPORTANT FIX: use module prefix
        this.router.navigateByUrl('/onlineconsultancy/videocall', {
          state: { roomId, role: 'doctor' }
        });
      },
      error: () => alert('Failed to start consultation')
    });
  }


}
