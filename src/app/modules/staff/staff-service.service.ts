import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';


var Api = environment.texturespaceURL;

@Injectable({
  providedIn: 'root'
})
export class StaffServiceService {

  constructor(private http:HttpClient) { }

  add_staff(data) {
    return this.http.post<any>(Api + `add_staff`, data).pipe(
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

  addNewdepartment(data) {
    return this.http.post<any>(Api + `addNewdepartment_staff`, data).pipe(
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


  addNewtimings(data) {
    return this.http.post<any>(Api + `addNewtimings_staff`, data).pipe(
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

  getdepartment() {
    return this.http.post<any>(Api + `get_staff_department`, []).pipe(
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


  gettimings() {
    return this.http.post<any>(Api + `get_staff_timings`, []).pipe(
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

  getStaffData() {
    return this.http.post<any>(Api + "getStaffData", []).pipe(
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

  EditStaff(data){
    return this.http.post<any>(Api + `EditStaff`, data).pipe(
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
  deleteStaff(data){
    return this.http.post<any>(Api + 'deleteStaff', data).pipe(
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

  getstaffsrchdata(data){
    return this.http.post<any>(Api + `getstaffsrchdata`, data).pipe(
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
}
