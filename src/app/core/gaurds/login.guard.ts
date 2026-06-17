import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {
  constructor(
    private router: Router,
    private loginService : LoginService

) { }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (localStorage.getItem('currentUser')) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
      }else{
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      }
      if (currentUser === null) {
          return true;
      }
      this.router.navigate(['/']);
      return false;
  }

}
