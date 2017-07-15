import { Component, Input } from "@angular/core";

import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import { ChartModule } from 'primeng/primeng';

@Component({
    selector: 'app-chart',
    template: `
        <p-chart [type]="type" [options]="options" [data]="data"></p-chart>
    `
})

export class ChartComponent {
    @Input() data: any;
    @Input() options: any;
    @Input() type: string = 'pie';
}
