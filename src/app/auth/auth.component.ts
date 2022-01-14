import { Component, ComponentFactoryResolver, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>,
        private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnInit(): void {
        this.store.select('auth').subscribe(authState => {
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
        this.error = null;
    }

    ngOnDestroy() {
        if (this.closeSub)
            this.closeSub.unsubscribe();
    }
}
