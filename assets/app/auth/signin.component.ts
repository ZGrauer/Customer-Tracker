import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { User } from "./user.model";
import { AuthService } from "./auth.service";
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';


@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent {
    email: String;
    password: String;
    displayDialog: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        this.authService.signin(this.email, this.password)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.router.navigateByUrl('/');
                },
                error => console.error(error)
            );
    }

    toggleDialog() {
        this.displayDialog = !this.displayDialog;
    }

}
