import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { Customer } from './customer.model';
import { ErrorService } from '../error/error.service';


@Injectable()
export class CustomerService {
    customerIsEdited = new EventEmitter<Customer>();
    private customers: Customer[] = [];

    constructor(private http: Http, private errorService: ErrorService) { }


    /**
     * addCustomer - Posts a new customer to the server and database
     *
     * @param  {Customer} customer: Customer The Customer object to add in mongoDB
     * @returns {Observable} Observable Response from the server. Success or Error to be displayed in Growl
     */
    addCustomer(customer: Customer) {
        const body = JSON.stringify(customer);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        //console.log(body);
        //console.log(token);
        return this.http.post('customer' + token, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const customer = new Customer(
                    result.obj.h1,
                    result.obj.name,
                    result.obj.status,
                    result.obj.note,
                    result.obj.user.firstName + ' ' + result.obj.user.lastName,
                    new Date(moment(result.obj.initialDt).format('MM/DD/YYYY')),
                    new Date(moment(result.obj.updateDt).format('MM/DD/YYYY')),
                    result.obj.user.firstName + ' ' + result.obj.user.lastName,
                    result.obj._id,
                    result.obj.user._id
                );
                this.customers.push(customer);
                this.errorService.handleError(response.json());
                return customer;
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }


    /**
     * getCustomers - Gets an array of Customer objects from the server
     *
     * @param  {boolean} showAllCustomers?: boolean if true, then only get logged in user's customers
     * @returns {Observable} Observable Response from the server. Success or Error to be displayed in Growl
     */
    getCustomers(showAllCustomers?: boolean) {
        let getPath = 'customer';
        if (!showAllCustomers) {
            getPath += '/' + localStorage.getItem('userId');
        }
        return this.http.get(getPath)
            .map((response: Response) => {
                const customers = response.json().obj;
                let transformedCustomers: Customer[] = [];
                for (let customer of customers) {
                    //console.log('Received: ');
                    //console.log(customer);
                    transformedCustomers.push(new Customer(
                        customer.h1,
                        customer.name,
                        customer.status,
                        customer.note,
                        customer.user.firstName + ' ' + customer.user.lastName,
                        new Date(moment(customer.initialDt).format('MM/DD/YYYY')),
                        new Date(moment(customer.updateDt).format('MM/DD/YYYY')),
                        customer.updateUser.firstName + ' ' + customer.updateUser.lastName,
                        customer._id,
                        customer.user._id,
                        customer.updateUser._id
                    ));
                }
                this.customers = transformedCustomers;
                return transformedCustomers;
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }


    /**
     * updateCustomer - Patches/Updates a user object on the server/DB
     *
     * @param  {Customer} customer: Customer Updated customer object
     * @returns {Observable} Observable Response from the server. Success or Error to be displayed in Growl
     */
    updateCustomer(customer: Customer) {
        customer.updateDt = new Date();
        const body = JSON.stringify(customer);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        console.log(customer);
        return this.http.patch('customer/' + customer._id + token, body, { headers: headers })
            .map((response: Response) => {
                //console.log(response);
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }


    /**
     * deleteCustomer - description
     *
     * @param  {type} customer: Customer description
     * @returns {type}                    description
     */
    deleteCustomer(customer: Customer) {
        this.customers.splice(this.customers.indexOf(customer), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('customer/' + customer._id + token)
            .map((response: Response) => {
                //console.log(response);
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}
