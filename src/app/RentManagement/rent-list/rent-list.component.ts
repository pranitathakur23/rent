import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs';
import { RentService } from '../rent.service';
@Component({
  selector: 'app-rent-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rent-list.component.html',
})
export class RentListComponent implements OnInit { // Implement OnInit
  rentData: any[] = []; // Initialize rentData as an empty array
  showCreateRentAgreement = false;

  // Define form fields (unchanged)
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

  constructor(private router: Router, private http: HttpClient, private rentservice:RentService) { } // Inject HttpClient

  ngOnInit(): void {
    this.getRentAgreementList(); // Fetch rent agreements on component initialization

      // Listen for refresh trigger from the service
      this.rentservice.refreshList$.subscribe(() => {
        this.getRentAgreementList();  // Refresh rent agreements
      });
      
    }
  

  getRentAgreementList(): void {
    this.http.get<{ status: boolean; data: any[]; message: string }>('/api/RentAgreeMent/GetRentAgreeMentList')
      .subscribe(response => {
        if (response.status) {
          this.rentData = response.data.map(item => ({
            branch: item.Branch, // Replace with actual branch name if needed
            landlordName: item.landLordName,
            email: item.landLordEmail,
            mobile: item.landLordMobileNo,
            deposit: item.depositeAmnt,
          }));
          console.log('Rent Data:', this.rentData);

        } else {
          console.error('Failed to fetch rent agreement list:', response.message);
        }
      }, error => {
        console.error('Error fetching rent agreement list:', error);
      });
  }

  onAdd(): void {
    this.router.navigate(['/layout/create-rent']);
  }

  onCreate(): void {
    let allFieldsFilled = true;
    for (let key in this.formFields) {
      if (!this.formFields[key]) {
        allFieldsFilled = false;
        document.getElementById(key)?.classList.add('is-invalid');
      } else {
        document.getElementById(key)?.classList.remove('is-invalid');
      }
    }

    if (!allFieldsFilled) {
      alert('All fields are mandatory!');
    } else {
      alert('Form submitted successfully!');
    }
  }

  onCancel(): void {
    this.showCreateRentAgreement = false;
  }
  onEdit(rentItem: any) {
    const randomId = Math.floor(Math.random() * 15) + 1; // Generates a number from 1 to 15
    const id = randomId.toString(); 
        this.router.navigate(['layout/create-rent', id]); // Adjust the route path as needed
   
}
  onAttach(): void {
    console.log('Attach button clicked');
  }
}
