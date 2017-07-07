import { Component } from '@angular/core';
import { AuthService } from "./auth.service";


@Component({
    selector: 'app-authentication',
    template: `
    <p-tabMenu [(model)]="items"></p-tabMenu>
    <div class="ui-g ui-grid-row">
        <div class="ui-g-12 ui-md-3" *ngIf="isLoggedIn()">
            <app-logout></app-logout>

        </div>
        <div class="ui-g-12 ui-md-9 ui-lg-7" *ngIf="isAdmin()">
            <app-changePassword></app-changePassword>
            <app-signup></app-signup>
        </div>
    </div>
    <div class="ui-g ui-grid-row">
        <div class="ui-g-12 ui-md-3"></div>
        <div class="ui-g-12 ui-md-9 ui-lg-7" *ngIf="!isLoggedIn()"><app-signin></app-signin></div>
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
