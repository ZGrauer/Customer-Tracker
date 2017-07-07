import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Customer } from './customer.model';
import { Http, Response, Headers } from '@angular/http';
import * as moment from 'moment';

@Injectable()
export class CustomerService {
    customerIsEdited = new EventEmitter<Customer>();
    private customers: Customer[] = [];

    constructor(private http: Http) { }

    addCustomer(customer: Customer) {
        this.customers.push(customer);
        const body = JSON.stringify(customer);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        console.log(body);
        console.log(token);
        return this.http.post('customer' + token, body, { headers: headers })
            .map((response: Response) => {
                const result = response.json();
                const customer = new Customer(
                    result.obj.h1,
                    result.obj.name,
                    result.obj.status,
                    result.obj.note,
                    result.obj.user.firstName + ' ' + result.obj.user.lastName,
                    result.obj.initialDt,
                    result.obj.updateDt,
                    result.obj.user.firstName + ' ' + result.obj.user.lastName,
                    result.obj._id,
                    result.obj.user._id
                );
                return customer;
            })
            .catch((error: Response) => Observable.throw('Error in Customer Service! ' + error.text));
    }

    getCustomers() {
        //return this.customers;
        return this.http.get('customer')
            .map((response: Response) => {
                const customers = response.json().obj;
                let transformedCustomers: Customer[] = [];
                for (let customer of customers) {
                    console.log('Received: ');
                    console.log(customer);
                    transformedCustomers.push(new Customer(
                        customer.h1,
                        customer.name,
                        customer.status,
                        customer.note,
                        customer.user.firstName + ' ' + customer.user.lastName,
                        moment(customer.initialDt).format('MM/DD/YYYY'),
                        moment(customer.updateDt).format('MM/DD/YYYY'),
                        customer.user.firstName + ' ' + customer.user.lastName,
                        customer._id,
                        customer.user._id
                    ));
                }
                this.customers = transformedCustomers;
                return transformedCustomers;
            })
            .catch((error: Response) => Observable.throw('Error in Customer Service! ' + error.text));
    }

    updateCustomer(customer:Customer) {
        const body = JSON.stringify(customer);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('customer/' + customer._id + token, body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw('Error in Customer Service! ' + error.text));
    }

    deleteCustomer(customer: Customer) {
        this.customers.splice(this.customers.indexOf(customer), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('customer/' + customer._id + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw('Error in Customer Service! ' + error.text));
    }
}
