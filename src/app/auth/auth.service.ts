import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";

interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHg3pz_UyVem9m5BFERe8XB3gHJgfPK0U', {
            email: email,
            password: password,
            returnedSecureToken: true
        }).pipe(catchError(errorRes => {
            let errorMessage = "Unknown Error";
            if (!errorRes.error || !errorRes.error.error) {
                // Do nothing
            }
            else {
                switch (errorRes.error.error.message) {
                    case 'EMAIL_EXISTS': errorMessage = "This email already exists";
                }
            }
            return throwError(errorMessage);
        }));
    }
}