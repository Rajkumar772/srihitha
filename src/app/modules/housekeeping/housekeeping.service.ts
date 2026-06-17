import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/core/services/login.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class HousekeepingService {

  hrapi = environment.texturespaceURL; private alertShown: boolean = false;

  private secretKey = environment.secretKey;

  constructor(private http: HttpClient, private loginservice: LoginService) { }

  // Sucess And Error Alerts //

  private handleResponse(res: any) {
    if ((res.status === 401 || res.status === 403) && !this.alertShown) {
      this.alertShown = true;
      alert(res.msg);
      this.loginservice.logout();
      return null; // Return null or handle as needed
    }
    return res;
  }

  // Encrypt the payload using AES-256
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

  gethousekeeping() {
    return this.http.get<any>(this.hrapi + `gethousekeeping`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

   assignworktype(data: any) {
    // const encryptedPayload = this.encryptPayload(data);
    // const signature = this.signPayload(encryptedPayload);
    // const payload = { encryptedPayload, signature };
    
    return this.http.post<any>(this.hrapi + `assignwork`,data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

   viewhousekeepingreport(data) {
    return this.http.post<any>(this.hrapi + `viewhousekeepingreport`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

}
