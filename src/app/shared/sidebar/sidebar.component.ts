import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "./sidebar.service";
import * as $ from 'jquery';
import { LoginService } from 'src/app/core/services/login.service';
import Swal from 'sweetalert2'; // ✅ ADD THIS

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  public sortOrder: string = 'default';

  public originalMenuItems: any[] = [];
public searchText: string = '';
public progressFilter: string = 'all';
  public menuItems: any[] = [];
  public name: string = '';   // ✅ ADD THIS

  constructor(
    public sidebarservice: SidebarService,
    private router: Router,
    private loginService: LoginService
  ) {

    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (
        event instanceof NavigationEnd &&
        $(window).width() < 1025 &&
        (document.readyState == 'complete' || false)
      ) {
        this.toggleSidebar();
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        
      }
    });
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());

    if ($(".wrapper").hasClass("nav-collapsed")) {
      // unpin sidebar when hovered
      $(".wrapper").removeClass("nav-collapsed");
      $(".sidebar-wrapper").unbind("hover");
    } else {
      $(".wrapper").addClass("nav-collapsed");
      $(".sidebar-wrapper").hover(
        function () {
          $(".wrapper").addClass("sidebar-hovered");
        },
        function () {
          $(".wrapper").removeClass("sidebar-hovered");
        }
      );
    }
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  ngOnInit() {
    let sidebardata: any = null;

    if (localStorage.getItem('currentUser')) {
      sidebardata = JSON.parse(localStorage.getItem('currentUser')!);
    } else if (sessionStorage.getItem('currentUser')) {
      sidebardata = JSON.parse(sessionStorage.getItem('currentUser')!);
    }

    this.menuItems = sidebardata;

    this.originalMenuItems = [...this.menuItems];

    // ✅ SET USER NAME FROM STORED USER OBJECT
    if (sidebardata) {
      this.name =
        sidebardata.name ||
        sidebardata.user_name ||
        sidebardata.username ||
        ''; // adjust key if needed
    }

    $.getScript('./assets/js/app-sidebar.js');
    this.getmoduleslist();
  }

  naviagatetobooking() {
    this.router.navigate(['/dashboard/analysis']);
  }

  logoutAlert() {
    Swal.fire({
      title: 'Do You Want to Logout',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    this.loginService.logout();
  }

  getmoduleslist() {
   
    
    this.menuItems.forEach((item: any) => {
      let statusClass = '';
      let iconStatusClass = '';

      const progress = Number(item.progress);

      switch (progress) {
        case 0:
          statusClass = 'status-pending';
          iconStatusClass = 'icon-pending';
          break;

        case 1:
          statusClass = 'status-completed';
          iconStatusClass = 'icon-completed';
          break;

        case 2:
          statusClass = 'status-ongoing';
          iconStatusClass = 'icon-ongoing';
          break;

        default:
          statusClass = '';
          iconStatusClass = '';
      }

      item.class = `sub ${statusClass}`;
      item.iconStatusClass = iconStatusClass;
    });
  }
  // Add these to your sidebar component
isCollapsed   = false;   // tablet toggle
isMobileOpen  = false;   // mobile overlay


closeMobileSidebar(): void {
  this.isMobileOpen = false;
}

openedMenu: any = null;

toggleMenu(item: any, event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  this.openedMenu = this.openedMenu === item ? null : item;
}

sortMenuItems(order: string): void {
  this.sortOrder = order;

  if (order === 'default') {
    this.menuItems = [...this.originalMenuItems];
    return;
  }

  this.menuItems = [...this.menuItems].sort((a: any, b: any) => {
    const titleA = (a.title || '').toLowerCase();
    const titleB = (b.title || '').toLowerCase();

    return order === 'az'
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });
}

applyFilters(): void {
  let filtered = [...this.originalMenuItems];

  if (this.searchText.trim()) {
    const text = this.searchText.toLowerCase();

    filtered = filtered.filter((item: any) =>
      item.title?.toLowerCase().includes(text) ||
      item.submenu?.some((sub: any) =>
        sub.title?.toLowerCase().includes(text)
      )
    );
  }

  if (this.progressFilter !== 'all') {
    filtered = filtered.filter((item: any) =>
      String(item.progress) === this.progressFilter
    );
  }

  if (this.sortOrder === 'az') {
    filtered.sort((a: any, b: any) =>
      a.title.localeCompare(b.title)
    );
  }

  if (this.sortOrder === 'za') {
    filtered.sort((a: any, b: any) =>
      b.title.localeCompare(a.title)
    );
  }

  this.menuItems = filtered;
  this.getmoduleslist();
}
}
