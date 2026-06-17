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
export class InPatienrservicesService {

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

  add_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `Add_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getroomtypedata() {
    return this.http.get<any>(this.inpatientApi + `getroomtype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editaddroomtype(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `updateroomtype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deleteroomtype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + 'deleteroomtype', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addroomtype(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `Add_rooms`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getroomsdata() {
    return this.http.get<any>(this.inpatientApi + `getrooms`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editrooms(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `editrooms`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deleterooms(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + 'deleterooms', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  Add_insurance(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `Add_insurance`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getInsurance() {
    return this.http.post<any>(this.inpatientApi + `getInsurance`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  editinsurance(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `editinsurance`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deleteinsurance(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + 'deleteinsurance', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gethospitalrooms(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `gethospitalrooms`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getpatients() {
    return this.http.get<any>(this.inpatientApi + `getpatientsdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  admitpatient_room(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `admitpatient_room`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkoutpatient_room(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `checkoutpatient_room`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkoutpatientsubmit(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `checkoutpatientsubmit`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  availableroomtype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `availableroomtype`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkinreports(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `checkinreports`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkoutreports(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `checkoutreports`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  todaycheckindata() {
    return this.http.get<any>(this.inpatientApi + `todaycheckindata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  todaycheckoutdata() {
    return this.http.get<any>(this.inpatientApi + `todaycheckoutdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ///////////////////////////////Ip-Analysis////////////////////

  Totalcounts() {
    return this.http.get<any>(this.inpatientApi + `totalcountsData`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  };




  deletedoctor() {
    return this.http.get<any>(this.inpatientApi + `deletedoctor`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }





  getmedicinename() {
    return this.http.get<any>(this.inpatientApi + `getmedicinename`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////// patient - management 




  addIPnewCaseSheetforpatient(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `addIPnewCaseSheetforpatient`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



























  //// mrd update 



  ////////////////////// 

  saveDischargeSumamry(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `saveDischargeSumamry`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getDischargeSumdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getDischargeSumdata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  saveIPpatientFinallBill(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `saveIPpatientFinallBill`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getIPpatientFinallBilldata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getIPpatientFinallBilldata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  saveIpfinalBillInsurnceMod(data) {

    return this.http.post<any>(this.inpatientApi + `saveIpfinalBillInsurnceMod`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getIpfianlbillInsurcnemode(data) {
    return this.http.post<any>(this.inpatientApi + `getIPpatientFinallBillInsurnceMod`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getCountsForRooms() {
    return this.http.post<any>(this.inpatientApi + `getCountsForRooms`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gettingLabTestDtsToPatntMngnt(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `gettingLabTestDtsToPatntMngnt`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  ////26-03-2025
  ////op-final-bill

  saveopfinalpatntBill(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `saveopfinalpatntBill`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getopfinalpatntBilldata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getopfinalpatntBilldata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  //final-bill

  getfinalbillData(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getfinalbillData`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  finalbilldatas() {
    return this.http.get<any>(this.inpatientApi + `finalbilldatas`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addfinalbilling(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `addfinalbillingof`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getAllPateintDtsfill() {
    return this.http.post<any>(this.inpatientApi + `getAllPateintDtsfill`, []).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getdoctorname() {
    return this.http.get<any>(this.inpatientApi + `getdoctorname`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////////////

  getpatientsAdmitreports() {
    return this.http.post<any>(this.inpatientApi + `getpatientsAdmitreports`, []).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getPatientSearchData(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getPatientSearchData`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  availableroomsdata() {
    return this.http.get<any>(this.inpatientApi + `availableroomsdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  availableroomsdatass(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `availableroomsdatass`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  roomchnagesdatass(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `roomchnagesdatass`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }





  postlicense(data: any) {
    return this.http.post<any>(this.inpatientApi + `postlicensedata`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getlicensetracking() {
    return this.http.get<any>(this.inpatientApi + `getlicensetracking`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  Categorytypefloor(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `Categorytypefloor`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getCategoryfloor() {
    return this.http.post<any>(this.inpatientApi + `getCategoryfloor`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  getconsultant_type(data) {
    return this.http.post<any>(this.inpatientApi + `getconsultant_type`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getappointmentamount_type(data) {
    return this.http.post<any>(this.inpatientApi + `getappointmentamount_type`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getcard_type() {
    return this.http.get<any>(this.inpatientApi + `getcard_type`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  updateconsultant_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `updateconsultant_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getconsultant_typetable() {
    return this.http.get<any>(this.inpatientApi + `getconsultant_tabletype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  consultant_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `consultant_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  updatecard_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `updatecard_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  addcard_type(data: any) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `addcard_type`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  emergenctcontactlistpost(data: any) {
    return this.http.post<any>(this.inpatientApi + `emergenctcontactlistpost`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  emergenctcontactlistget() {
    return this.http.get<any>(this.inpatientApi + `emergenctcontactlistget`).pipe(map((res) => {
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
    return this.http.post<any>(this.inpatientApi + `addnotifications`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getnotifications() {
    return this.http.get<any>(this.inpatientApi + `getnotifications`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getdischargesummary() {
    return this.http.get<any>(this.inpatientApi + `getdischargedata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  dischargesummarypost(data: any) {
    // const encryptedPayload = this.encryptPayload(data);
    // const signature = this.signPayload(encryptedPayload);
    // const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `dischargesummarypost`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getdischargesummaryreport() {
    return this.http.post<any>(this.inpatientApi + `getdischargesummaryreport`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getuhidwisedata(data) {
    return this.http.post<any>(this.inpatientApi + `getuhidwisedata`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////view report code starts
  getparticularlabdetials(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getparticularlabdetials`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getLabResultsEach(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.inpatientApi + `getLabResultsEach`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

}

