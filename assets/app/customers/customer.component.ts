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
    displayDialog: boolean;     // displays the add/edit customer modal
    selectedCustomer: Customer; // The currently edited customer
    newCustomer: boolean;       // Adding a new customer or editing existing in modal?
    customer: Customer;         // new customer object for mongo
    customers: Customer[] = []; // Array of all customers for datatable.  Also used for charts.
    users: User[] = [];         // Array of all users from mongo.  used for dropdowns
    userSelection: SelectItem[] = [];  // PrimeNG selection for IPM
    currentUserId: String;      // The user's ID from mongo
    customerform: FormGroup;    // Formgroup for the add/edit customer modal
    statuses: SelectItem[] = [];    // All availble customer statues for the add/edit modal
    msgs: Message[] = [];       // Messages to display using PrimeNG growl.  Error, success, etc.
    showAllCustomers: boolean = true;   // Toggle button to show all or only user's customers
    pieChartType: string = 'pie';   // Sent to chart component to determine Chart.js type
    customerStatusChartData: any;   // Status summary chart data for Chart.js
    customerStatusChartOptions: any;    // Status summary chart options for Chart.js
    customerUserChartData: any;     // User count chart data
    customerUserChartOptions: any;  // Chart options

    constructor(
        private customerService: CustomerService,
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        // Populates the customer array via the customer service
        this.getCustomers();
        // Populates array of all users for dropdowns in add/edit modal
        this.getUsers();
        // Populates array of all customer statues for add/edit modal
        this.getStatusValues();
    }


    /**
     * showDialogToAdd - Displays the Add customer modal.  User must be Admin to add.
     *
     * @returns {void}
     */
    showDialogToAdd() {
        if (this.isAdmin()) {
            this.newCustomer = true;
            this.customer = new Customer(null, '', '', '', '', new Date(), new Date(), '');
            this.displayDialog = true;
        }
    }


    /**
     * getCustomers - Uses the Customer Service to get all customer objects from the database
     *
     * @returns {void}
     */
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



    /**
     * getUsers - Uses the Auth Service to get all user objects from the database
     *
     * @returns {void}
     */
    getUsers() {
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


    /**
     * getStatusValues - gets & sets all statues for customer records
     *
     * @returns {void}
     */
    getStatusValues() {
        this.statuses.push({ label: '0 - No contact', value: 'No contact' });
        this.statuses.push({ label: '1 - Engaged Team', value: 'Engaged Team' });
        this.statuses.push({ label: '2 - Design Complete', value: 'Design Complete' });
        this.statuses.push({ label: '3 - Implementation Complete', value: 'Implementation Complete' });
        this.statuses.push({ label: '4 - Migration Complete', value: 'Migration Complete' });
        this.statuses.push({ label: 'Basic - No P28', value: 'Basic - No P28' });
    }


    /**
     * save - Saves new and updated customers to the database via the Customer Service
     *
     * @returns {void}
     */
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



    /**
     * delete - Deletes a customer record from the database
     *
     * @returns {void}
     */
    delete() {
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



    /**
     * onRowSelect - sets the customer object to the current row.
     *              Checks for user auth.
     *              Then displays the edit modal
     *
     * @param  {type} event Data from selecting a row in the datatable
     * @returns {void}
     */
    onRowSelect(event) {
        this.newCustomer = false;
        this.customer = this.cloneCustomer(event.data);
        if (this.belongsToUser()) {
            this.displayDialog = true;
        }

    }




    /**
     * cloneCustomer - Creates a new cloned customer object for editing
     *
     * @param  {Customer} c Customer object to clone
     * @returns {Customer} new Customer object that matches the param
     */
    cloneCustomer(c: Customer): Customer {
        let customer = new Customer(0, '', '', '', '', new Date(), new Date(), '');
        for (let prop in c) {
            customer[prop] = c[prop];
        }
        return customer;
    }

    /**
     * cloneCustomer - Returns the index for the currently selected customer in the customers array
     *
     * @returns {number} the index in the array for the selected customer
     */
    findSelectedCustomerIndex(): number {
        return this.customers.indexOf(this.selectedCustomer);
    }

    /**
     * belongsToUser - returns true or false if the current selected customer
     *                  belongs to the logged in user, or if the user is an Admin
     *
     * @returns {boolean}
     */
    belongsToUser(): boolean {
        return (this.authService.getUserId() == this.customer._userId) || this.authService.isAdmin();
    }

    /**
     * isLoggedIn -  returns true or false if the current user has a token and not deleted in the database
     *
     * @returns {boolean}
     */
    isLoggedIn(): boolean {
        return localStorage.getItem('token') !== null && !this.authService.isDeleted();
    }

    /**
     * isAdmin -  returns true or false if the current user is an admin
     *
     * @returns {boolean}
     */
    isAdmin(): boolean {
        return this.authService.isAdmin();
    }


    /**
     * confirm - Displays a PrimeNG confirmation box for deletes
     *
     * @returns {void}
     */
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


    /**
     * updateChart - Sets the Chart.js data and labels based on the customers array.
     *
     * @returns {void}
     */
    updateChart() {
        let statusLabels: String[] = this.getChartLabels('status');
        let statusCounts: number[] = this.getChartData(statusLabels, 'status');
        let colors: string[] = [
            '#ff6384',
            '#36a2eb',
            '#ffce56',
            '#4bc0c0',
            '#ff9f40'
        ];

        //console.log(statusLabels);
        //console.log(statusCounts);
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
            labels: statusLabels,
            datasets: [
                {
                    data: statusCounts,
                    backgroundColor: colors,
                    hoverBackgroundColor: colors
                }]
        };

        if (this.isAdmin()) {
            let userLabels: String[] = this.getChartLabels('user');
            let userCounts: number[] = this.getChartData(userLabels, 'user');
            //console.log(userLabels);
            //console.log(userCounts);
            this.customerUserChartOptions = {
                title: {
                    display: true,
                    text: 'Customer Count By IPM',
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
            this.customerUserChartData = {
                labels: userLabels,
                datasets: [
                    {
                        data: userCounts,
                        backgroundColor: colors,
                        hoverBackgroundColor: colors
                    }]
            };
        }
    }


    /**
     * getChartLabels - Returns an array of Strings that represent the labels for Chart.js.
     *                  Pass in the name of a property of the customer object.
     *
     * @param  {string} customerProperty string property name of a customer object
     * @returns {String[]} Array of distinct strings for a property of the customer array.  Used as labels in Chart.js
     */
    getChartLabels(customerProperty: string): String[] {
        let labels: String[] = [];
        for (let i = 0; i < this.customers.length; i++) {
            let foundmatch: boolean = false;
            for (let j = 0; j < labels.length; j++) {
                if (labels[j] == this.customers[i][customerProperty]) {
                    foundmatch = true;
                    break;
                }
            }
            if (!foundmatch) {
                labels.push(this.customers[i][customerProperty]);
            }
        }
        return labels;
    }

    /**
     * getChartLabels - Returns an array of numbers that represent the count of each label in the customer array.
     *                  Used as data for Chart.js.
     *
     * @param  {String[]} labels  Array of distinct strings for a property of the customer array.
     * @param  {string} customerProperty  The property in a customer to count for each label.
     * @returns {number[]} Array of numbers/counts for input label values.  Used as data in Chart.js
     */
    getChartData(labels: String[], customerProperty: string): number[] {
        let counts: number[] = [];
        for (let i = 0; i < labels.length; i++) {
            counts.push(0);
            for (let j = 0; j < this.customers.length; j++) {
                if (labels[i] == this.customers[j][customerProperty]) {
                    counts[i]++;
                }
            }
        }
        return counts;
    }
}
