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
  selector: 'front-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './front-header.component.html',
  styleUrls: ['./front-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FrontHeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  firstName = '';
  userId: number | null = null;

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      const user = this.tokenService.getDecodedToken();
      this.firstName = user?.firstname || 'Guest';
      this.userId = user?.id ?? null;
    }
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/authentication/login']);
  }

  goToProfile(): void {
    if (this.userId) {
      this.router.navigate([`/user/${this.userId}/profile`]);
    }
  }

  isLoggedIn(): boolean {
    return this.tokenService.getToken() !== null;
  }
}