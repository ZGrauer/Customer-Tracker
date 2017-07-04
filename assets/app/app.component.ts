import { Component } from '@angular/core';

import { CustomerService } from './customers/customer.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [CustomerService]
})
export class AppComponent {

    constructor(private customerService: CustomerService) {}


}
