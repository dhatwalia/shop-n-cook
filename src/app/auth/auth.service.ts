import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;   // optional (?)
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // Gets access to User even if only subscribe after that User has been emitted
    user = new BehaviorSubject<User>(null);

    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHg3pz_UyVem9m5BFERe8XB3gHJgfPK0U', {
            email: email,
            password: password,
            returnedSecureToken: true
        }).pipe(catchError(this.errorHandle), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://securetoken.googleapis.com/v1/token?key=AIzaSyBHg3pz_UyVem9m5BFERe8XB3gHJgfPK0U', {
            email: email,
            password: password,
            returnedSecureToken: true
        }).pipe(catchError(this.errorHandle), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    private errorHandle(errorRes: HttpErrorResponse) {
        let errorMessage = "Unknown Error";
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        else {
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS': errorMessage = "Email already exists."; break;
                case 'EMAIL_NOT_FOUND': errorMessage = "Email does not exist."; break;
                case 'INVALID_PASSWORD': errorMessage = "Password did not match."; break;
                case 'MISSING_GRANT_TYPE': errorMessage = "Missing grant type."; break;
            }
            return throwError(errorMessage);
        }
    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        // The outer Date converts mili-seconds to Date object
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }
}