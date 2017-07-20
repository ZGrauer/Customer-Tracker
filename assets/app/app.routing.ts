import { Routes, RouterModule } from '@angular/router';
import { AUTH_ROUTES } from "./auth/auth.routing";
import { CustomerComponent } from './customers/customer.component';
import { AuthenticationComponent } from './auth/authentication.component';
import { INFO_ROUTES } from "./info/info.routing";
import { InfoComponent } from './info/info.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerComponent },
    { path: 'auth', component: AuthenticationComponent, children: AUTH_ROUTES },
    { path: 'info', component: InfoComponent, children: INFO_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
