import { Component } from '@angular/core';
// import { IdleService } from './idle.service'
import { BehaviorSubject } from 'rxjs';
import { LoginModel } from './core/model/login.model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginService } from './core/services/login.service';
import { DisableRightClickService } from './disable-right-click.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private currentUserSubject: BehaviorSubject<LoginModel>;   // current subject by default
  private sessionTimeout: any;
  private alertTimeout: any;
  Api = environment.texturespaceURL;
  constructor(private router: Router, private modalService: NgbModal, private http: HttpClient, private loginservice: LoginService, private DisableRightClickService: DisableRightClickService) {
    this.currentUserSubject = new BehaviorSubject<LoginModel>(JSON.parse(sessionStorage.getItem('currentUser')));
  }

  ngOnInit() {
    // this.DisableRightClickService.disableRightClick()
    const token = this.getTokenFromLocalStorage();
    if (token) {
      this.scheduleSessionTimeout(token); // Schedule session timeout based on token
    }
  }

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('acstkn');
  }

  scheduleSessionTimeout(token: string): void {
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    if (this.alertTimeout) clearTimeout(this.alertTimeout);
    const decoded: any = this.decodeJWT(token);
    if (!decoded || !decoded.exp) {
      this.loginservice.logout();
      return;
    }
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeoutDuration = expiryTime - currentTime;
    if (timeoutDuration <= 0) {
      this.generateNewToken(token);
      return;
    }
    const alertBeforeMs = 5 * 60 * 1000; 
    const alertTime = timeoutDuration - alertBeforeMs;
    if (alertTime > 0) {
      this.alertTimeout = setTimeout(() => {
        alert("save your work.");
      }, alertTime);
    } else {
    }
    this.sessionTimeout = setTimeout(() => {
      this.generateNewToken(token);
    }, timeoutDuration);


  }





  private decodeJWT(token: string): any {
    const payload = token.split('.')[1];
    if (!payload) {
      throw new Error('Invalid token structure');
    }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);

    return decoded;
  }


  clearTokenFromLocalStorage() {
    if (localStorage.getItem('user_id')) {
      var user_id = localStorage.getItem('user_id');
    } else {
      var user_id = sessionStorage.getItem('user_id');
    }
    var data = {
      cts: localStorage.getItem('cts'),
      user_id: user_id,
      end: new Date()
    }

    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();

    localStorage.removeItem('currentUser');
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  generateNewToken(expiredToken: string): void {
    this.http.post<{ token: string }>(this.Api + `regeneratetoken`, {}, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    })
      .subscribe({
        next: (response) => {
          const newToken = response.token;
          localStorage.setItem('acstkn', newToken);

          // Reset session timeout based on the new token (with 2-minute expiration)
          this.scheduleSessionTimeout(newToken);
        },
        error: (error) => {
          this.clearTokenFromLocalStorage();
          // Optionally: Show an error message or log the user out
        },
      });
  }


}
