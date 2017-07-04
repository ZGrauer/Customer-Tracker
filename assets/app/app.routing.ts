import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customers/customer.component';

const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/customers', pathMatch: 'full' },
    { path: 'customers', component: CustomerComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
