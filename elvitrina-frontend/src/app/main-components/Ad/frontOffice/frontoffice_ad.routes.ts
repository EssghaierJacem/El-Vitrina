import { Routes } from "@angular/router";
import { AdListComponent } from "./ad-list/ad-list.component";
import { AdSubmissionFormComponent } from "./ad-submission-form/ad-submission-form.component";

export const AdCreate: Routes = [
    { path: 'ads/submit', component: AdSubmissionFormComponent },
    { path: 'ads', component: AdListComponent }
];  
