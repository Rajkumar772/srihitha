import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs';

import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js';
import { LoginService } from 'src/app/core/services/login.service';
import Swal from 'sweetalert2';

var Api = environment.texturespaceURL;


@Injectable({
  providedIn: 'root'
})
export class DiagnosticServicesService {

  Api = environment.texturespaceURL; private alertShown: boolean = false;
  private secretKey = environment.secretKey;
  constructor(private http: HttpClient, private loginservice: LoginService) { }
  private handleResponse(res: any) {
    if ((res.status === 401 || res.status === 403) && !this.alertShown) {
      this.alertShown = true;
      alert(res.msg);
      this.loginservice.logout();
      return null; // Return null or handle as needed
    }
    return res;
  }

  encryptPayload(data: any): string {
    // Convert the data to a JSON string
    let plaintext = JSON.stringify(data);

    // Padding: Ensure the plaintext length is a multiple of 16 bytes
    const blockSize = 16;
    const paddingSize = blockSize - (plaintext.length % blockSize);
    plaintext += String.fromCharCode(paddingSize).repeat(paddingSize);

    // Use the same key as the backend
    const secretKey = CryptoJS.enc.Utf8.parse(this.secretKey); // Ensure key is 32 bytes

    // Encrypt using AES-256/ECB/No Padding
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.NoPadding, // No padding is explicitly specified
    });

    // Return the Base64-encoded ciphertext
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  signPayload(encryptedPayload: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(this.secretKey); // Same key as backend
    return CryptoJS.HmacSHA256(encryptedPayload, secretKey).toString(CryptoJS.enc.Hex);
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
  adddiagnoTest(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `adddiagnoTest`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }


  getdiagnosticTests() {
    return this.http.post<any>(Api + `getdiagnosticTests`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  editdiagnoTest(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `editdiagnoTest`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  dltdiagnoTest(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `dltdiagnoTest`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  /////////////////////////////////////////////////////////////////////////
  getDataAllpatients() {
    return this.http.post<any>(Api + `getDataAllpatients`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }



  addpatientDetailsTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `addpatientDetailsTests`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  getpatientsDetailsTests() {
    return this.http.post<any>(Api + `getpatientsDetailsTests`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }
  getxraydata() {
    return this.http.post<any>(Api + `getxraydata`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }
  getSearchxrayData(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getSearchxrayData`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }
  getpatientDiagnosticTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getpatientDiagnosticTests`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }






  /////////////////////////// 2024 june 18 

  // Assign diagnostic tests from doctor


  get_tests_from_doctor() {
    return this.http.post<any>(Api + `get_tests_from_doctor`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  get_diagnostic_doctor_test(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `get_diagnostic_doctor_test`, payload).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }



  xraysubmit(data) {
    return this.http.post<any>(Api + `xraysubmit`, data).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  }

  
}
