import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { GoogleChartInterface, Ng2GoogleChartsModule } from 'ng2-google-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Ng2GoogleChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  public geoChart: GoogleChartInterface | null = null;

  activeTab: number = 1;
  selectedState: any = null;

  indiaStates = [
    { name: 'Maharashtra', rent: 45000 },
    { name: 'Gujarat', rent: 30000 },
    { name: 'Delhi', rent: 25000 },
    { name: 'Karnataka', rent: 15000 },
    { name: 'Tamil Nadu', rent: 20000 },
    // Add more states as required
  ];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Check if we are in the browser before initializing the chart
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
  }

  initializeChart() {
    this.geoChart = {
      chartType: 'GeoChart',
      dataTable: [
        ['State', 'Total Rent'],
        ['Maharashtra', 45000],
        ['Gujarat', 30000],
        ['Delhi', 25000],
        ['Karnataka', 15000],
        ['Tamil Nadu', 20000],
      ],
      options: {
        region: 'IN', // India map
        displayMode: 'regions',
        resolution: 'provinces',
        colorAxis: { colors: ['#e0f7fa', '#006064'] }, // Customize chart colors
      },
    };
  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  showRentDetails(state: any) {
    this.selectedState = state;
  }

  navigateToRentList(): void {
    this.router.navigate(['/layout/rent-list']);
  }
}
