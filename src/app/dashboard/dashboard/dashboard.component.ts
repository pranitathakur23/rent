import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    DashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {}

  activeTab: number = 1; // Default active tab
 // Method to set the active tab
 selectedState: any = null;

  indiaStates = [
    { name: 'Maharashtra', path: 'M ... Z', rent: 45000 },
    { name: 'Gujarat', path: 'M ... Z', rent: 30000 },
    { name: 'Delhi', path: 'M ... Z', rent: 25000 },
    // Add more states as required
  ];
 setActiveTab(tab: number) {
  this.activeTab = tab;
}
  showRentDetails(state: any) {
    this.selectedState = state;
  }
// Method to navigate to rent-list
navigateToRentList(): void {
  this.router.navigate(['/layout/rent-list']);
}
}
