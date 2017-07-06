import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'app-logout',
    template: `
        <button pButton type="button" pButton icon="fa-sign-out" (click)="onLogout()" label="Logout"></button>
    `
})
export class LogoutComponent {

    constructor(private authService: AuthService, private router: Router) {}

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }
}
