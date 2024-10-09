import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router } from '@angular/router';

@Component({
  selector: 'app-rent-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './rent-list.component.html',
})
export class RentListComponent {
  constructor(private router: Router) { }  // Inject Router into the constructor

  // Hardcoded data for the table
  rentData = [
    { branch: 'SBI Mumbai Main Branch', landlordName: 'Ramesh Gupta', email: 'rameshgupta01@gmail.com', mobile: '+91 9876543210', deposit: '₹50,000' },
    { branch: 'HDFC Delhi Connaught Place', landlordName: 'Suman Verma', email: 'sumanverma123@gmail.com', mobile: '+91 9988776655', deposit: '₹1,00,000' },
    { branch: 'ICICI Bangalore Koramangala', landlordName: 'Anil Sharma', email: 'anilsharmabnk2@gmail.com', mobile: '+91 9123456789', deposit: '₹75,000' },
    { branch: 'Axis Kolkata Salt Lake', landlordName: 'Rajiv Mehta', email: 'rajivmehta.axis@gmail.com', mobile: '+91 9345678901', deposit: '₹85,000' },
    { branch: 'PNB Chennai T Nagar', landlordName: 'Saraswati Iyer', email: 'siyer.pnbchennai01@gmail.com', mobile: '+91 9098765432', deposit: '₹65,000' },
    { branch: 'Bank of Baroda Hyderabad Gachibowli', landlordName: 'Mukesh Kumar', email: 'mkumar.bobhyd@gmail.com', mobile: '+91 9234567890', deposit: '₹90,000' }
  ];

  showCreateRentAgreement = false; // Flag for the create rent agreement form

  // Define form fields
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

  onAdd(): void {
    // Logic to handle the Add action
// Navigate to '/layout/create-rent' page
this.router.navigate(['/layout/create-rent']);
}

  onCreate(): void {
    let allFieldsFilled = true;

    // Check each field for emptiness
    for (let key in this.formFields) {
      if (!this.formFields[key]) {
        allFieldsFilled = false;
        // Add logic to add the red border for empty fields
        document.getElementById(key)?.classList.add('is-invalid');
      } else {
        // Remove red border if the field is filled
        document.getElementById(key)?.classList.remove('is-invalid');
      }
    }

    if (!allFieldsFilled) {
      alert('All fields are mandatory!'); // Alert for mandatory fields
    } else {
      alert('Form submitted successfully!');
      // Handle form submission logic here
    }
  }

  onCancel(): void {
    this.showCreateRentAgreement = false; // Hide the form
  }

  onAttach(): void {
    // Logic for the Attach button
    console.log('Attach button clicked');
  }
}
