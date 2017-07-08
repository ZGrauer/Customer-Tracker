import { Component } from '@angular/core';
import { ErrorComponent } from './error/error.component';
import { CustomerService } from './customers/customer.service';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    providers: [CustomerService]
})
export class AppComponent {

    constructor(private customerService: CustomerService) {}


}
