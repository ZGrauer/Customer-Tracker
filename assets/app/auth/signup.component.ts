import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder} from '@angular/forms';


import { User } from './user.model';
import { AuthService } from './auth.service';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
    displayDialog: boolean = false;
    selectedUser: User;
    newUser: boolean;
    user: User;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.newUser = true;
        this.user = new User('', '', '', '', false, false);
        this.displayDialog = true;
    }

    save() {
        if (this.newUser) {
            //this.customers.push(this.customer);
            this.authService.addUser(this.user)
                .subscribe(
                data => console.log(data),
                error => console.log(error)
                );
        }
        this.user = null;
        this.displayDialog = false;
    }

}
