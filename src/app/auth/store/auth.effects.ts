import { HttpClient } from "@angular/common/http";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { switchMap, catchError, map, tap } from "rxjs/operators";
import * as AuthActions from './auth.actions';
import { environment } from "src/environments/environment";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;   // optional (?)
}

// Don't provide root in ()
@Injectable()
export class AuthEffects {
    @Effect()
    apiKey = environment.firebaseAPIKey;
    authLogin = this.actions$.pipe(ofType(AuthActions.LOGIN_START), switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + this.apiKey, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }).pipe(map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate
            });
        }),
            catchError(errorRes => {
                let errorMessage = "Unknown Error";
                if (!errorRes.error || !errorRes.error.error) {
                    return of(new AuthActions.LoginFail(errorMessage));
                }
                else {
                    switch (errorRes.error.error.message) {
                        case 'EMAIL_EXISTS': errorMessage = "Email already exists."; break;
                        case 'EMAIL_NOT_FOUND': errorMessage = "Email does not exist."; break;
                        case 'INVALID_PASSWORD': errorMessage = "Password did not match."; break;
                        case 'MISSING_GRANT_TYPE': errorMessage = "Missing grant type."; break;
                    }
                    return of(new AuthActions.LoginFail(errorMessage));
                }
            }));
    })
    );

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(ofType(AuthActions.LOGIN), tap(() => {
        this.router.navigate(['/']);
    }));

    // $ is used for Observables
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}
