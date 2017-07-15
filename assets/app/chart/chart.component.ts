import { Component, Input } from "@angular/core";

import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import { ChartModule } from 'primeng/primeng';

@Component({
    selector: 'app-chart',
    template: `
        <h3>{{title}}</h3>
        <p-chart type="pie" [data]="data"></p-chart>
    `
})

export class ChartComponent {
    @Input() data: any;
    @Input() title: string;

}
