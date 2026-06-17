import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Injectable({ providedIn: 'root' })
export class GoogleMeetService {

  private base = `${environment.texturespaceURL}`;
  consultancyapi = environment.texturespaceURL;
  alertShown: boolean = false;
  constructor(private http: HttpClient) { }
  private handleResponse(res: any) {
    if ((res.status === 401 || res.status === 403) && !this.alertShown) {
      this.alertShown = true;
      alert(res.msg);
      return null; // Return null or handle as needed
    }
    return res;
  }

  sucessAlert(message) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500
    })
  }

  errorAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
      timer: 1500
    })
  }

  errorMessageAlert(message) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      timer: 1500
    })
  }


  getAuthUrl(doctorId: number) {
    const params = new HttpParams().set('doctor_id', doctorId);
    return this.http.get<{ url: string }>(`${this.base}auth-url`, { params });
  }

  createMeeting(payload: {
    doctor_id: number;
    patient_email?: string;
    title?: string;
    description?: string;
    startISO: string;
    endISO: string;
    number?: string;
    name?: string;
    gender?: string;
  }) {
    return this.http.post<any>(`${this.base}meetings`, payload);
  }

  listMeetings(doctorId: number, timeMin?: string, timeMax?: string) {
    let params = new HttpParams().set('doctor_id', doctorId);
    if (timeMin) params = params.set('timeMin', timeMin);
    if (timeMax) params = params.set('timeMax', timeMax);
    return this.http.get<{ items: any[] }>(`${this.base}meetings`, { params });
  }

  getconsultancyreport(data: any) {

    return this.http.post<any>(this.consultancyapi + `getteleconsultationreport`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  saveDoctorNote(payload: { id: number; doctor_note: string }) {
    return this.http.post<any>(`${this.base}/meeting-note`, payload);
  }


  updatePaymentSuccess(data: any) {
    return this.http.post(
      `${this.base}/payment/success`,
      data
    );
  }

  updatePaymentCancelled(data: any) {
    return this.http.post(
      `${this.base}/payment/cancel`,
      data
    );
  }


}
