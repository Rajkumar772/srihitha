import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
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

  getweekdatawise() {
    return this.http.get<any>(this.dashboard + `getweekdatawise`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
  Totalcounts() {
    return this.http.get<any>(this.dashboard + `totalcountsData`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }
 

  topfivecustomers() {
    return this.http.get<any>(this.dashboard + `topfivecustomersData`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  monthlyCustomers() {
    return this.http.get<any>(this.dashboard + `monthlyCustomers`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  
  gettotalanalysis() {
    return this.http.get<any>(this.dashboard + `gettotalanalysis`);
  }

  ////////////////////////////// analaysis 

  getRoomsOccupancy() {
    var data = {
      company_id: localStorage.getItem('company_id')
    }
    return this.http.post<any>(this.dashboard + `getRoomsOccupancy`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }



  getMonthWisePatients() {
    var data = {
      company_id: localStorage.getItem('company_id')
    }
    return this.http.post<any>(this.dashboard + ` `, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getTopMedicinesSale() {
    var data = {
      company_id: localStorage.getItem('company_id')
    }
    return this.http.post<any>(this.dashboard + `getTopMedicinesSale`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }


  getTotalIncomeCompany() {
    var data = {
      company_id: localStorage.getItem('company_id')
    }
    return this.http.post<any>(this.dashboard + `getTotalIncomeCompany`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  last7daysLabsIncome() {
    var data = {
      company_id: localStorage.getItem('company_id')
    }
    return this.http.post<any>(this.dashboard + `lastSvndaysLabsIncome`, data).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  maintotal() {
    return this.http.get<any>(this.dashboard + `maintotal`).pipe(map(res => {
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

  maintotalres() {
    return this.http.get<any>(this.dashboard + `maintotalres`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

//////acccount service 






}
