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

 
  }

  // Fetch rent agreements from API
  getRentAgreementList(): void {

    this.http.get<{ status: boolean; data: any[]; message: string }>('/api/RentAgreeMent/GetRentAgreeMentList')
      .subscribe(response => {
        if (response.status== true) {
          this.filteredRentData = response.data;
            } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
  });
  }


  // Handle adding new rent agreements
  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }



  // Cancel the create rent agreement action
  onCancel(): void {
    this.showCreateRentAgreement = false;
  }

   deletedata(deleteid: number) {
    if(window.confirm('Are sure you want to delete this item ?')){
      const apiUrl = '/api/rent/Delete';  // Note the relative path 
      const body = { id: deleteid };
       this.http.post<any>(apiUrl, body).subscribe(
        (response: any) => {
          if (response.status==true) {
            location.reload();
                 } else {
            console.error('Failed to fetch rent agreement list:', response.message);
          }
        }, error => {
          console.error('Error fetching rent agreement list:', error);
        });
     }
  }


  handleRowClick(id: number) {
    this.router.navigate(['/layout/create-rent', id]);
    debugger
  }
}
