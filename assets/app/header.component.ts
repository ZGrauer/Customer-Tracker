import { Component } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

import '../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../node_modules/primeng/resources/primeng.min.css';
import '../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'app-header',
    template: `
        <h1>Customer Tracker</h1>
        <p-tabMenu [model]="items"></p-tabMenu>
    `
})
export class HeaderComponent implements OnInit {
    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {label: 'Customers', icon: 'fa-table' , routerLink: ['customers']},
            {label: 'Login/Logout', icon: ' fa-sign-in', routerLink: ['auth']}
        ];
    }
}
