import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivateChild {
  constructor(
    private router: Router

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
      var boom = [];
      currentUser.map( poco => {
         boom = [...poco.submenu, ...boom];
      })
      const results = boom.filter( res  =>  { return res.id == childRoute.routeConfig.data['roles']
       } );
 

      if (currentUser) {
            
            if (childRoute.routeConfig.data['roles'] && results.length === 0 ) {
              
              this.router.navigate(['/']);
              return false;
          }
          return true;
      }

      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login/signin2'], { queryParams: { returnUrl: state.url } });
      return false;
  }

}
