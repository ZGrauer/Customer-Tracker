import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { User } from './user.model';
import { Http, Response, Headers } from '@angular/http';
import { ErrorService } from '../error/error.service';

@Injectable()
export class AuthService {
    private users: User[] = [new User(
        'Zach',
        'Grauerholz',
        'Z@Sprint.com',
        'Test',
        true,
        false
    ),
        new User(
            'Tina',
            'Grauerholz',
            'T@Sprint.com',
            'Test',
            false,
            false
        )];

    constructor(private http: Http, private errorService: ErrorService) { }

    addUser(user: User) {
        this.users.push(user);
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('user', body, { headers: headers })
            .map((response: Response) => {
                console.log(response.json());
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getUsers() {
        return this.http.get('user')
            .map((response: Response) => {
                const users = response.json().obj;
                let transformedUsers: User[] = [];
                for (let user of users) {
                    //console.log('Received User: ');
                    //console.log(user);
                    transformedUsers.push(new User(
                        user.firstName,
                        user.lastName,
                        user.email,
                        '',
                        user.admin,
                        user.deleted,
                        user._id
                    ));
                }
                this.users = transformedUsers;
                //console.log(transformedUsers);
                return transformedUsers;
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getUserId(): String {
        return localStorage.getItem('userId');
    }

    deleteUser(user: User) {
        this.users.splice(this.users.indexOf(user), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.delete('user/' + user._id + token)
            .map((response: Response) => {
                //console.log(response);
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    updatePassword(oldPassword: String, newPassword: String) {
        const body = JSON.stringify({
            _userId: localStorage.getItem('userId'),
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.patch('user/changePassword', body, { headers: headers })
            .map((response: Response) => {
                //console.log(response);
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.log('Server Response in Service: ' + error);
                //console.error();
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    updateUser(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch('user/' + user._id + token, body, { headers: headers })
            .map((response: Response) => {
                console.log(response.json());
                this.errorService.handleError(response.json());
                return response.json();
            })
            .catch((error: Response) => {
                //console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(email: String, password: String) {
        const body = JSON.stringify({ email: email, password: password });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('user/signin', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                console.error(error);
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
        this.errorService.handleError({ title: 'Success', error: { message: 'Logged out' } });
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('token') !== null;
    }

    isAdmin(): boolean {
        return JSON.parse(localStorage.getItem('admin'));
    }

    isDeleted(): boolean {
        return JSON.parse(localStorage.getItem('deleted'));
    }

}
