import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';
import { Message } from 'primeng/primeng';

@Component({
    selector: 'app-changePassword',
    templateUrl: './changePassword.component.html'
})
export class ChangePasswordComponent implements OnInit {
    oldPassword: string;
    newPassword: string;
    passwordform: FormGroup;
    msgs: Message[] = [];

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}

    ngOnInit() {
        this.passwordform = this.fb.group({
            'oldPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'newPassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
        });
    }

    onSubmit(value: string) {
        this.authService.updatePassword(this.oldPassword, this.newPassword)
            .subscribe(
                response => {
                    console.log(response);
                    //this.router.navigateByUrl('/');
                },
                error => console.error(error)
            );
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}
