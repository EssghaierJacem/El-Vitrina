import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { navItems } from './sidebar-data';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppNavItemComponent } from './nav-item/nav-item.component';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    BrandingComponent, 
    TablerIconsModule, 
    MaterialModule, 
    RouterModule,
    MatIconModule,
    NgScrollbarModule,
    AppNavItemComponent,
    MatListModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  navItems = navItems;
}
