import { Injectable, EventEmitter } from '@angular/core';
import { Error } from './error.model';


@Injectable()
export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        const errorData = new Error(error.title, error.error.message ? error.error.message : error.message);
        //console.log('Error Emitted from Service: ');
        //console.log(errorData);
        this.errorOccurred.emit(errorData);
    }

}
