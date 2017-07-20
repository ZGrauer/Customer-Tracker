import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CustomerModule } from './customers/customer.module'
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
import { InfoComponent } from './info/info.component';
import {
    InputTextModule,
    ButtonModule,
    ToggleButtonModule,
    DropdownModule,
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
        AuthenticationComponent,
        InfoComponent,
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
        ButtonModule,
        ToggleButtonModule,
        DropdownModule,
        TabMenuModule,
        PasswordModule,
        GrowlModule,
        PanelModule,
        ConfirmDialogModule,
        CustomerModule
    ],
    bootstrap: [AppComponent],
    providers: [
        AuthService,
        ErrorService
    ]
})
export class AppModule {

}
