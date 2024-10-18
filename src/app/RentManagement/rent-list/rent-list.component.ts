import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  showCreateRentAgreement = false;
  searchTerm: string = ''; // Search input binding
  currentPage: number = 1; // For pagination
  itemsPerPage: number = 10; // Default items per page
  itemsPerPageOptions: number[] = [10, 20, 30, 50]; // Options for items per page

  // Form fields with default empty values
  formFields: { [key: string]: string } = {
    bank: '',
    state: '',
    district: '',
    branch: '',
    landlordName: '',
    landlordEmail: '',
    accountNo: '',
    confirmAccountNo: '',
    landlordMobile: '',
    ifscCode: '',
    depositAmount: '',
    utrReferenceNo: '',
    depositDate: '',
    remark: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private rentservice: RentService
  ) {}

  ngOnInit(): void {
    this.getRentAgreementList(); // Fetch data on initialization

    // Listen for refresh trigger from service
    this.rentservice.refreshList$.subscribe(() => {
      this.getRentAgreementList();
    });
  }

  // Fetch rent agreements from API
  getRentAgreementList(): void {
    this.http
      .get<{ status: boolean; data: any[]; message: string }>(
        '/api/RentAgreeMent/GetRentAgreeMentList'
      )
      .subscribe(
        (response) => {
          if (response.status == true) {
            this.rentData = response.data.map((item) => ({
              branch: item.Branch,
              landlordName: item.landLordName,
              email: item.landLordEmail,
              mobile: item.landLordMobileNo,
              deposit: item.depositeAmnt,
            }));
            this.filteredRentData = [...this.rentData]; // Initialize with full data
          } else {
            console.error(
              'Failed to fetch rent agreement list:',
              response.message
            );
          }
        },
        (error) => {
          console.error('Error fetching rent agreement list:', error);
        }
      );
  }

  // Filter rent data based on search term
  filterRentData(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredRentData = this.rentData.filter(
      (item) =>
        item.landlordName.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.mobile.includes(this.searchTerm) // Add more fields if needed
    );
    this.currentPage = 1; // Reset to first page on search
  }

  // Handle adding new rent agreements
  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  // Handle form submission with validation
  onCreate(): void {
    let allFieldsFilled = true;
    for (const key in this.formFields) {
      const inputElement = document.getElementById(key);
      if (!this.formFields[key]) {
        allFieldsFilled = false;
        inputElement?.classList.add('is-invalid');
      } else {
        inputElement?.classList.remove('is-invalid');
      }
    }

    if (!allFieldsFilled) {
      alert('All fields are mandatory!');
    } else {
      alert('Form submitted successfully!');
    }
  }

  // Cancel the create rent agreement action
  onCancel(): void {
    this.showCreateRentAgreement = false;
  }

  // Navigate to edit rent agreement with random ID
  onEdit(rentItem: any): void {
    const randomId = Math.floor(Math.random() * 15) + 1;
    this.router.navigate(['layout/create-rent', randomId.toString()]);
  }

  // Handle attachment button click
  onAttach(): void {
    console.log('Attach button clicked');
  }
}
