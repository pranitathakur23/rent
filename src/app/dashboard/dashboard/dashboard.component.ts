// dashboard.component.ts
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { GoogleChartInterface, Ng2GoogleChartsModule } from 'ng2-google-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Ng2GoogleChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  public geoChart: GoogleChartInterface | null = null;
  activeTab: number = 1;
  selectedState: any = null;

  // API response properties
  totalRent: number = 0;
  securityDeposit: number = 0;
  averageRent: number = 0;
  totalBranches: number = 0;
  expiringAgreements: number = 0;
  totalIncrements: number = 0;

  indiaStates = [
    { name: 'Maharashtra', rent: 45000 },
    { name: 'Gujarat', rent: 30000 },
    { name: 'Delhi', rent: 25000 },
    { name: 'Karnataka', rent: 15000 },
    { name: 'Tamil Nadu', rent: 20000 },
    // Add more states as required
  ];

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();

    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
  }

  fetchDashboardData(): void {
    const apiUrl = '/api/RentAgreeMent/DashboardCount';

    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        if (response.status == true) {
          const data = response.data[0];
          this.totalRent = data.TotalRent || 0;
          this.securityDeposit = data.SecurityDeposit || 0;
          this.averageRent = data.AverageRent || 0;
          this.totalBranches = data.TotalBranches || 0;
          this.expiringAgreements = data.ExpiringAgreement || 0;
          this.totalIncrements = data.totalIncrement || 0;
        }
      },
      (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  initializeChart(): void {
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

  setActiveTab(tab: number): void {
    this.activeTab = tab;
  }

  navigateToRentList(): void {
    this.router.navigate(['/layout/rent-list']);
  }
}
