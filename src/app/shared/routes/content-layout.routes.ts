import { Routes } from '@angular/router';
import { LoginGuard } from 'src/app/core/gaurds/login.guard';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const CONTENT_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: () => import('../../login/login.module').then(m => m.LoginModule), canActivateChild: [LoginGuard]
    }
];
