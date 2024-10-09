import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [NgFor]
})
export class SidebarComponent {
  constructor(private router: Router) {} // Inject Router

  menuItems = [
    { icon: 'fas fa-tachometer-alt', label: 'Dashboard', route: '/layout/dashboard' }, // Correct route for Dashboard
    { icon: 'fas fa-file-alt', label: 'Rent Management', route: '/layout/rent-list' },
    { icon: 'fas fa-upload', label: 'UTR Upload', route: '/layout/utr-upload' },
    { icon: 'fas fa-chart-bar', label: 'Monthly Rent Report', route: '/layout/monthly-rent-report' },
    { icon: 'fas fa-cogs', label: 'Rent Options', route: '/layout/branch-actions' },
    { icon: 'fas fa-file-invoice-dollar', label: 'Branch Statement', route: '/layout/branch-statement' }
  ];

  // Method to navigate to the clicked route
  onMenuItemClick(route: string) {
    this.router.navigate([route]);
  }
}
