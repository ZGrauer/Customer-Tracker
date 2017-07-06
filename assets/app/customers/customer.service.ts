import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { Customer } from './customer.model';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class CustomerService {
    private customers: Customer[] = [new Customer(
        123456789,
        'Test Customer',
        'Engaged ESSS',
        'Zach',
        new Date('May 27, 2017 12:00:00'),
        new Date('May 27, 2017 12:00:00'),
        'Zach'
    ),
        new Customer(
            987654321,
            'Sprint',
            'Complete',
            'Tina',
            new Date('May 27, 2017 12:00:00'),
            new Date('May 27, 2017 12:00:00'),
            'Zach'
        )];

    constructor(private http: Http) {}

    addCustomer(customer: Customer) {
        this.customers.push(customer);
        const body = JSON.stringify(customer);
        console.log(body);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http:localhost:3000/customer', body, {headers: headers})
            .map((response: Response) => response.json())
                .catch((error: Response) => Observable.throw('Error in Customer Service! ' + error.text));
    }

    getCustomers() {
        return this.customers;
    }

    deleteCustomer(customer: Customer) {
        this.customers.splice(this.customers.indexOf(customer), 1);
    }
}
