import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { User } from './user.model';
import { Http, Response, Headers } from '@angular/http';

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

    constructor(private http: Http) { }

    addUser(user: User) {
        this.users.push(user);
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('user', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    getUsers() {
        return this.users;
    }

    deleteUser(user: User) {
        this.users.splice(this.users.indexOf(user), 1);
    }

    signin(email: String, password:String) {
        const body = JSON.stringify({email: email, password: password});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}
