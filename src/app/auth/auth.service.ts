import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

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
    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHg3pz_UyVem9m5BFERe8XB3gHJgfPK0U', {
            email: email,
            password: password,
            returnedSecureToken: true
        }).pipe(catchError(this.errorHandle));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://securetoken.googleapis.com/v1/token?key=AIzaSyBHg3pz_UyVem9m5BFERe8XB3gHJgfPK0U', {
            email: email,
            password: password,
            returnedSecureToken: true
        }).pipe(catchError(this.errorHandle));
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
}