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
export class HrmoduleserviceService {

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

  getSearchForMRDreports(data) {
    return this.http.post<any>(this.hrapi + `getSearchForMRDreports`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
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

  add_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.hrapi + `Add_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getroomtypedata() {
    return this.http.get<any>(this.hrapi + `getroomtype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addhremployee(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.hrapi + `addhremployee`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gethremployee() {
    return this.http.get<any>(this.hrapi + `gethremployee`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  leaveapprovalpost(data: any) {
    
    return this.http.post<any>(this.hrapi + `leaveapprovalpost`, data).pipe(map(res => {
      return res;
    }));
  }
  gethremployeeleaveapproval(data) {
    return this.http.post<any>(this.hrapi + `gethremployeeleaveapproval/`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  updateLeaveStatus(data) {
    return this.http.post<any>(this.hrapi + `updateLeaveStatus/`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getemployeelist() {
    return this.http.post<any>(this.hrapi + `getemployeelist`, []).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }
  addshiftemployee(data: any) {
 
    return this.http.post<any>(this.hrapi + `addshiftemployeepost`, data).pipe(map(res => {
      return res;
    }));
  }
  getshiftsdata(data) {
    return this.http.post<any>(this.hrapi + `getshiftsdata/`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  departmenttypeadd(data) {
    return this.http.post<any>(this.hrapi + `departmenttypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  submitdesignationdropdown(data) {
    return this.http.post<any>(this.hrapi + `designationtypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////get department dropdown starts
  getdepartmentdropdown() {
    return this.http.get<any>(this.hrapi + `getdepartmentdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  ///get designation dropdown starts
  getdesignationdropdown() {
    return this.http.get<any>(this.hrapi + `getdesignationdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  
  updateEmployeeStatus(data) {
    return this.http.post<any>(this.hrapi + `updateEmployeeStatus`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  uploaddocumentspost(data: any) {
    
    return this.http.post<any>(this.hrapi + `uploadoriginaldocumentspost`, data).pipe(map(res => {
      return res;
    }));
  }
    getdocumenetsreport(data:any) {
    return this.http.post<any>(this.hrapi + `getdocumenetsreport`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  hremployeeanalysis() {
    return this.http.get<any>(this.hrapi + `hremployeeanalysis`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   gethrdepartmentcardwisedata(data) {
    return this.http.post<any>(this.hrapi + `gethrdepartmentcardwisedata`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
     shifttimingsadd(data) {
       const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.hrapi + `shifttimingsadd`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getshifttimingsdropdown() {
    return this.http.get<any>(this.hrapi + `getshifttimingsdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  addnotifications(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.hrapi + `addnotifications`, payload).pipe(map((res) => {
     return this.handleResponse(res);
    }, error => {
     this.errorAlert();
     return error;
    }));
}
getnotifications() {
    return this.http.get<any>(this.hrapi + `getnotifications`).pipe(map(res => {
     return this.handleResponse(res);
    }, error => {
     this.errorAlert();
     return error;
    }));
}
}
