import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Customer } from "./customer.model";
import { User } from "../auth/user.model";
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';

import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';
import {SelectItem} from 'primeng/primeng';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    encapsulation: ViewEncapsulation.None
})

export class CustomerComponent implements OnInit {
    displayDialog: boolean;
    selectedCustomer: Customer;
    newCustomer: boolean;
    customer: Customer;
    customers: Customer[] = [];
    users: User[] = [];
    userSelection: SelectItem[] = [];
    currentUserId: String;
    customerform: FormGroup;

    constructor(private customerService: CustomerService, private router: Router, private authService: AuthService, private fb: FormBuilder) { }

    ngOnInit() {
        //this.customers = this.customerService.getCustomers();
        this.getCustomers();

        this.authService.getUsers()
            .subscribe(
            (users: User[]) => {
                this.users = users;
                this.userSelection.push({ label: 'Select IPM', value: null });
                this.users.forEach(u => {
                    this.userSelection.push({ label: u.firstName + ' ' + u.lastName, value: u._id });
                });
            }
            );
        this.currentUserId = this.authService.getUserId();
        this.customerform = this.fb.group({
            'h1': new FormControl('', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9)])),
            'name': new FormControl('', Validators.required),
            'status': new FormControl('', Validators.required),
            'note': new FormControl(''),
            'ipm': new FormControl('', Validators.required),
            'initialDt': new FormControl(''),
            'updateDt': new FormControl(''),
            'updateUser': new FormControl({ disabled: true })
        });
    }

    showDialogToAdd() {
        if (this.isAdmin()) {
            this.newCustomer = true;
            this.customer = new Customer(null, '', '', '', '', new Date(), new Date(), '');
            this.displayDialog = true;
        }
    }

    getCustomers() {
        this.customerService.getCustomers()
            .subscribe(
                (customers: Customer[]) => {
                    //console.log(customers);
                    this.customers = customers;
                }
            );
    }

    save(value: String) {
        this.customer._updateUserId = this.authService.getUserId();
        if (this.newCustomer) {
            this.customerService.addCustomer(this.customer)
                .subscribe(
                data => {
                    console.log(data);
                    this.router.navigateByUrl('/');
                },
                error => console.log(error)
                );
        } else {
            this.customers[this.findSelectedCustomerIndex()] = this.customer;
            this.customerService.updateCustomer(this.customer)
            .subscribe(
            result => {
                console.log(result);
                this.router.navigateByUrl('/');
            },
            error => console.log(error)
            );
        }

        this.customer = null;
        this.displayDialog = false;
    }

    delete() {
        //this.customers.splice(this.findSelectedCustomerIndex(), 1);
        this.customerService.deleteCustomer(this.selectedCustomer)
            .subscribe(
            result => console.log(result)
            );
        this.customer = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newCustomer = false;
        this.customer = this.cloneCustomer(event.data);
        if (this.belongsToUser()) {
            this.displayDialog = true;
        }

    }

    cloneCustomer(c: Customer): Customer {
        let customer = new Customer(0, '', '', '', '', new Date(), new Date(), '');
        for (let prop in c) {
            customer[prop] = c[prop];
        }
        return customer;
    }

    findSelectedCustomerIndex(): number {
        return this.customers.indexOf(this.selectedCustomer);

    }

    belongsToUser() {
        return (this.authService.getUserId() == this.customer._userId) || this.authService.isAdmin();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null && !this.authService.isDeleted();
    }

    isAdmin() {
        return this.authService.isAdmin();
    }
}
