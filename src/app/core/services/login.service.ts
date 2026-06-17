import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginModel } from '../model/login.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';


var LoginApi = environment.texturespaceURL;

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private secretKey = environment.secretKey;
  private currentUserSubject: BehaviorSubject<LoginModel>;   // current subject by default
  public currentUser: Observable<LoginModel>;        // Emmiting value when changes occures
  loginData: LoginModel;                    // Login Model Data

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<LoginModel>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): LoginModel {
    return this.currentUserSubject.value;
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

  decryptPayload(encryptedData: string): any {
    try {
      const secretKey = CryptoJS.enc.Utf8.parse(this.secretKey);
      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding,
      });

      let decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {

        return null;
      }

      // Remove padding manually
      const paddingSize = decrypted.charCodeAt(decrypted.length - 1);
      if (paddingSize < 1 || paddingSize > 16) {

      } else {
        decrypted = decrypted.slice(0, -paddingSize);
      }
      // Validate JSON parsing
      try {
        return JSON.parse(decrypted);
      } catch (jsonError) {

        return null;
      }
    } catch (error) {

      return null;
    }
  }

  signPayload(encryptedPayload: string): string {
    const secretKey = CryptoJS.enc.Utf8.parse(this.secretKey); // Same key as backend
    return CryptoJS.HmacSHA256(encryptedPayload, secretKey).toString(CryptoJS.enc.Hex);
  }

  // Get Otp for user dashboard //
  getdashotp(phone: any) {
    const encryptedPayload = this.encryptPayload(phone);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(LoginApi + 'getdashotp', payload)
  }

  // Login method for submitting login form data value


  login(signInData: any) {
    const encryptedPayload = this.encryptPayload(signInData);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };


    return this.http.post<any>(LoginApi + 'getuserdata', payload)
      .pipe(
        tap(response => ("")),
        map(user => {


          // Signature + Encrypted Response Handling
          if (user.encryptedData && user.signature) {
            const calculatedSignature = this.signPayload(user.encryptedData);
            if (calculatedSignature !== user.signature) {
              this.errorMessageAlert('❌ Response Signature Mismatch');
              return [];
            }

            const DecryptedData = this.decryptPayload(user.encryptedData);

            if (!DecryptedData.data || !DecryptedData.data.length) {
              this.errorMessageAlert("You don’t have any permissions. Please contact Admin.");
              return [];
            }
            this.loginData = DecryptedData.data;
            sessionStorage.setItem('Module_id', '0');

            if (signInData.rememberme) {
              // Store in localStorage if remember me is true
              localStorage.setItem('currentUser', JSON.stringify(this.loginData));
              localStorage.setItem('user_id', DecryptedData.usr_data[0].id);
              localStorage.setItem('name', DecryptedData.usr_data[0].name);
              localStorage.setItem('number', DecryptedData.usr_data[0].number);
              localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            } else {
              // Store in sessionStorage if remember me is false
              sessionStorage.setItem('currentUser', JSON.stringify(this.loginData));
              sessionStorage.setItem('user_id', DecryptedData.usr_data[0].id);
              localStorage.setItem('name', DecryptedData.usr_data[0].name);
              localStorage.setItem('number', DecryptedData.usr_data[0].number);
              localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            }
            const currentTime = new Date().getTime();
            localStorage.setItem('cts', currentTime.toString());
            localStorage.setItem('user_id', DecryptedData.usr_data[0].id);
            localStorage.setItem('usr_nm', DecryptedData.usr_data[0].name);
            localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            localStorage.setItem('acstkn', DecryptedData.acstkn);
            // Updating the current user subject to notify other parts of the app
            this.currentUserSubject.next(this.loginData);
            return this.loginData;
          }

          // Handle failure responses
          if (user.status === 202) {
            this.errorMessageAlert(user.message || 'Please Enter Valid Password');
            return [];
          }

          if (user.status && user.status !== 200) {
            this.errorMessageAlert(user.message || 'An unknown error occurred.');
            return [];
          }

          this.errorMessageAlert('An unknown error occurred. Please try again.');
          return [];
        }),
        catchError(error => {
          if (error.status === 400) {
            this.errorMessageAlert(error.error?.message || 'Invalid request. Please try again.');
          } else if (error.status === 202) {
            this.errorMessageAlert('Invalid Username or Password');
          } else if (error.status === 429) {
            this.errorMessageAlert(error.error?.message || 'Too many attempts. Please try again later.');
          } else if (error.status === 500) {
            this.errorMessageAlert('Server Error! Please try again later.');
          } else {
            this.errorMessageAlert('An unknown error occurred.');
          }
          return of(null);
        })
      );
  }

  userlogindata(cts, user_id) {
    var data = {
      cts: cts,
      user_id: user_id
    }
    this.http.post<any>(LoginApi + 'userlogindatastore', data).subscribe(repo => {

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


  logout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login/login']);

  }

  login1(signInData: LoginModel) {
    const encryptedPayload = this.encryptPayload(signInData);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };

    return this.http.post<any>(LoginApi + 'getUserDatapass', payload)
      .pipe(tap(response => ("")), // Debug response
        map(user => {
          // Signature + Encrypted Response Handling
          if (user.encryptedData && user.signature) {
            const calculatedSignature = this.signPayload(user.encryptedData);
            if (calculatedSignature !== user.signature) {
              this.errorMessageAlert('❌ Response Signature Mismatch');
              return [];
            }
            const DecryptedData = this.decryptPayload(user.encryptedData);
            if (!DecryptedData.data || !DecryptedData.data.length) {
              this.errorMessageAlert("You don’t have any permissions. Please contact Admin.");
              return [];
            }
            // Set user data and permissions
            this.loginData = DecryptedData.data;
            sessionStorage.setItem('Module_id', '0');
            if (signInData.rememberme) {
              localStorage.setItem('currentUser', JSON.stringify(this.loginData));
              localStorage.setItem('user_id', DecryptedData.usr_data[0].id);
              localStorage.setItem('usr_nm', DecryptedData.usr_data[0].name);
              localStorage.setItem('number', DecryptedData.usr_data[0].number);
              localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            } else {
              sessionStorage.setItem('currentUser', JSON.stringify(this.loginData));
              sessionStorage.setItem('user_id', DecryptedData.usr_data[0].id);
              localStorage.setItem('usr_nm', DecryptedData.usr_data[0].name);
              localStorage.setItem('number', DecryptedData.usr_data[0].number);
              localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            }
            const currentTime = new Date().getTime();
            localStorage.setItem('cts', currentTime.toString());
            localStorage.setItem('user_id', DecryptedData.usr_data[0].id);
            localStorage.setItem('usr_nm', DecryptedData.usr_data[0].name);
            localStorage.setItem('number', DecryptedData.usr_data[0].number);
            localStorage.setItem('user_role', DecryptedData.usr_data[0].user_role);
            localStorage.setItem('acstkn', DecryptedData.acstkn);
            this.currentUserSubject.next(this.loginData);
            return this.loginData;
          }

          if (user.status) {
            this.errorMessageAlert(user.message || 'An unknown error occurred.');
            return [];
          }
          this.errorMessageAlert('An unknown error occurred. Please try again.');
          return [];
        }),
        catchError(error => {
          if (error.status === 400) {
            this.errorMessageAlert(error.error?.message || 'Invalid request. Please try again.');
          } else if (error.status === 202) {
            this.errorMessageAlert('Invalid Username or Password');
          } else if (error.status === 429) {
            this.errorMessageAlert(error.error?.message || 'Too many attempts. Please try again later.');
          } else if (error.status === 500) {
            this.errorMessageAlert('Server Error! Please try again later.');
          } else {
            this.errorMessageAlert('An unknown error occurred.');
          }
          return of(null);
        })
      );
  }


}
