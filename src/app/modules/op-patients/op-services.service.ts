import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { LoginService } from 'src/app/core/services/login.service';
import Swal from 'sweetalert2';
// import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class OpServicesService {

  OPApi = environment.texturespaceURL; private alertShown: boolean = false;

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

  /////////////

  addpatient(data) {
    return this.http.post<any>(this.OPApi + `addpatient`, data).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }

  getpatients() {
    return this.http.post<any>(this.OPApi + `getpatients`, []).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }


  getAllPateintDtsfill() {
    return this.http.post<any>(this.OPApi + `getAllPateintDtsfill`, []).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }




  getDataAllpatients() {
    return this.http.post<any>(this.OPApi + `getDataAllpatients`, []).pipe(map((res) => {
      return res;
    },
      (error) => {
        return error;
      }));
  }


  EditPatient(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `EditPatient`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  checkCardRnwlforUho(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + "checkCardRnwlforUho", payload).pipe(
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

  //////////////////////////////////////////////////////////////////////////// DOCTORS

  getDoctorsData() {
    return this.http.post<any>(this.OPApi + "getDoctorsData", []).pipe(
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


  Add_doctor(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `Add_doctor`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  getdepartment() {
    return this.http.post<any>(this.OPApi + `getdepartment`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  gettimings() {
    return this.http.post<any>(this.OPApi + `gettimings`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  addNewdepartment(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `addNewdepartment`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  addNewtimings(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `addNewtimings`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  /////////////////////////op-patients-search filter
  getbookingsrchdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `getbookingsrchdata`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getbookingdata() {
    return this.http.post<any>(this.OPApi + `getbookingdata`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  getBackDatesOP() {
    return this.http.post<any>(this.OPApi + `getBackDatesOP`, []).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getPhonenumber() {
    return this.http.post<any>(this.OPApi + `getPhonenumber`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getappoinmentreportform() {
    return this.http.post<any>(this.OPApi + `getappoinmentreportform`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  //////////////////////// op-analysis/////////////////


  deletedoctor(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `deletedoctor`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  };

  Totalcounts() {
    return this.http.get<any>(this.OPApi + `totalcountsData`).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  };

  checkmobilenumber(data) {
    return this.http.post<any>(this.OPApi + `checkmobilenumber`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  //////////////////////////////////// op_old




  /////////////////// back date 

  addpatients(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `addpatient`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getoplastnumbers() {
    return this.http.get<any>(this.OPApi + `getoplastnumbers`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  ///priyanka

  getdoctorname() {
    return this.http.get<any>(this.OPApi + `getdoctorname`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addprocedurebilling(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `addprocedurebilling`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getoverallproceduredata() {
    return this.http.post<any>(this.OPApi + `getoverallproceduredata`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getproceduredetailsdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `getproceduredetailsdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  //////////////////30-04-2025 first form

  Add_proceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `Add_proceduretype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getproceduretype() {
    return this.http.get<any>(this.OPApi + `getproceduretype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editproceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `editproceduretype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deleteproceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + 'deleteproceduretype', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////////// second form

  Add_DerndAesproceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `Add_DerndAesproceduretype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getDerndAesproceduretype() {
    return this.http.get<any>(this.OPApi + `getDerndAesproceduretype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));

  }

  editprocedurecategorytype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `editprocedurecategorytype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deleteprocedurecategorytype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + 'deleteprocedurecategorytype', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  //////// third form

  Add_Sub_DerndAesproceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `Add_Sub_DerndAesproceduretype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getsubDerndAesproceduretype() {
    return this.http.get<any>(this.OPApi + `getsubDerndAesproceduretype`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editproceduresubcategorytype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `editproceduresubcategorytype`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  deletesubDerndAesproceduretype(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + 'deletesubDerndAesproceduretype', payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////

  gettypedata() {
    return this.http.get<any>(this.OPApi + `gettypedata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getproceduredata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `getproceduredata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gotprocceduredata() {
    return this.http.get<any>(this.OPApi + `gotprocceduredata`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gotsubproceduredata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `gotsubproceduredata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  gotsubcatgoryproceduredata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `gotsubcatgoryproceduredata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getproceduresrchdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `getproceduresrchdata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getlastvisitdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `getlastvisitdata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  Add_nabh(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `Add_nabh`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  getnabhdata() {
    return this.http.post<any>(this.OPApi + "getnabhdata", []).pipe(
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

  getkpis(data) {
    return this.http.post<any>(this.OPApi + "getkpis", data).pipe(
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
  addnewkpi(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.OPApi + `addnewkpi`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  getKpiIndicators() {
    
    return this.http.post(this.OPApi + `getKpiIndicators`, {}).pipe(
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

  saveKpiEntry(data: any) {
    return this.http.post(this.OPApi + `saveKpiEntry`, data).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        })
    );
  }

  getKpiEntries(data: any) {
    
    return this.http.post(this.OPApi + `getKpiEntries`, data).pipe(
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

  exportKpiExcel(data: any) {
    return this.http.post(this.OPApi + `exportKpiExcel`, data, { responseType: 'blob' }).pipe(
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
  getKpiFormulaAnalysis() {
    return this.http.get<any>(this.OPApi + `kpi-formula-analysis`);
  }
}
