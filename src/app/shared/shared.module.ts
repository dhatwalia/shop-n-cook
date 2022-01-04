import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropDownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropDownDirective,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        DropDownDirective,
        CommonModule,
    ],
    entryComponents: [AlertComponent]
})
export class SharedModule { }
