import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CustomerComponent } from './customers/customer.component';
import { CustomerService } from './customers/customer.service';
import { AuthenticationComponent } from './auth/authentication.component';
import { AuthService } from './auth/auth.service';
import { SignupComponent } from './auth/signup.component';
import { SigninComponent } from './auth/signin.component';
import { LogoutComponent } from './auth/logout.component';
import { ChangePasswordComponent } from './auth/changePassword.component';
import { HeaderComponent } from './header.component';
import { routing } from './app.routing';
import { ErrorService } from './error/error.service';
import { ErrorComponent } from './error/error.component';
import {
    InputTextModule,
    InputTextareaModule,
    DataTableModule,
    ButtonModule,
    ToggleButtonModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TabMenuModule,
    PasswordModule,
    GrowlModule,
    PanelModule,
    ConfirmDialogModule
} from 'primeng/primeng';

import 'rxjs/add/operator/toPromise';

@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent,
        AuthenticationComponent,
        HeaderComponent,
        SignupComponent,
        SigninComponent,
        LogoutComponent,
        ChangePasswordComponent,
        ErrorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        InputTextModule,
        InputTextareaModule,
        DataTableModule,
        ButtonModule,
        ToggleButtonModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        TabMenuModule,
        PasswordModule,
        GrowlModule,
        PanelModule,
        ConfirmDialogModule
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        CustomerService,
        ErrorService
    ]
})
export class AppModule {

}
