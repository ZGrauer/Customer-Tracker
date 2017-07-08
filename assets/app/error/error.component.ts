import { Component, OnInit } from '@angular/core';
import { ErrorService } from './error.service';
import { Error } from './error.model';
import { Message } from 'primeng/primeng';
import '../../../node_modules/primeng/resources/themes/omega/theme.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/stylesheets/font-awesome-4.7.0/css/font-awesome.min.css';

@Component({
    selector: 'app-error',
    template: `
        <p-growl [(value)]="msgs"></p-growl>
    `
})
export class ErrorComponent implements OnInit {
    error: Error;
    msgs: Message[] = [];

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorService.errorOccurred
            .subscribe(
                (error: Error) => {
                    console.log('Error received by ErrorComponent: ');
                    console.log(error);
                    this.error = error;
                    this.showError();
                }
            );
    }

    showError() {
        var severity: string = '';
        if (this.error.title == 'Error' || this.error.title == 'Success') {
            severity = this.error.title.toLowerCase();
        } else {
            severity = 'info';
        }

        this.msgs.push({ severity: severity, summary: this.error.title, detail: this.error.message });
    }

    clear() {
        this.msgs = [];
    }
}
