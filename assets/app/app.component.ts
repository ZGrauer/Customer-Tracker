import { Component } from '@angular/core';

import { Customer } from './customers/customer.model';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    customer: Customer = new Customer(123456789, 'Test Customer', 'Engaged ESSS', 'Zach', new Date('May 27, 2017 12:00:00'), new Date('May 27, 2017 12:00:00'), 'Zach');
}
