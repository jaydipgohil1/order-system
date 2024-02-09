import { Component, ElementRef, Renderer2, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('dashboardNav', { static: false }) dashboardNav!: ElementRef;

  mobileScreen: MediaQueryList;
  isLogin: boolean = true;
  isDashboardNavShown: boolean = false;
  isMobileScreen: boolean = window.innerWidth <= 990;
  mainTitle = '';

  constructor(private renderer: Renderer2, private authService: AuthService, private router: Router, private sharedService: SharedService) {
    this.mobileScreen = window.matchMedia("(max-width: 990px)");
  }

  ngOnInit() {
    this.authService.isAuthentic$.subscribe(auth => {
      this.isLogin = auth;
    })

    this.sharedService.mainTitle$.subscribe(title => {
      this.mainTitle = title;
    })

    this.isLogin = localStorage.getItem('token') ? true : false;
  }

  ngAfterViewInit() {
    const dropdownToggles = document.querySelectorAll(".dashboard-nav-dropdown-toggle");
    dropdownToggles.forEach(toggle => {
      this.renderer?.listen(toggle, 'click', () => {
        const closestDropdown = toggle.closest(".dashboard-nav-dropdown");
        this.renderer.addClass(closestDropdown, "show");
        closestDropdown?.querySelectorAll(".dashboard-nav-dropdown").forEach(dropdown => {
          this.renderer.removeClass(dropdown, "show");
        });
        this.getSiblings(toggle.parentNode).forEach(sibling => {
          this.renderer.removeClass(sibling, "show");
        });
      });
    });

    // this.renderer?.listen(document.querySelector(".menu-toggle"), 'click', () => {
    //   if (this.mobileScreen.matches) {
    //     this.renderer.addClass(this.dashboardNav.nativeElement, "mobile-show");
    //   } else {
    //     this.renderer.removeClass(document.querySelector(".dashboard"), "dashboard-compact");
    //   }
    // });
  }

  // Helper function to get siblings
  getSiblings(elem: any) {
    const siblings = [];
    let sibling = elem.parentNode.firstChild;
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== elem) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    return siblings;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobileScreen = window.innerWidth <= 990;
  }

  toggleDashboardNav() {
    this.isDashboardNavShown = !this.isDashboardNavShown;
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/log-in']);
    this.authService.setIsAuthentic(false);
  }
}
