import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/core/services/login.service';

var Api = environment.texturespaceURL;

@Injectable({
  providedIn: 'root'
})
export class LabsServicesService {

  private secretKey = environment.secretKey; private alertShown: boolean = false;

  constructor(private http: HttpClient, private loginservice: LoginService) {
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


  add_labtest(data) {

    return this.http.post<any>(Api + `add_labtest`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  get_labtest() {
    return this.http.post<any>(Api + `get_labtest`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  delete_labtest(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `delete_labtest`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editDtls(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `editlabDetails`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabtestFields(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabtestFields`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  Categorytype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `Categorytype`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getCategory() {
    return this.http.post<any>(Api + `getCategory`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  ///////////////////////////////////////// ADD LABS END

  ///////////////////////////// /////////////////////////////////////////////// assign labs start 

  getDataAllpatients() {
    return this.http.post<any>(Api + `getDataAllpatients`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  Addassign_medicaltests(data) {
    return this.http.post<any>(Api + `addassign_medicaltests`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////////////////////////////////////.//////////////////////////////////////////////// perform lab tests
  getlabreportsnum() {
    return this.http.post<any>(Api + `getlabreportsnum`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabtestnames(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabtestnames`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  postCall(data) {
    // const encryptedPayload = this.encryptPayload(data);
    // const signature = this.signPayload(encryptedPayload);
    // const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `postTestsDoneData`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getmedicalreports() {
    return this.http.post<any>(Api + `getmedicalreports`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getparticularlabdetials(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getparticularlabdetials`, payload).pipe(map(res => {
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
    return this.http.post<any>(Api + `getLabResultsEach`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////////////////////// ////////////////////////////////////////
  editlabdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `editlabdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));

  }

  mainGetforAssignLabs() {
    return this.http.post<any>(Api + `mainGetforAssignLabs`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabTests`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  //////////////////////////// lab search filter
  getlabreport() {
    return this.http.post<any>(Api + `getlabreport`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getlabsrchdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabsrchdata`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  ////////////////////////// labs-analysis///////////////////

  Totalcounts() {
    return this.http.get<any>(Api + `totalcountsData`).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  };


  getdailydata() {
    return this.http.get<any>(Api + `getdailydata`).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  };





  getCategorylist() {
    return this.http.get<any>(Api + `getCategorylist`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////////////// group tests
  addGroupCategoryTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + 'addGroupCategoryTests', payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  maingetCallforGroupTests() {
    return this.http.post<any>(Api + 'maingetCallforGroupTests', []).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  findandGetGroupCategoryTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + 'findandGetGroupCategoryTests', payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addDoctorGroupTests(data) {
    return this.http.post<any>(Api + 'addDoctorGroupTests', data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////////////////////////////////////////////////////////// ////////////// edit lab result 
  updateEachLabtestResultval(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `updateEachLabtestResultval`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  /////////////////////////////////////////////////////////////////// ////////////// from doctors 

  getdoctorsdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getdoctorsdatas`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));

  }

  getdata_assign_labs() {
    return this.http.post<any>(Api + `getdata_assign_labs`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  ///////////////// 

  addingNEWGroupCategoryTests(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `addingNEWGroupCategoryTests`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getSearchLabsData(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getSearchLabsData`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  deleteAssignedTest(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `deleteAssignedTest`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getdoctorname() {
    return this.http.get<any>(Api + `getdoctorname`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  //////////priyanka - add-lab-test-items - 01-04-2025

  // submitlabCategory(data) {
  //   return this.http.post<any>(Api + `submitlabCategory`, data).pipe(
  //     map(
  //       (res) => {
  //         return res;
  //       },
  //       (error) => {
  //         return error;
  //       }
  //     )
  //   );
  // }


  submitlabItms(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `submitlabItms`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabItmsdata() {
    return this.http.get<any>(Api + `getlabItmsdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  updtLabItemsdts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `updtLabItemsdts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  dltLabItemsdts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature }
    return this.http.post<any>(Api + `dltLabItemsdts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  //////////priyanka - lab-test-suppliers - 01-04-2025

  submitlabtestSupplier(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `submitlabtestSupplier`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabtestSupplierdata() {
    return this.http.get<any>(Api + `getlabtestSupplierdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  updtLabSpplrsdts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature }
    return this.http.post<any>(Api + `updtLabSpplrsdts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  dltLabSpplrsdts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `dltLabSpplrsdts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  /////////////

  checkLabpurchaseInvoiceNumber(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `checkLabpurchaseInvoiceNumber`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkInvofLabPurchseBillExists(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `checkInvofLabPurchseBillExists`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  submitLabpurchasedata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `submitLabpurchasedata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  LabpurchasenextItemCount() {
    return this.http.post<any>(Api + `LabpurchasenextItemCount`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ///////////////////27-05-25

  getlabpurchasereports(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabpurchasereports`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlabPurchaseReportsAll() {
    return this.http.post<any>(Api + `getlabPurchaseReportsAll`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getAllLabitemsofPurchase(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getAllLabitemsofPurchase`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getEachLabSupplierdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getEachLabSupplierdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ////////////////

  getlabtestdata(data) {
    // const encryptedPayload = this.encryptPayload(data);
    // const signature = this.signPayload(encryptedPayload);
    // const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getlabtestdata`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addKitformdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `addKitformdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getLabKit() {
    return this.http.post<any>(Api + `getLabKit`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getKitsreportsdata() {
    return this.http.post<any>(Api + `getKitsreportsdata`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  geteachkitdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `geteachkitdata`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getFewKitsAnlysis(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(Api + `getFewKitsAnlysis`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  
  
}

