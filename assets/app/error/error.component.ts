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
    msg: Error;
    msgs: Message[] = [];

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorService.errorOccurred
            .subscribe(
                (msg: Error) => {
                    console.log('Error received by ErrorComponent: ');
                    console.log(msg);
                    this.msg = msg;
                    this.showMsg();
                }
            );
    }

    showMsg() {
        var severity: string = '';
        if (this.msg.title == 'Error' || this.msg.title == 'Success') {
            severity = this.msg.title.toLowerCase();
        } else {
            severity = 'info';
        }
        this.msgs.push({ severity: severity, summary: this.msg.title, detail: this.msg.message });
    }

    clear() {
        this.msgs = [];
    }
}
