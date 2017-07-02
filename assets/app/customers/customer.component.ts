import { Component, Input } from "@angular/core";

import { Customer } from "./customer.model";

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styles: [`
        .ipm {
            display: inline-block;
            font-style: italic;
            width: 80%;
        }
        .config {
            display: inline-block;
            text-align: right;
            width: 19%;
        }
        `]
})

export class CustomerComponent {
    @Input() customer:Customer;
}
