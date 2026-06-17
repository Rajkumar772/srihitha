import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

import * as CryptoJS from 'crypto-js';
import { LoginService } from 'src/app/core/services/login.service';
@Injectable({
  providedIn: 'root'
})
export class AmbulancetrackerService {
  private baseUrl = environment.texturespaceURL;
  constructor(private http: HttpClient) { }
  // ✅ GET LIST


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
  private alertShown: boolean = false;
  private handleResponse(res: any) {
    if ((res.status === 401 || res.status === 403) && !this.alertShown) {
      this.alertShown = true;
      alert(res.msg);
      // this.loginservice.logout();
      return null; // Return null or handle as needed
    }
    return res;
  }

  getAmbulances(data) {
    return this.http.post(`${this.baseUrl}ambulance-list`,data);
  }

  adddetails(data: any) {
    return this.http.post<any>(this.baseUrl + `adddetails`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  vehicleregister(data: any) {
    return this.http.post<any>(this.baseUrl + `vehicleregister`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getAmbulancesregistervehicle() {
    return this.http.post<any>(this.baseUrl + `getvehicleregister`, []).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  uploaddocumentvehicleregisterspost(data: any) {
    return this.http.post<any>(this.baseUrl + `uploadoriginaldocumentvehicleregister`, data).pipe(map(res => {
      return res;
    }));
  }

  getdocumenetsreport(data: any) {
    return this.http.post<any>(this.baseUrl + `getdocumenetsreportvehicleregister`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getvehicledropdown() {
    return this.http.post<any>(this.baseUrl + `getvehiclesdropdown`,[]).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


}
