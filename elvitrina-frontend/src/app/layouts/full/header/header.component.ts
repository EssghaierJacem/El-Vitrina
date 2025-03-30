import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  firstName = '';
  email = '';
  userId: number | null = null;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.tokenService.getDecodedToken();
    this.firstName = user?.firstname || '';
    this.email = user?.email || '';
    this.userId = user?.id ?? null;
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/authentication/login']);
  }
}
