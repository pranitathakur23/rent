import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { RentService } from '../rent.service';

@Component({
  selector: 'app-rent-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './rent-list.component.html',
})
export class RentListComponent implements OnInit {
  rentData: any[] = []; // Original rent data
  filteredRentData: any[] = []; // Data to display after filtering
  showCreateRentAgreement = false; // Flag to control showing the rent form
  searchTerm: string = ''; // Search input binding
  itemsPerPage: number = 10; // Default to 10, or use undefined if you want to trigger the placeholder
  itemsPerPageOptions: number[] = [5, 10, 15, 20]; // Options for items per page
  currentPage: number = 1; // Current page number
  sortOrder: boolean = true; // True for ascending, False for descending
// Expose Math to the template
Math = Math;
type: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private http: HttpClient,
    private rentService: RentService
  ) {        this.itemsPerPage = 10; // Uncomment this line if you want to set a default value.
    // Default to 10 if you prefer
  }

  ngOnInit(): void {
     // Retrieve the type parameter from the route query params
     this.route.queryParams.subscribe((params) => {
      this.type = params['type'] || null;
      console.log('Card type clicked:', this.type);

      // Perform filtering or logic based on the type
      if (this.type === 'type1') {
        console.log('Filter for Expiring Agreements');
        this.filterExpiringAgreements();
      } else if (this.type === 'type2') {
        console.log('Filter for Total Increments');
        this.filterTotalIncrements();
      }
    });
    this.getRentAgreementList(); // Fetch data on component load
  }

  // Fetch rent agreements from API
  getRentAgreementList(): void {
    const url = '/api/api/RentAgreeMent/GetRentAgreeMentList';
    const body = { type: "0" };
    this.http.post<any>(url, body).subscribe(
        (response) => {
          if (response.status) {
            this.rentData = response.data;
            this.filteredRentData = [...this.rentData]; // Set filtered data
          } else {
            console.error(
              'Failed to fetch rent agreement list:',
              response.message
            );
          }
        },
        (error) => {
          console.error('Error fetching rent agreements:', error);
        }
      );
  }
 // Filter for Expiring Agreements
 filterExpiringAgreements(): void {
  this.filteredRentData = this.rentData.filter(
    (item) => item.rentstatus === 'Expiring Soon' // Adjust condition as per your API data
  );
}

// Filter for Total Increments
filterTotalIncrements(): void {
  this.filteredRentData = this.rentData.filter(
    (item) => item.incrementAmount > 0 // Adjust condition as per your API data
  );
}
  // Navigate to create-rent page or edit a rent agreement
  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  // Delete a rent agreement by ID
  deletedata(deleteId: number): void {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const apiUrl = '/api/api/rent/Delete';
      const body = { id: deleteId };

      this.http.post<any>(apiUrl, body).subscribe(
        (response) => {
          if (response.status) {
            this.rentData = this.rentData.filter(
              (item) => item.ID !== deleteId
            );
            this.filteredRentData = [...this.rentData];
          } else {
            console.error('Failed to delete rent agreement:', response.message);
          }
        },
        (error) => {
          console.error('Error deleting rent agreement:', error);
        }
      );
    }
  }

  // Handle row click to edit a rent agreement
  handleRowClick(id: number): void {
    this.router.navigate(['/layout/create-rent', id]); // Navigating with 'layout' as parent
  }
  // Filter rent data based on search term
  filterData(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRentData = this.rentData.filter(
      (item) =>
        item.srno?.toString().includes(term) || // Filter by SrNo
        item.landLordName?.toLowerCase().includes(term) ||
        item.landLordEmail?.toLowerCase().includes(term) ||
        item.landLordMobileNo?.toString().includes(term) ||
        item.Branch?.toLowerCase().includes(term) ||
        item.stateName?.toLowerCase().includes(term) ||
        item.depositeAmnt?.toString().includes(term) ||
        item.rentstatus?.toLowerCase().includes(term)
    );
  }

  // Sort data by the specified column
  sortData(column: string): void {
    this.sortOrder = !this.sortOrder;
    const direction = this.sortOrder ? 1 : -1;

    this.filteredRentData.sort((a, b) => {
      if (a[column] < b[column]) return -1 * direction;
      if (a[column] > b[column]) return 1 * direction;
      return 0;
    });
  }

  // Handle items per page change and reset to the first page
  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }
}
