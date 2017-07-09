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

    constructor(private http: Http, private errorService:ErrorService) { }

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
                    moment(result.obj.initialDt).format('MM/DD/YYYY'),
                    moment(result.obj.updateDt).format('MM/DD/YYYY'),
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

    getCustomers() {
        //return this.customers;
        return this.http.get('customer')
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
                        moment(customer.initialDt).format('MM/DD/YYYY'),
                        moment(customer.updateDt).format('MM/DD/YYYY'),
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

    updateCustomer(customer:Customer) {
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
