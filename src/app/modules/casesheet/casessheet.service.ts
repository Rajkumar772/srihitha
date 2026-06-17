// casessheet.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasessheetService {

  baseURL = environment.texturespaceURL;

  constructor(private http: HttpClient) { }

  // ===========================
  // IP PATIENTS
  // ===========================

  getIPPatients(): Observable<any> {
    return this.http.get(
      this.baseURL + 'getIPpatientdata'
    );
  }

  // ===========================
  // CASE SHEET SAVE
  // ===========================

  saveCaseSheet(data: any): Observable<any> {
    return this.http.post(
      this.baseURL + 'addCasesheet',
      data
    );
  }

  // ===========================
  // GET CASE SHEET BY UHID
  // ===========================



getPatientCasesheets(uhid: string, ipNo?: string): Observable<any> {
  const body: any = {
    uhid: uhid,
    uh_id: uhid,
    umr_no: uhid
  };

  if (ipNo) {
    body.ip_no = ipNo;
  }

  return this.http.post(
    this.baseURL + 'getPatientCasesheet',
    body
  );
}

  // ===========================
  // UPDATE CASE SHEET
  // ===========================

  updateCasesheet(id: number, data: any): Observable<any> {
    return this.http.put(
      this.baseURL + 'updateCasesheet/' + id,
      data
    );
  }

  // ===========================
  // DELETE CASE SHEET
  // ===========================

deleteCasesheet(id: number): Observable<any> {
  return this.http.post(this.baseURL + 'deleteCasesheet', { id });
}

  // ===========================
  // MEDICINES
  // ===========================

  getMedicines(data: any): Observable<any> {
    return this.http.post(
      this.baseURL + 'getAmedicineEveryBatchNosOT',
      data
    );
  }


  getMedicineNames(): Observable<any> {
  return this.http.get(
    this.baseURL + 'getmedicinename'
  );
}


getTodayIPAdmissions(): Observable<any> {
  return this.http.get(this.baseURL + 'todaycheckindata');
}
}