import { Component } from '@angular/core';
import { AuthService } from "./auth.service";


@Component({
    selector: 'app-authentication',
    template: `
    <div class="ui-g ui-grid-row">
        <div class="ui-g-12 ui-md-2" *ngIf="isLoggedIn()"><app-logout></app-logout></div>
        <div class="ui-g-12 ui-md-10 ui-lg-7" *ngIf="isLoggedIn()"><app-changePassword></app-changePassword></div>
    </div>
    <div class="ui-g ui-grid-row">
        <div class="ui-g-12 ui-md-2"></div>
        <div class="ui-g-12 ui-md-10 ui-lg-7" *ngIf="isAdmin()"><app-signup></app-signup></div>
    </div>
    <div class="ui-g ui-grid-row">
        <div class="ui-g-12 ui-md-2"></div>
        <div class="ui-g-12 ui-md-10 ui-lg-7" *ngIf="!isLoggedIn()"><app-signin></app-signin></div>
    </div>
    `
})
export class AuthenticationComponent {
    constructor(private authService: AuthService) {}

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }

    isAdmin() {
        return this.authService.isAdmin();
    }
}
