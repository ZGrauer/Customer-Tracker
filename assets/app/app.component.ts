import { Component, ViewEncapsulation } from '@angular/core';

import { Customer } from './customers/customer.model';
import '../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../node_modules/primeng/resources/primeng.min.css';
import '../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    customer: Customer[] = [new Customer(123456789, 'Test Customer', 'Engaged ESSS', 'Zach', new Date('May 27, 2017 12:00:00'), new Date('May 27, 2017 12:00:00'), 'Zach')];
}
