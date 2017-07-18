import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

import { User } from './user.model';
import { ErrorService } from '../error/error.service';

@Injectable()
export class AuthService {
    private users: User[] = [];

    constructor(private http: Http, private errorService: ErrorService) { }


    /**
     * addUser - Adds a new user obejct to the database returns Observable response
     *
     * @param  {User} user: User New user object to add in database
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
    addUser(user: User) {
        user.email = user.email.toLowerCase();
        this.users.push(user);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        const body = JSON.stringify(user);
        const headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post('user' + token, body, { headers: headers })
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


    /**
     * getUsers - Returns all users built in the database
     *
     * @returns {Observable} Observable response from the server. User objects or error object
     */
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


    /**
     * getUserId - returns the current users database ID
     *
     * @returns {string} the mongo object ID of the logged in user
     */
    getUserId(): string {
        return localStorage.getItem('userId');
    }


    /**
     * deleteUser - deletes the passed in user from the database
     *
     * @param  {User} user: User description
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
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


    /**
     * updatePassword - Updates the current user's password in the database.
     *                  Password is verified & encryped on the server
     *
     * @param  {string} oldPassword: string description
     * @param  {string} newPassword: string description
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
    updatePassword(oldPassword: string, newPassword: string) {
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


    /**
     * updateUser - Updates the passed in user in the database.
     *              Only for Admins.  Can be used to reset anyone's password.
     *              Authorization is performed on the server
     *
     * @param  {User} user: User description
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
    updateUser(user: User) {
        user.email = user.email.toLowerCase();
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


    /**
     * signin - Logs a user in.  Server creates a jsonwebtoken for 8 hours
     *
     * @param  {string} email: string    Email address of user
     * @param  {string} password: plain text user password
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
    signin(email: string, password: string) {
        email = email.toLowerCase();
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


    /**
     * logout - Logs out a user by clearing the locally stored token
     *
     * @returns {Observable} Observable response from the server. Success or Error to be displayed in Growl
     */
    logout() {
        localStorage.clear();
        this.errorService.handleError({ title: 'Success', error: { message: 'Logged out' } });
    }


    /**
     * logout - Checks if the user is logged in and has a token
     *
     * @returns {boolean} boolean response if the user has a token or not
     */
    isLoggedIn(): boolean {
        return localStorage.getItem('token') !== null;
    }

    /**
     * isAdmin - Checks if the user is an Admin
     *
     * @returns {boolean} boolean response if the user is an admin or not
     */
    isAdmin(): boolean {
        return JSON.parse(localStorage.getItem('admin'));
    }

    /**
     * isDeleted - Checks if the user is "deleted" in the database
     *
     * @returns {boolean} boolean response if the user can login or not
     */
    isDeleted(): boolean {
        return JSON.parse(localStorage.getItem('deleted'));
    }

}
