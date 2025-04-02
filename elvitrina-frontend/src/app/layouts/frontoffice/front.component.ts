import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CoreService } from 'src/app/services/core.service';
import { FrontHeaderComponent } from './header/front-header.component';
import { FrontTopstripComponent } from './top-strip/front-topstrip.component';
import { RouterModule } from '@angular/router';
import { AppNavItemComponent } from '../full/sidebar/nav-item/nav-item.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../full/sidebar/sidebar.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';

@Component({
  selector: 'app-front',
  imports: [
    FrontHeaderComponent,
    FrontTopstripComponent,
    RouterModule,
    AppNavItemComponent,
    MaterialModule,
    CommonModule,
    SidebarComponent,
    NgScrollbarModule,
    TablerIconsModule,
 ],
  templateUrl: './front.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class FrontComponent implements OnInit {
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private options = this.settings.getOptions();

  @ViewChild('content', { static: true }) content: any;

  constructor(
    private settings: CoreService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW])
      .subscribe((state) => {
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
      });

    // this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     this.content.scrollTo({ top: 0 });
    //   });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }
}
