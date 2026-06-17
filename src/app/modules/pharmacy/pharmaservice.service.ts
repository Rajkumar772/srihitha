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
export class PharmaserviceService {

  pharmaapi = environment.texturespaceURL; private alertShown: boolean = false;

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




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////// add pharmacy Items 4 


  pharmaitemsadd(expandData) {
    const encryptedPayload = this.encryptPayload(expandData);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `pharmaitemsadd`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getmedicinename() {
    return this.http.get<any>(this.pharmaapi + `getmedicinename`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  editAmedicineProduct(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `editAmedicineProduct`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  dltAmedicineProduct(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `dltAmedicineProduct`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  ////////////    add pharmacy items  4 end 


  ////////////    add pharmacy suppliers 4 

  supplieradddata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `supplieradddata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  getsupplierdata() {
    return this.http.get<any>(this.pharmaapi + `getsupplierdata`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  updtSpplrsDts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `updtSpplrsDts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  dlteSupplrdts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `dlteSupplrdts`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  ////////////    add pharmacy suppliers end

  //////////// ////////   add pharmacy purchase 2

  submitpurchasedata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `submitpurchasedata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addNewmedicineType(data) {
    return this.http.post<any>(this.pharmaapi + `addNewmedicineType`, data).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  //////////// ////////   add pharmacy purchase end 

  //////////// ////////  ///////////////// add pharmacy purchase  reports   2

  getPurchaseReportsAll() {
    return this.http.post<any>(this.pharmaapi + `getPurchaseReportsAll`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getAllitemsofPurchase(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getAllitemsofPurchase`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  //////////// ////////  //////add pharmacy purchase  reports  end


  //////////// ////////  ///////////////// ////////////////add pharmacy sales  4

  getpatientsOnlyphcy() {
    return this.http.post<any>(this.pharmaapi + `getpatientsOnlyphcy`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getAmedicineAllBatchNos(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getAmedicineAllBatchNos`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  getThatMedicineDataByBatchwise(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getThatMedicineDataByBatchwise`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  submitpatientmedicine(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `submitpatientmedicine`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  //////////// ////////  ///////////////// add pharmacy sales  end

  //////////// ////////  ///////////////////////////////////////// add pharmacy sales reports   2
  getsaleitems() {
    return this.http.post<any>(this.pharmaapi + `getpatientsaleitems`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  getparticularsalesdetials(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getparticularsalesdetials`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  //////////// ////////  ///////////////// add pharmacy sales reports  end
  //////////// ////////  ///////////////////////////////////////// add pharmacy sales tracking   1

  getsalereportsdata() {
    return this.http.post<any>(this.pharmaapi + `getsalereportsdata`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  /// phani 

  gettEachMedicineSaleData(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `gettEachMedicineSaleData`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));

  }


  /////////////////////// pharmacy search filter
  getpharmacyreports(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getpharmacyreports`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  getsalereports(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };

    return this.http.post<any>(this.pharmaapi + `getsalereports`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  Totalcounts() {
    return this.http.get<any>(this.pharmaapi + `totalcountsData`).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  };





  ///////////////////// from doctors 

  getdata_assign_tablets() {
    return this.http.post<any>(this.pharmaapi + `getdata_assign_tablets`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }


  updateTabsofAmedicine(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `updateTabsofAmedicine`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  updateSaleBillpharma(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `updateSaleBillpharma`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  /////////////////////////////// Pharma Manufacturers

  addpharmaManfactures(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `addpharmaManfactures`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getpharmaManfacturers() {
    return this.http.post<any>(this.pharmaapi + `getpharmaManfacturers`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  editManfacturersDts(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `editManfacturersDts`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  dltmanufacturer(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `dltManfacturersDts`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getEachSupplierdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getEachSupplierdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getFewMedicineAnlysis(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };

    return this.http.post<any>(this.pharmaapi + `getFewMedicineAnlysis`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getSaleMedicineitemsonly() {
    return this.http.post<any>(this.pharmaapi + `getSaleMedicineitemsonly`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getSelctMedcneNfetchPtntdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getSelctMedcneNfetchPtntdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getApatientAllSalebillsdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getApatientAllSalebillsdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  ////////////// categorys 


  addPharmaCategory(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `addPharmaCategory`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getPharmaCategory() {
    return this.http.post<any>(this.pharmaapi + `getPharmaCategory`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  sendPSalereturnOTP(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `sendSaleReturnOtp`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  submitPharmOtp(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `submitPharmOtp`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  purchasenextItemCount() {
    return this.http.post<any>(this.pharmaapi + `getNextpurchaseitemCount`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }





  submitPtntdstsalebill(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `submitPtntdstsalebill`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  OTreturnsEverydaytotalDeduction(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `OTreturnsEverydaytotalDeduction`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  FullSaleBillsDetails() {
    return this.http.post<any>(this.pharmaapi + `FullSaleBillsDetails`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  changeCurrentMonthbillsDisc(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `changeCurrentMonthbillsDisc`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getMonthlySalesData() {
    return this.http.get<any>(this.pharmaapi + `getMonthlySalesData`).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getCreditBilsHistory() {
    return this.http.post<any>(this.pharmaapi + `getCreditBilsHistory`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getDatesofCreditHistorys(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getDatesofCreditHistorys`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  BackToOrgnlDiscPercnt(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `BackToOrgnlDiscPercnt`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  setMedicineAsCurrent(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `setMedicineAsCurrent`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getAmedicineEveryBatchNosOT(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getAmedicineEveryBatchNosOT`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  GettopThreeSuppliers() {
    return this.http.post<any>(this.pharmaapi + `topThreeSuppliers`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkInvofPurchseBillExists(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `checkInvofPurchseBillExists`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getOverallStock() {
    return this.http.post<any>(this.pharmaapi + `getOverallStock`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  checkInvoiceNumber(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `checkInvoiceNumber`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getMedicinesWithPurchaseDetails() {
    return this.http.post<any>(this.pharmaapi + `getMedicinesWithPurchaseDetails`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////////////////////////


  getPurchaseMedicineitemsonly() {
    return this.http.post<any>(this.pharmaapi + `getPurchaseMedicineitemsonly`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }




  getPurchsMedcneNfetchPtntdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getPurchsMedcneNfetchPtntdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }




  getAsupplrAllPurchsbillsdata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getAsupplrAllPurchsbillsdata`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getScheduleProductsItems() {
    return this.http.post<any>(this.pharmaapi + `getScheduleProductsItems`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  searchScheduleSaleItems(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `searchScheduleSaleItems`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  updatePrintCountForSale(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `updatePrintCountForSale`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }





  getPrintCountForSale(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getPrintCountForSale`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  /////////////////////// new


  submtPrchsRetrnBack(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `submtPrchsRetrnBack`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getPurchaseRetnsBills() {
    return this.http.post<any>(this.pharmaapi + `getPurchaseRetnsBills`, []).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getPurchaseRtrnLists(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getPurchaseRtrnLists`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addNewEntry(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `addNewEntry`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  getentrydata() {
    return this.http.post<any>(this.pharmaapi + `getentrydata`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  deletentrydata(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `deletentrydata`, payload).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  getdoctorname() {
    return this.http.get<any>(this.pharmaapi + `getdoctorname`).pipe(map((res) => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  updatePaymentStatus(data) {
    return this.http.post<any>(this.pharmaapi + `updatePaymentStatus`, data).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  gotsupplierPurchaseReports() {
    return this.http.post<any>(this.pharmaapi + `gotsupplierPurchaseReports`, []).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  supplierdatafilter(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `supplierdatafilter`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }

  supplierBydatefilter(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `supplierBydatefilter`, payload).pipe(
      map(
        (res) => {
          return this.handleResponse(res);
        }, error => {
          this.errorAlert();
          return error;
        }));
  }
  getDoctorVsitPtntList() {
    return this.http.post<any>(this.pharmaapi + `getDoctorVsitPtntList`, []).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getmedicalFields(data) {
    return this.http.post<any>(this.pharmaapi + `getmedicalFields`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getLabfields(data) {
    return this.http.post<any>(this.pharmaapi + `getLabfields`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  checkWhetherLabTestassigned(data) {
    return this.http.post<any>(this.pharmaapi + `checkWhetherLabTestassigned`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getdiagnosticTests() {
    return this.http.post<any>(this.pharmaapi + `getdiagnosticTests`, []).pipe(
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
  getDiagnostic(data) {
    return this.http.post<any>(this.pharmaapi + `getDiagnostic`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getdoctorsrchdata(data) {
    return this.http.post<any>(this.pharmaapi + `getdoctorsrchdata`, data).pipe(
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
  getAllHistoryOfPtnDctr(data) {
    return this.http.post<any>(this.pharmaapi + `getAllHistoryOfPtnDctr`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getDoctordetails() {
    return this.http.post<any>(this.pharmaapi + "getDoctordetails", []).pipe(
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

  getLabResultsEach(data) {
    const encryptedPayload = this.encryptPayload(data);
    const signature = this.signPayload(encryptedPayload);
    const payload = { encryptedPayload, signature };
    return this.http.post<any>(this.pharmaapi + `getLabResultsEach`, payload).pipe(map(res => {
      return this.handleResponse(res);
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
}


