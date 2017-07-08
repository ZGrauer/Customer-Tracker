import { Component, ViewEncapsulation, OnInit } from "@angular/core";

import { Customer } from "./customer.model";
import { User } from "../auth/user.model";
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

import {DropdownModule} from 'primeng/primeng';

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

    constructor(private customerService: CustomerService, private authService:AuthService) { }

    ngOnInit() {
        //this.customers = this.customerService.getCustomers();
        this.customerService.getCustomers()
            .subscribe(
                (customers: Customer[]) => {
                    this.customers = customers;
                }
            );

        this.authService.getUsers()
            .subscribe(
                (users: User[]) => {
                    this.users = users;
                    this.userSelection.push({label:'Select IPM', value:null});
                    this.users.forEach(u => {
                        this.userSelection.push({label: u.firstName + ' ' + u.lastName, value:u._id});
                    });
                }
            );
        this.currentUserId = this.authService.getUserId();
    }

    showDialogToAdd() {
        this.newCustomer = true;
        this.customer = new Customer(0, '', '', '', '', new Date(), new Date(), '');
        this.displayDialog = true;
    }

    save() {
        if (this.newCustomer) {
            //this.customers.push(this.customer);
            this.customerService.addCustomer(this.customer)
                .subscribe(
                    data => console.log(data),
                    error => console.log(error)
                );
        } else {
            this.customers[this.findSelectedCustomerIndex()] = this.customer;
            this.customerService.updateCustomer(this.customers[this.findSelectedCustomerIndex()])
                .subscribe(
                    result => console.log(result)
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
