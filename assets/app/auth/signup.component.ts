import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Validators, FormControl, FormGroup, FormBuilder, AbstractControl} from '@angular/forms';


import { User } from './user.model';
import { AuthService } from './auth.service';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';
import {SelectItem} from 'primeng/primeng';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
    displayDialog: boolean = false;
    selectedUser: string;
    newUser: boolean = true;
    user: User;
    users: User[] = [];
    userSelection: SelectItem[] = [];
    userform: FormGroup;

    constructor(private authService: AuthService, private fb: FormBuilder) { }

    ngOnInit() {
        this.newUser = true;
        this.user = new User('', '', '', '', false, false);
        this.displayDialog = true;
        this.userform = this.fb.group({
            'user': new FormControl(''),
            'firstName': new FormControl('', Validators.required),
            'lastName': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'email': new FormControl('', Validators.compose([Validators.required, Validators.email])),
            'admin': new FormControl('', Validators.required)
        });
        this.userSelection.push({ label: 'Add New User', value: null });
        this.authService.getUsers()
            .subscribe(
            (users: User[]) => {
                this.users = users;
                this.users.forEach(u => {
                    this.userSelection.push({ label: u.firstName + ' ' + u.lastName, value: u._id });
                });
            }
            );
    }

    onUserSelectChange() {
        if (this.selectedUser == null) {
            this.newUser = true;
            this.user = new User('', '', '', '', false, false);
            return;
        }
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._id == this.selectedUser) {
                this.user = this.users[i];
                this.newUser = false;
                return;
            }
        }
    }

    onSubmit(value: string) {
        if (this.newUser) {
            //this.customers.push(this.customer);
            this.authService.addUser(this.user)
                .subscribe(
                data => console.log(data),
                error => console.log(error)
                );
        } else {
            this.authService.updateUser(this.user)
                .subscribe(
                data => console.log(data),
                error => console.log(error)
                );
        }
        this.user =  new User('', '', '', '', false, false);
    }


    delete() {
        this.authService.deleteUser(this.user)
            .subscribe(
            data => console.log(data),
            error => console.log(error)
            );
        this.userform.reset();
        this.users.splice(this.findSelectedUserIndex(), 1);
    }

    findSelectedUserIndex(): number {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._id == this.user._id ) {
                return i;
            }
        }
    }
}
