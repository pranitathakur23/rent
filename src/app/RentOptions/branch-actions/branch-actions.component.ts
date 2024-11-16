import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
interface RentOption {
  ID: number;
  RentMasterID: number;
  Branch: string;
  YearMonth: string;
  Name: string;
  id: number;

}

@Component({
  selector: 'app-branch-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-actions.component.html',
  styleUrls: ['./branch-actions.component.css']
})
export class BranchActionsComponent implements OnInit {
  rentMasterOptions: { RentID: number; LandLordName: string }[] = [];
  actionOptions: { Code: number; Name: string }[] = [];
  rentOptions: RentOption[] = [];
  // Properties to hold selected values
  selectedRentMasterID: number | null = null;
  selectedBranch: string = ''; // Assuming the branch name comes from rentMasterOptions
  selectedDate: string = ''; // Date in 'YYYY-MM-DD' format
  selectedRemarkID: number | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRentMasterOptions();
    this.fetchActionOptions();
    this.fetchRentOptions();
    this.onSelectionChange();

  }

  fetchRentMasterOptions(): void {
    const url = '/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 5 };

    this.http.post<any>(url, body).subscribe(
      response => {
        if (response.status) {
          this.rentMasterOptions = response.data;

        } else {
          console.error('Failed to fetch rent master options');
        }
      },
      error => {
        console.error('Error fetching rent master options:', error);
      }
    );
  }

  fetchActionOptions(): void {
    const url = '/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 6 };

    this.http.post<any>(url, body).subscribe(
      response => {
        if (response.status) {
          this.actionOptions = response.data;
        } else {
          console.error('Failed to fetch action options');
        }
      },
      error => {
        console.error('Error fetching action options:', error);
      }
    );
  }

  fetchRentOptions() {
    this.http.get<{ status: boolean; data: RentOption[] }>('/api/rent/getRentOptionDetails')
      .subscribe(response => {
        if (response.status) {
          this.rentOptions = response.data;
          console.log('Fetched Rent Options:', this.rentOptions); // Log the fetched data

        }
      });
  }
 // Define your existing methods like fetchRentMasterOptions, fetchActionOptions, etc.

 onSelectionChange(): void {
  console.log('Selected Rent Master ID:', this.selectedRentMasterID);
  console.log('Selected Branch:', this.getBranchName(this.selectedRentMasterID));
  console.log('Selected Date:', this.selectedDate);
  console.log('Selected Remark ID:', this.selectedRemarkID);
}
// Helper function to get the branch name based on RentID
getBranchName(rentMasterID: number | null): string {
  const selectedOption = this.rentMasterOptions.find(option => option.RentID === rentMasterID);
  return selectedOption ? selectedOption.LandLordName : '';
}


   // Deleting rent option by ID
 // Deleting rent option by ID
 deleteRentOption(id: number) {
  const url = '/api/rent/deleteRentOptionDetails';
  const body = { id }; // Prepare the request body with the ID to delete

  // Call the delete API
  this.http.post<any>(url, body).subscribe(
    (response) => {
      if (response.status) {
        // On success, remove the deleted option from the list
        this.rentOptions = this.rentOptions.filter(option => option.ID !== id); // Use 'ID' as the key
        alert(response.message); // Show success message
        this.fetchRentOptions(); // Re-fetch to update the list
      } else {
        alert('Failed to delete rent option');
      }
    },
    (error) => {
      console.error('Error:', error);
      alert('An error occurred while deleting the rent option');
    }
  );
}
}
