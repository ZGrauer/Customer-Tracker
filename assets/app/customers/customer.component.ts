import { Component, ViewEncapsulation, OnInit } from "@angular/core";

import { Customer } from "./customer.model";
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

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

    constructor(private customerService: CustomerService, authService:AuthService) { }

    ngOnInit() {
        //this.customers = this.customerService.getCustomers();
        this.customerService.getCustomers()
            .subscribe(
                (customers: Customer[]) => {
                    this.customers = customers;
                }
            );
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
        return (localStorage.getItem('userId') == this.customer._userId) || localStorage.getItem('admin');;
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null && !localStorage.getItem('deleted');
    }

    isAdmin() {
        return localStorage.getItem('admin');
    }
}
