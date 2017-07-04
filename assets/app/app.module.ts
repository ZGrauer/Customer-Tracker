import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/operator/toPromise';

import { AppComponent } from "./app.component";
import { CustomerComponent } from './customers/customer.component';
import { InputTextModule, DataTableModule, ButtonModule, DialogModule, CalendarModule } from 'primeng/primeng';

@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent
    ],
    imports: [BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        InputTextModule,
        DataTableModule,
        ButtonModule,
        DialogModule,
        CalendarModule],
    bootstrap: [AppComponent]
})
export class AppModule {

}
