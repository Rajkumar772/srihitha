import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (localStorage.getItem('currentUser')) {
      var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } else {
      var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    }

    if (currentUser) {
      return true;
    }

    this.router.navigate(['/login/login']);
    return false;
  }
}


