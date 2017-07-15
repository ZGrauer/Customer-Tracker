import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerComponent } from './customer.component';
import { CustomerService } from './customer.service';
import { ChartComponent } from '../chart/chart.component';
import {
    InputTextModule,
    InputTextareaModule,
    DataTableModule,
    ButtonModule,
    ToggleButtonModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    GrowlModule,
    PanelModule,
    ConfirmDialogModule,
    ChartModule
} from 'primeng/primeng';

@NgModule({
    declarations: [CustomerComponent, ChartComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        DataTableModule,
        ButtonModule,
        ToggleButtonModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        GrowlModule,
        PanelModule,
        ConfirmDialogModule,
        ChartModule
    ],
    providers: [CustomerService]
})
export class CustomerModule {

}
