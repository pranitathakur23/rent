import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-monthly-rent-report',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './monthly-rent-report.component.html',
  styleUrls: ['./monthly-rent-report.component.css']
})
export class MonthlyRentReportComponent implements OnInit {
  states: { stateCode: number; stateName: string }[] = [];
  branches: { branchCode: number; branchName: string }[] = [];
  selectedState: number | null = null;
  selectedBranch: string | null = null;
  fromDate: string = '';
  toDate: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getStateDropdownData();
  }

  getStateDropdownData(): void {
    const url = '/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 2 };

    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.status == true) {
          this.states = response.data;
        } else {
          console.error('Failed to load state data:', response.message);
        }
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  onStateChange(): void {
    if (!this.selectedState) {
      this.branches = [];
      return;
    }

    const url = '/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 8, id: this.selectedState };

    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.status == true) {
          this.branches = response.data;
        } else {
          console.error('Failed to load branch data:', response.message);
        }
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  save(): void {
    const payload = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      state: this.selectedState,
      branch: this.selectedBranch
    };

    console.log('Form Data:', payload);

    // Add logic to send the data to the backend or process it
  }
}
