import { Customer } from './customer.model';

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

    addCustomer(customer: Customer) {
        this.customers.push(customer);
    }

    getCustomers(customer: Customer) {
        return this.customers;
    }

    deleteCustomer(customer: Customer) {
        this.customers.splice(this.customers.indexOf(customer), 1);
    }
}
