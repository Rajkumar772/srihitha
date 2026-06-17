import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

var Api = environment.texturespaceURL;

@Injectable({
  providedIn: 'root'
})


export class DoctorserviceService {

  // Sucess And Error Alerts //

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

  constructor(private http: HttpClient) { }


  getpatients() {
    return this.http.get<any>(Api + `getpatientsdata`).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }

  add_presciption(data) {
    return this.http.post<any>(Api + `add_prescription`, data).pipe(
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

  getDoctordetails(data) {
    return this.http.post<any>(Api + "getDoctordetails", data).pipe(
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

  getdoctorsrchdata(data) {
    return this.http.post<any>(Api + `getdoctorsrchdata`, data).pipe(
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

  getmedicinename() {
    return this.http.get<any>(Api + `getmedicinename`).pipe(map(res => {
      return res;
    }, error => {
      this.errorAlert();
      return error;
    }));
  }

  addNewTests(data) {
    return this.http.post<any>(Api + `addNewTests`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }
  getnewtest() {
    return this.http.post<any>(Api + `getnewtest`, []).pipe(
      map(
        (res) => {
          return res;
        },
        (error) => {
          return error;
        }
      )
    );
  };

  getmedicalFields(data) {
    return this.http.post<any>(Api + `getmedicalFields`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }







  /////////////// new   //////////////////////////////////////// hanisha 


  get_labtest() {
    return this.http.post<any>(Api + `get_labtest`, []).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }




  getdiagnosticTests() {
    return this.http.post<any>(Api + `getdiagnosticTests`, []).pipe(
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

  post_doctor_patient(data) {
    return this.http.post<any>(Api + `post_doctor_patient`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }


  maingetCallforGroupTests() {
    return this.http.post<any>(Api + `maingetCallforGroupTests`, []).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }


  findandGetGroupCategoryTests(data) {
    return this.http.post<any>(Api + `findandGetGroupCategoryTests`, data).pipe(map((res) => {
      return res;
    }, (error) => {
      return error;
    }));
  }




  ////////////////////////////// list 



  getLabfields(data) {
    return this.http.post<any>(Api + `getLabfields`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }

  getDiagnostic(data) {
    return this.http.post<any>(Api + `getDiagnostic`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }



  checkWhetherLabTestassigned(data) {
    return this.http.post<any>(Api + `checkWhetherLabTestassigned`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }




  getAllHistoryOfPtnDctr(data) {
    return this.http.post<any>(Api + `getAllHistoryOfPtnDctr`, data).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }




  getDoctorVsitPtntList() {
    return this.http.post<any>(Api + `getDoctorVsitPtntList`, []).pipe(map(res => {
      return res;
    }, error => {
      return error;
    }));
  }



  getDoctorsData() {
    return this.http.post<any>(Api + "getDoctorsData", []).pipe(
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


getcompositonwisetabletsdata(data) {
    return this.http.post<any>(Api + `getcompositonwisetabletsdata`, data).pipe(map((res) => {
     return res;
    }, (error) => {
     return error;
    }));
}




getPatientByUhidOrMobile(data: any) {
  return this.http.post<any>(Api + `getPatientByUhidOrMobile`, data).pipe(
    map(
      (res) => res,
      (error) => error
    )
  );
}



getPatientAssignedLabTests(data: any) {
  return this.http.post<any>(Api + `getPatientAssignedLabTests`, data).pipe(
    map(
      (res) => res,
      (error) => error
    )
  );
}
}
