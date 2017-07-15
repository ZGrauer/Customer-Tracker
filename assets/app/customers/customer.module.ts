import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerComponent } from './customer.component';
import { CustomerService } from './customer.service';
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
    ConfirmDialogModule
} from 'primeng/primeng';

@NgModule({
    declarations: [CustomerComponent],
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
        ConfirmDialogModule
    ],
    providers: [CustomerService]
})
export class CustomerModule {

}
