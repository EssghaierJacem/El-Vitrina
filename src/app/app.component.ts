import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomOrderCreateComponent } from "./main-components/custom-order/custom-order-create/custom-order-create.component";
import { CustomOrderEditComponent } from "./main-components/custom-order/custom-order-edit/custom-order-edit.component";
import { CustomOrderListComponent } from "./main-components/custom-order/custom-order-list/custom-order-list.component";
import { CustomOrderViewComponent } from "./main-components/custom-order/custom-order-view/custom-order-view.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CustomOrderCreateComponent, CustomOrderListComponent, CustomOrderViewComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'El Vitrina - Dashboard';
}
