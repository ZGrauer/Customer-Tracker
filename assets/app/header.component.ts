import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

import { AuthService } from './auth/auth.service';
import '../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../node_modules/primeng/resources/primeng.min.css';
import '../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styles: [`
            #title {
                text-align: center;
                font-size: 38px;
                letter-spacing: 3px;
            }

            img {
                width: 100%;
                height: auto;
            }

            #nav-items {
                font: 16px "Lucida Grande", Helvetica, Arial, sans-serif;
            }
        `]
})
export class HeaderComponent implements OnInit {
    items: MenuItem[];
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.items = [
            { label: 'Customers', icon: 'fa-table', routerLink: ['customers'] },
            { label: 'Info & Resources', icon: 'fa-info-circle', routerLink: ['info'] },
            { label: 'Login/Logout', icon: 'fa-sign-in', routerLink: ['auth'] }
        ];

    }
}
