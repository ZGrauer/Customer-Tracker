import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Customer } from "./customer.model";
import { User } from "../auth/user.model";
import { CustomerService } from './customer.service';
import { AuthService } from '../auth/auth.service';

import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';
import { SelectItem, ConfirmationService, Message } from 'primeng/primeng';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [ConfirmationService]
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
    statuses: SelectItem[] = [];
    msgs: Message[] = [];
    showAllCustomers: boolean = true;
    customerStatusChartData: any;
    customerStatusChartOptions: any;

    constructor(
        private customerService: CustomerService,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) { }

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

        this.statuses.push({ label: '0 - No contact', value: 'No contact' });
        this.statuses.push({ label: '1 - Engaged Team', value: 'Engaged Team' });
        this.statuses.push({ label: '2 - Design Complete', value: 'Design Complete' });
        this.statuses.push({ label: '3 - Implementation Complete', value: 'Implementation Complete' });
        this.statuses.push({ label: '4 - Migration Complete', value: 'Migration Complete' });
        this.statuses.push({ label: 'Basic - No P28', value: 'Basic - No P28' });
    }

    showDialogToAdd() {
        if (this.isAdmin()) {
            this.newCustomer = true;
            this.customer = new Customer(null, '', '', '', '', new Date(), new Date(), '');
            this.displayDialog = true;
        }
    }

    getCustomers() {
        this.customerService.getCustomers(this.showAllCustomers)
            .subscribe(
            (customers: Customer[]) => {
                //console.log(customers);
                this.customers = customers;
                this.updateChart();
            }
            );
    }

    save() {
        this.customer._updateUserId = this.authService.getUserId();
        if (this.newCustomer) {
            this.customerService.addCustomer(this.customer)
                .subscribe(
                data => {
                    console.log(data);
                    this.updateChart();
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
                    this.updateChart();
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
            result => {
                console.log(result);
                this.updateChart();
            }
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

    confirm() {
        this.displayDialog = false;
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.delete();
            },
            reject: () => {
                console.log('Customer not deleted');
            }
        });
    }

    updateChart() {
        let labels: String[] = this.getStatusChartLabels();
        let counts: number[] = this.getStatusChartData(labels);

        //console.log(labels);
        //console.log(counts);
        this.customerStatusChartOptions = {
            title: {
                display: true,
                text: 'Build Status Counts',
                fontSize: 22
            },
            legend: {
                labels: {
                    fontSize: 16
                }
            },
            tooltips: {
                bodyFontSize: 14
            }
        };
        this.customerStatusChartData = {
            labels: labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: [
                        '#ff6384',
                        '#36a2eb',
                        '#ffce56',
                        '#4bc0c0',
                        '#ff9f40'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4bc0c0',
                        '#ff9f40'
                    ]
                }]
        };
    }

    getStatusChartLabels(): String[] {
        let labels: String[] = [];
        for (let i = 0; i < this.customers.length; i++) {
            let foundmatch: boolean = false;
            for (let j = 0; j < labels.length; j++) {
                if (labels[j] == this.customers[i].status) {
                    foundmatch = true;
                    break;
                }
            }
            if (!foundmatch) {
                labels.push(this.customers[i].status);
            }
        }
        return labels;
    }

    getStatusChartData(labels: String[]): number[] {
        let counts: number[] = [];
        for (let i = 0; i < labels.length; i++) {
            counts.push(0);
            for (let j = 0; j < this.customers.length; j++) {
                if (labels[i] == this.customers[j].status) {
                    counts[i]++;
                }
            }
        }
        return counts;
    }
}
