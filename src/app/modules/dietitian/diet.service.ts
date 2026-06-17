import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DietService {

 constructor(private http:HttpClient){}

  private baseUrl = environment.texturespaceURL;

  
dietplan(playload:any):Observable<any>{
  return this.http.post(`${this.baseUrl}diet`,playload)
}  

  // ✅ GET LIST
  getdiet(): Observable<any> {
return this.http.get(`${this.baseUrl}getdiet`);
  }


  
  // ✅ GET SINGLE (by id)
  getDietById(id: number | string): Observable<any> {
    return this.http.get(`${this.baseUrl}getdiet/${id}`);
  }

  // ✅ UPDATE (by id)
  updateDiet(id: number | string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}updatediet/${id}`, payload);
  }





  
}
