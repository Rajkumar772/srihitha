import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AccountsreportsallService {
  dashboard = environment.texturespaceURL;
  constructor(private http: HttpClient) {
  }
  statusChangeAlert(message) {
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
  ///////////////////////////////////////////////////////////////////////////////////// ||END|| \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


  maintotal() {
    return this.http.get<any>(this.dashboard + `maintotal`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  maintotalres() {
    return this.http.get<any>(this.dashboard + `maintotalres`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  patientscount() {
    return this.http.get<any>(this.dashboard + `patientscount`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  todayscount() {
    return this.http.get<any>(this.dashboard + `todayscount`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  selectedtodayallcountreport(data) {
    return this.http.post<any>(this.dashboard + `selectedtodayallcountreport`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  opoverallcount(data) {
    return this.http.post<any>(this.dashboard + `selectedopoverallcount`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getDeptChart(dept: string, view: string) {
    return this.http.get<any>(`${this.dashboard}analysis/chart`, {
      params: { dept, view }
    });
  }


  ipLosDashboard() {
    return this.http.get(this.dashboard + 'ipLosDashboard');
  }


  getLosPatients() {
    return this.http.get(this.dashboard + 'getLosPatients');
  }

  getPatientRevenue(uhid: any) {
    return this.http.get(
      this.dashboard + 'getPatientRevenue/' + uhid
    );
  }


  hospitalOpsDashboard() {
    return this.http.get<any>(this.dashboard + 'hospitalOpsDashboard');
  }

  hospitalOpsReport(type: string) {
    return this.http.post<any>(this.dashboard + 'hospitalOpsReport', { type });
  }

  getPatientAllBills(data: any) {
    return this.http.post<any>(
      this.dashboard + 'getPatientAllBills',
      data
    );
  }


  getPatientBillDetails(data: any) {
    return this.http.post<any>(
      this.dashboard + 'getPatientBillDetails',
      data
    );
  }
}
