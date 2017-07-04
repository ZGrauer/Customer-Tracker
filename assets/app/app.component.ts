import { Component, ViewEncapsulation } from '@angular/core';

import { Customer } from './customers/customer.model';
import { CustomerService } from './customers/customer.service';
import '../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../node_modules/primeng/resources/primeng.min.css';
import '../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [CustomerService]
})
export class AppComponent implements OnInit {
    displayDialog: boolean;
    selectedCustomer: Customer;
    newCustomer: boolean;
    customer: Customer;
    customers: Customer[] = [];

    constructor(private customerService: CustomerService) {}

    ngOnInit() {
        this.customers = this.customerService.getCustomers();
    }

    showDialogToAdd() {
        this.newCustomer = true;
        this.customer = new Customer(0, '', '', '', new Date(), new Date(), '');
        this.displayDialog = true;
    }

    save() {
        if(this.newCustomer)
            //this.customers.push(this.customer);
            this.customerService.addCustomer(this.customer);
        else
            this.customers[this.findSelectedCustomerIndex()] = this.customer;

        this.customer = null;
        this.displayDialog = false;
    }

    delete() {
        //this.customers.splice(this.findSelectedCustomerIndex(), 1);
        this.customerService.deleteCustomer(this.selectedCustomer);
        this.customer = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newCustomer = false;
        this.customer = this.cloneCustomer(event.data);
        this.displayDialog = true;
    }

    cloneCustomer(c: Customer): Customer {
        let customer = new Customer(0, '', '', '', new Date(), new Date(), '');
        for(let prop in c) {
            customer[prop] = c[prop];
        }
        return customer;
    }

    findSelectedCustomerIndex(): number {
        return this.customers.indexOf(this.selectedCustomer);
    }

}
