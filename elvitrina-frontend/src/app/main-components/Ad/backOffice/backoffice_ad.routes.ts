import { Routes } from "@angular/router";
import { AdApprovalListComponent } from "./ad-approval-list/ad-approval-list.component";


export const AdAdmin: Routes = [
    { path: 'admin/ads', component: AdApprovalListComponent }
];  
