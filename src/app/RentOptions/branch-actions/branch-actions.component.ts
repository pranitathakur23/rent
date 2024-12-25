import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here

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
  imports: [CommonModule,FormsModule],
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
  }

  fetchRentMasterOptions(): void {
    const url = '/api/RentAgreeMent/GetDropDownData';
    const body = { Mode: 5 };
  
    this.http.post<any>(url, body).subscribe(
      response => {
        if (response.status) {
          this.rentMasterOptions = response.data;
          console.log('Fetched Rent Master Options:', this.rentMasterOptions);  // Log the fetched data
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
  onSave(): void {
    // Hardcoded branch name as "Vashi-Priti"
    const branchName = 'Vashi-Priti';
  
    // Prepare the data for the API request
    const saveData = {
      rentMasterID: this.selectedRentMasterID, // Use the selected Rent Master ID
      Branch: branchName, // Hardcoded Branch
      date: this.selectedDate, // Date selected by the user
      remarkID: this.selectedRemarkID // Remark ID selected by the user
    };
    console.log('Fetc', saveData); // Log the fetched data

    // Call the save API
    const url = '/api/rent/SaveRentOptionDetails';
    this.http.post<any>(url, saveData).subscribe(
      response => {
        if (response.status == true) {
          console.log('Save successful:', response.data);
          // Optionally, you can refresh the rent options after saving
          this.fetchRentOptions();
        } else {
          alert('Failed to save rent option');
        }
      },
      error => {
        console.error('Error saving rent option:', error);
        alert('An error occurred while saving the rent option');
      }
    );
  }
  

// Helper function to get the branch name based on RentID
getBranchName(rentMasterID: number | null): string {
  // Only return the LandLordName if RentID exists
  const selectedOption = this.rentMasterOptions.find(option => option.RentID === rentMasterID);
  
  // If the RentMasterID is found, return the LandLordName, otherwise return an empty string
  return selectedOption ? selectedOption.LandLordName : '';
}


deleteRentOption(id: number) {
  // Show confirmation prompt before proceeding with the deletion
  const confirmDelete = window.confirm('Are you sure you want to delete this rent option?');
  
  if (confirmDelete) {
    const url = '/api/rent/deleteRentOptionDetails';
    const body = { id }; // Prepare the request body with the ID to delete

    // Call the delete API
    this.http.post<any>(url, body).subscribe(
      (response) => {
        if (response.status) {
          // On success, remove the deleted option from the list
          this.rentOptions = this.rentOptions.filter(option => option.ID !== id); // Use 'ID' as the key
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
  } else {
    console.log('Deletion cancelled');
  }
}


}
