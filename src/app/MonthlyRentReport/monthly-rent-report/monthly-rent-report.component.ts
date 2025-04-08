import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import * as XLSX from 'xlsx';  // Import the xlsx library

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
  branchStatus: { ID: number; Status: string }[] = [];
  selectedBranchStatus: number | null = null;
  tableData: any[] = [];
  columnNames: string[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBranchStatus();
    this.getStateDropdownData();
  }

  getStateDropdownData(): void {
    const url = '/api/api/RentAgreeMent/GetDropDownData';
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

    const url = '/api/api/RentAgreeMent/GetDropDownData';
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
    if (
      !this.fromDate ||
      !this.toDate ||
      !this.selectedState ||
      !this.selectedBranch ||
      this.selectedBranchStatus === null
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const branchStatusValue = Number(this.selectedBranchStatus);
    const payload = {
      fromdate: this.fromDate,
      todate: this.toDate,
      state: this.selectedState,
      branch: this.selectedBranch,
      branchstatus: branchStatusValue == 1,
    };
  
    const url = '/api/api/RentAgreeMent/SubmitMonthlyReport';
    this.http.post<any>(url, payload).subscribe(
      (response) => {
        if (response.status === true) {
          this.tableData = response.data;
  
          if (this.tableData && this.tableData.length > 0) {
            this.columnNames = Object.keys(this.tableData[0]);
          }
        } else {
          console.error('Something went wrong');
        }
      },
      (error) => {
        console.error('Error saving data:', error);
      }
    );
  }
  

  fetchBranchStatus(): void {
    const url = '/api/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 7 };

    this.http.post<any>(url, body).subscribe(
      response => {
        if (response.status) {
          this.branchStatus = response.data;

        } else {
          console.error('Failed to fetch rent master options');
        }
      },
      error => {
        console.error('Error fetching rent master options:', error);
      }
    );
  }

   // Export to Excel function
   exportToExcel(): void {
    if (this.tableData && this.tableData.length > 0) {
      const columnNames = Object.keys(this.tableData[0]);
  
      const formattedData = this.tableData.map(item => {
        const row: any = {};
        columnNames.forEach(col => {
          row[col] = item[col] || '-'; 
        });
        return row;
      });
  
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Monthly Rent Report');
      
      XLSX.writeFile(wb, 'monthly_rent_report.xlsx');
    } else {
      console.error('No data available for export');
    }
  }
  
}
