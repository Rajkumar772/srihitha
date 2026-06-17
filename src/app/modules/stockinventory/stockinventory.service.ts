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
export class StockinventoryService {
  storeinventoryapi = environment.texturespaceURL; private alertShown: boolean = false;

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
    return this.http.post<any>(this.storeinventoryapi + `getSearchForMRDreports`, data).pipe(map((res) => {
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

  //   add_assettype(data: any) {
  //     return this.http.post<any>(this.storeinventoryapi + `add_assettype`, data).pipe(map((res) => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getassettype() {
  //     return this.http.get<any>(this.storeinventoryapi + `getassettype`).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //   add_equipmenttype(data: any) {
  //     return this.http.post<any>(this.storeinventoryapi + `add_equipmenttypequantity`, data).pipe(map((res) => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getequipmentreport() {
  //     return this.http.get<any>(this.storeinventoryapi + `getequipmentreport`).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getassethistory(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getassethistory`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }


  //   equipmenttypeadd(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `equipmenttypeadd`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getequipmentdropdown() {
  //     return this.http.get<any>(this.storeinventoryapi + `getequipmentdropdown`).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }


  //   add_assettypepostdata(data: any) {
  //     return this.http.post<any>(this.storeinventoryapi + `add_assettypepostdata`, data).pipe(map((res) => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //    getequipmentwisecompany(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getequipmentwisecompany`,data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getcompanywisemodel(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getcompanywisemodel`,data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //    getmodelpatchdata(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getmodelpatchdata`,data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //   updateQuantity(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `updatequantityasset`,data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //    addmaintenancetypepostdata(data: any) {
  //     return this.http.post<any>(this.storeinventoryapi + `addmaintenancetypepostdata`, data).pipe(map((res) => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //   updateEmployeeStatus(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `updatemaintenancestatus`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   producttypeadd(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `producttypeadd`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   getproductdropdowndata() {
  //     return this.http.get<any>(this.storeinventoryapi + `getproductdropdown`).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //    getdepartmentdropdownasset() {
  //     return this.http.get<any>(this.storeinventoryapi + `getdepartmentdropdown`).pipe(map(res => {
  //       return this.handleResponse(res);

  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //   departmenttypeadd(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `departmenttypeadd`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //    submitlocationdropdown(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `locationtypeadd`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }
  //     getlocationdropdown() {
  //     return this.http.get<any>(this.storeinventoryapi + `getlocation`).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //   renweldatasubmit(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `updaterenweldate`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //     getrenewaldates(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getrenewaldates`, data).pipe(map(res => {
  //       return this.handleResponse(res);
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  //    movablecount() {
  //     return this.http.get<any>(this.storeinventoryapi + `movablecount`).pipe(map(res => {
  //       return res;
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }


  //     gettypeofselecteddata(data) {
  //     return this.http.post<any>(this.storeinventoryapi + `getassetstock`,data).pipe(map(res => {
  //       return res;
  //     }, error => {
  //       this.errorAlert();
  //       return error;
  //     }));
  //   }

  // getsuppliervendorname() {
  //     return this.http.post<any>(this.storeinventoryapi + `getsuppliervendorname`,[]).pipe(map(res => {
  //      return this.handleResponse(res);
  //     }, error => {
  //      this.errorAlert();
  //      return error;
  //     }));
  // }
  /////new code starts for add item
  add_assettypestoreinventory(data: any) {
    return this.http.post<any>(this.storeinventoryapi + `add_assettypestoreinventory`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getassettypestoreinventory() {
    return this.http.get<any>(this.storeinventoryapi + `getassettypestoreinventory`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getequipmentdropdownstoreinventory() {
    return this.http.get<any>(this.storeinventoryapi + `getequipmentdropdownstoreinventory`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  equipmenttypeaddstoreinventory(data) {
    return this.http.post<any>(this.storeinventoryapi + `equipmenttypeaddstoreinventory`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  producttypeaddstoreinventory(data) {
    return this.http.post<any>(this.storeinventoryapi + `producttypeaddstoreinventory`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getproductdropdownstoreinventory() {
    return this.http.get<any>(this.storeinventoryapi + `getproductdropdownstoreinventory`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  updaterenweldatestoreinventory(data) {
    return this.http.post<any>(this.storeinventoryapi + `updaterenweldatestoreinventory`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getrenewaldates(data) {
    return this.http.post<any>(this.storeinventoryapi + `getrenewaldates`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getsuppliervendorname() {
    return this.http.post<any>(this.storeinventoryapi + `getsuppliervendornamestoreinventory`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  //////purchase store inventory code starts
  add_assettypepostdatapurchasestore(data: any) {
    return this.http.post<any>(this.storeinventoryapi + `add_assettypepostdatapurchasestore`, data).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getassettypepurchasestore() {
    return this.http.get<any>(this.storeinventoryapi + `getassettypepurchasestore`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getequipmentwisecompanypurchasestore(data) {
    return this.http.post<any>(this.storeinventoryapi + `getequipmentwisecompanypurchasestore`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getcompanywisemodelstorepurchase(data) {
    return this.http.post<any>(this.storeinventoryapi + `getcompanywisemodelstorepurchase`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getmodelpatchdatastorepurchase(data) {
    return this.http.post<any>(this.storeinventoryapi + `getmodelpatchdatastorepurchase`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }






  getdepartmentdropdownstorepurchase() {
    return this.http.get<any>(this.storeinventoryapi + `getdepartmentdropdownstorepurchase`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  departmenttypeadd(data) {
    return this.http.post<any>(this.storeinventoryapi + `departmenttypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  submitlocationdropdown(data) {
    return this.http.post<any>(this.storeinventoryapi + `locationtypeadd`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getlocationdropdown() {
    return this.http.get<any>(this.storeinventoryapi + `getlocation`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getproductdropdowndata() {
    return this.http.get<any>(this.storeinventoryapi + `getproductdropdownstoreinventory`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   getdepartmentdropdownasset() {
    return this.http.get<any>(this.storeinventoryapi + `getdepartmentdropdown`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  //////stock report
   getequipmentreport() {
    return this.http.get<any>(this.storeinventoryapi + `getequipmentreportstorestock`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   getassethistory(data) {
    return this.http.post<any>(this.storeinventoryapi + `getassethistorystoreinventory`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   movablecount() {
    return this.http.get<any>(this.storeinventoryapi + `movablecountstoreinventory`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
   gettypeofselecteddata(data) {
    return this.http.post<any>(this.storeinventoryapi + `getassetstockstoreinventory`,data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
}
