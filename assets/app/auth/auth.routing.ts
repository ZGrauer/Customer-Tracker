import { Routes } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { SignupComponent } from './signup.component';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';

export const AUTH_ROUTES: Routes = [
    { path: '', component: AuthenticationComponent, pathMatch: 'full' },
    { path: 'signup', component: SignupComponent },
    { path: 'signin', component: SignupComponent },
    { path: 'logout', component: LogoutComponent }
];
