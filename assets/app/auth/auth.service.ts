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
        return this.http.get('user')
            .map((response: Response) => {
                const users = response.json().obj;
                let transformedUsers: User[] = [];
                for (let user of users) {
                    console.log('Received: ');
                    console.log(user);
                    transformedUsers.push(new User(
                        user.firstName,
                        user.lastName,
                        '',
                        user.email,
                        user.admin,
                        user.deleted,
                        user._id
                    ));
                }
                this.users = transformedUsers;
                console.log(transformedUsers);
                return transformedUsers;
            })
            .catch((error: Response) => Observable.throw('Error in Auth Service! ' + error.text));
    }

    getUserId(): String {
        return localStorage.getItem('userId');
    }

    deleteUser(user: User) {
        this.users.splice(this.users.indexOf(user), 1);
    }

    updatePassword(oldPassword: String, newPassword: String) {
        const body = JSON.stringify({
            _userId: localStorage.getItem('userId'),
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.patch('user/changePassword', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    signin(email: String, password: String) {
        const body = JSON.stringify({ email: email, password: password });
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('user/signin', body, { headers: headers })
            .map((response: Response) => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn(): Boolean {
        return localStorage.getItem('token') !== null;
    }

    isAdmin(): Boolean {
        return localStorage.getItem('admin');
    }

    isDeleted(): Boolean {
        return localStorage.getItem('deleted');
    }

}
