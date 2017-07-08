import { Component, OnInit } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { User } from "./user.model";
import { AuthService } from "./auth.service";
import { ErrorService } from '../error/error.service';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';


@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
    email: String;
    password: String;
    displayDialog: boolean = false;
    loginform: FormGroup;

    constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private errorService: ErrorService) {}

    ngOnInit() {
        this.loginform = this.fb.group({
            'email': new FormControl('', Validators.compose([Validators.required, Validators.email])),
            'password': new FormControl('', Validators.required),
        });
    }

    onSubmit(value: string) {
        this.authService.signin(this.email, this.password)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('admin', data.admin);
                    localStorage.setItem('deleted', data.deleted);
                    this.router.navigateByUrl('/');
                },
                error => {
                    console.error(error);
                    this.errorService.handleError(error);
                    return Observable.throw(error);
                }
            );
    }

    toggleDialog() {
        this.displayDialog = !this.displayDialog;
    }

}
