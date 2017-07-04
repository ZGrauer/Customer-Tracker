import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customers/customer.component';
import { AuthenticationComponent } from './auth/authentication.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerComponent },
    { path: 'auth', component: AuthenticationComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
