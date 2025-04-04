import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
    selector: 'front-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule],
    templateUrl: './front-topstrip.component.html',
})
export class FrontTopstripComponent {
    constructor() { }

}
