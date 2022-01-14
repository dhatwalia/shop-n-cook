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

const handleAuth = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate
    });
};

const handleError = (errorRes: any) => {
    let errorMessage = "Unknown Error";
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    else {
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = "Email already exists."; break;
            case 'EMAIL_NOT_FOUND': errorMessage = "Email does not exist."; break;
            case 'INVALID_PASSWORD': errorMessage = "Password did not match."; break;
            case 'MISSING_GRANT_TYPE': errorMessage = "Missing grant type."; break;
        }
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
};

// Don't provide root in ()
@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + this.apiKey, {
                email: signupAction.payload.email,
                password: signupAction.payload.password,
                returnSecureToken: true
            }).pipe(map(resData => {
                return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
                catchError(errorRes => {
                    return handleError(errorRes);
                }))
        })
    );

    @Effect()
    apiKey = environment.firebaseAPIKey;
    authLogin = this.actions$.pipe(ofType(AuthActions.LOGIN_START), switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + this.apiKey, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
        }).pipe(map(resData => {
            return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),
            catchError(errorRes => {
                return handleError(errorRes);
            }));
    })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS, AuthActions.LOGOUT), tap(() => {
        this.router.navigate(['/']);
    }));

    // $ is used for Observables
    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}
