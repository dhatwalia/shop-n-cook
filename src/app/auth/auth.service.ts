import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "src/environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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
    apiKey = environment.firebaseAPIKey;
    private tokenExpTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + this.apiKey, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.errorHandle), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + this.apiKey, {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.errorHandle), tap(resData => {
            this.handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData)
            return;

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            this.store.dispatch(new AuthActions.AuthenticateSuccess({ email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate) }));
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpTimer)
            clearTimeout(this.tokenExpTimer);
        this.tokenExpTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
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
        this.store.dispatch(new AuthActions.AuthenticateSuccess({ email: email, userId: userId, token: token, expirationDate: expirationDate }));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }
}