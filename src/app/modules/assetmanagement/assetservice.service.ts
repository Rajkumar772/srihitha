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
export class AssetserviceService {
  inpatientApi = environment.texturespaceURL; private alertShown: boolean = false;
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
    return this.http.post<any>(this.inpatientApi + `getSearchForMRDreports`, data).pipe(map((res) => {
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

  add_assettype(data: any) {
    return this.http.post<any>(this.inpatientApi + `add_assettype`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getassettype() {
    return this.http.get<any>(this.inpatientApi + `getassettype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  add_equipmenttype(data: any) {
    return this.http.post<any>(this.inpatientApi + `add_equipmenttypequantity`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getequipmentreport() {
    return this.http.get<any>(this.inpatientApi + `getequipmentreport`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getassethistory(data) {
    return this.http.post<any>(this.inpatientApi + `getassethistory`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////new code starts for equipment dropdown

  equipmenttypeadd(data) {
    return this.http.post<any>(this.inpatientApi + `equipmenttypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getequipmentdropdown() {
    return this.http.get<any>(this.inpatientApi + `getequipmentdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  add_assettypepostdata(data: any) {
    return this.http.post<any>(this.inpatientApi + `add_assettypepostdata`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

   getequipmentwisecompany(data) {
    return this.http.post<any>(this.inpatientApi + `getequipmentwisecompany`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getcompanywisemodel(data) {
    return this.http.post<any>(this.inpatientApi + `getcompanywisemodel`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   getmodelpatchdata(data) {
    return this.http.post<any>(this.inpatientApi + `getmodelpatchdata`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  //  updateQuantity(payload: any): Observable<any> {
  //   return this.http.post(this.apiUrl, payload);
  // }
  updateQuantity(data) {
    return this.http.post<any>(this.inpatientApi + `updatequantityasset`,data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   addmaintenancetypepostdata(data: any) {
    return this.http.post<any>(this.inpatientApi + `addmaintenancetypepostdata`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  updateEmployeeStatus(data) {
    return this.http.post<any>(this.inpatientApi + `updatemaintenancestatus`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  producttypeadd(data) {
    return this.http.post<any>(this.inpatientApi + `producttypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getproductdropdowndata() {
    return this.http.get<any>(this.inpatientApi + `getproductdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   getdepartmentdropdownasset() {
    return this.http.get<any>(this.inpatientApi + `getdepartmentdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  departmenttypeadd(data) {
    return this.http.post<any>(this.inpatientApi + `departmenttypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   submitlocationdropdown(data) {
    return this.http.post<any>(this.inpatientApi + `locationtypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
    getlocationdropdown() {
    return this.http.get<any>(this.inpatientApi + `getlocation`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  renweldatasubmit(data) {
    return this.http.post<any>(this.inpatientApi + `updaterenweldate`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

    getrenewaldates(data) {
    return this.http.post<any>(this.inpatientApi + `getrenewaldates`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

   movablecount() {
    return this.http.get<any>(this.inpatientApi + `movablecount`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


    gettypeofselecteddata(data) {
    return this.http.post<any>(this.inpatientApi + `getassetstock`,data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

getsuppliervendorname() {
    return this.http.post<any>(this.inpatientApi + `getsuppliervendorname`,[]).pipe(map(res => {
     return this.handleResponse(res);
    
    }, error => {
     this.errorAlert();
     return error;
    }));
}

}
