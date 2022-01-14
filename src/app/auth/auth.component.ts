import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";
import { AuthResponseData } from "./store/auth.effects";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(private store: Store<fromApp.AppState>) { }

    ngOnInit(): void {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid)
            return;

        const email = authForm.value.email;
        const password = authForm.value.password;

        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }));
        }
        else {
            this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password }));
        }

        authForm.reset();
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy() {
        if (this.closeSub)
            this.closeSub.unsubscribe();
        if (this.storeSub)
            this.storeSub.unsubscribe();
    }
}
