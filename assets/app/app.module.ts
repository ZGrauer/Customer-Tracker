import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { CustomerComponent } from './customers/customer.component';

@NgModule({
    declarations: [
        AppComponent,
        CustomerComponent
    ],
    imports: [BrowserModule],
    bootstrap: [AppComponent]
})
export class AppModule {

}
