import { Component, OnInit, ViewChild, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';  // Import DOCUMENT to access the DOM
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, Subscription } from 'rxjs';
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
import { FooterComponent } from './footer/footer.component';
import { AdService } from 'src/app/core/services/Ad/ad.service';
import { AdDisplayService } from 'src/app/core/services/Ad/AdDisplay.service';
import { NavigationEnd, Router } from '@angular/router';
import { AdDisplayComponent } from "../../main-components/Ad/frontOffice/ad-display/ad-display.component";
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
    FooterComponent,
    AdDisplayComponent
],
  templateUrl: './front.component.html',
  styleUrls: ['./style.scss'],
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
    private renderer: Renderer2,  // Inject Renderer2
    @Inject(DOCUMENT) private document: Document,  // Inject DOCUMENT to access the DOM
    private adService: AdService,
    private adDisplay: AdDisplayService
  ) {
    this.layoutChangesSubscription = this.breakpointObserver
      .observe([MOBILE_VIEW, TABLET_VIEW])
      .subscribe((state) => {
        this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
      });

    // Inject CSS and JS
    this.addExternalFiles();
  }

  ngOnInit(): void {
  

  }
 /* private showInterstitialOnNavigation() {
    this.adService.getActiveAds().subscribe(ads => {
      const interstitial = ads.find(ad => ad.displayType === 'INTERSTITIAL');
      if (interstitial) {
        this.adDisplay.showInterstitialAd(interstitial);
      }
    });
  }*/
  /*loadAds() {
    this.adService.getActiveAds().subscribe(ads => {
      this.adDisplay.showAds(ads);
    });
  }
    */
  ngOnDestroy() {
    this.layoutChangesSubscription.unsubscribe();
  }

  private addExternalFiles() {
    // Add CSS
    const cssLinks = [
      'assets/css/libs.bundle.css',
      'assets/css/theme.bundle.css'
    ];
    cssLinks.forEach((cssLink) => {
      const linkElement = this.renderer.createElement('link');
      this.renderer.setAttribute(linkElement, 'rel', 'stylesheet');
      this.renderer.setAttribute(linkElement, 'href', cssLink);
      this.renderer.appendChild(this.document.head, linkElement);
    });

    // Add JS
    const jsScripts = [
      'assets/js/vendor.bundle.js',
      'assets/js/theme.bundle.js'
    ];
    jsScripts.forEach((jsScript) => {
      const scriptElement = this.renderer.createElement('script');
      this.renderer.setAttribute(scriptElement, 'src', jsScript);
      this.renderer.setAttribute(scriptElement, 'type', 'text/javascript');
      this.renderer.appendChild(this.document.body, scriptElement);
    });
  }
}
