import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { AuthenticationComponent } from './auth/authentication.component';
import { HeaderComponent } from './header.component';
import { routing } from './app.routing';
import {
    InputTextModule,
    DataTableModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    TabMenuModule
 } from 'primeng/primeng';

import 'rxjs/add/operator/toPromise';

@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent,
        AuthenticationComponent,
        HeaderComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        routing,
        InputTextModule,
        DataTableModule,
        ButtonModule,
        DialogModule,
        CalendarModule,
        TabMenuModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
