import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable,throwError } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private loginservice: LoginService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('acstkn');
    if (token) {
      const decoded = this.decodeJWT(token);
      if (!decoded) {
        alert('Invalid token, logging out...');
        this.logout(); // Log out if the token is invalid
        return throwError({ error: 'Invalid Token' });
      }
      if (
        Number(localStorage.getItem('user_id')) !== Number(decoded.usid) 
      ) { 
        alert('Access Denied');
        this.logout(); // Log out if tampering is detected
        return throwError({ error: 'Access Denied' });
      }
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
        } 
        return throwError(err);
      })
    );
  }

  // Decodes the JWT manually without external libraries
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Extract the payload part
      if (!base64Url) {
        throw new Error('Invalid token structure');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Convert to Base64
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload); // Parse the payload as JSON
    } catch (error) {
      
      return null;
    }
  }
  private logout() {
    this.loginservice.logout();
    // Clear the token and redirect to the login page
  }
}
